import { createServerFn } from "@tanstack/react-start";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";
const SUPABASE_URL = "https://ccogfgpkostjofuushek.supabase.co";
const SUPABASE_KEY = "sb_publishable_3JK1K6rsjWGDY5hQPQJx8g_f0DfyvUN";

// Gwalior, Madhya Pradesh bounding box
const GWALIOR = { low: { latitude: 26.1, longitude: 78.0 }, high: { latitude: 26.35, longitude: 78.35 } };

export type ResolvedAddress = {
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lon: number;
};

async function requireUser(token: unknown) {
  if (typeof token !== "string" || token.length < 20) throw new Error("Please sign in to use address search");
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Your sign-in has expired. Please sign in again.");
}

function headers(extra: Record<string, string> = {}) {
  const lovable = process.env["LOVABLE_API_KEY"];
  const maps = process.env["GOOGLE_MAPS_API_KEY"];
  if (!lovable || !maps) throw new Error("Google Maps is not configured");
  return { Authorization: `Bearer ${lovable}`, "X-Connection-Api-Key": maps, ...extra };
}

async function check(res: Response) {
  if (!res.ok) {
    const body = await res.text();
    console.error(`Google Maps request failed [${res.status}]: ${body}`);
    throw new Error(`Google Maps request failed [${res.status}]`);
  }
  return res.json();
}

type Comp = { types: string[]; long: string };
function build(comps: Comp[], formatted: string, lat: number, lon: number): ResolvedAddress {
  const get = (...types: string[]) => {
    for (const t of types) { const c = comps.find((x) => x.types.includes(t)); if (c) return c.long; }
    return "";
  };
  const street = [get("premise", "street_number"), get("route")].filter(Boolean).join(", ");
  const area = get("neighborhood", "sublocality_level_2", "sublocality_level_1", "sublocality");
  const parts = [...new Set([street, get("neighborhood"), get("sublocality_level_2"), get("sublocality_level_1")].filter(Boolean))];
  return {
    address: parts.join(", ") || formatted,
    area,
    city: get("locality", "administrative_area_level_3", "administrative_area_level_2"),
    state: get("administrative_area_level_1"),
    pincode: get("postal_code"),
    lat, lon,
  };
}

export const autocompleteAddress = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string; input: string; sessionToken: string }) => {
    const input = String(d.input ?? "").trim().slice(0, 120);
    return { token: d.token, input, sessionToken: String(d.sessionToken ?? "").slice(0, 64) };
  })
  .handler(async ({ data }) => {
    await requireUser(data.token);
    if (data.input.length < 2) return [] as { placeId: string; text: string }[];
    const res = await fetch(`${GATEWAY_URL}/places/v1/places:autocomplete`, {
      method: "POST",
      headers: headers({
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "suggestions.placePrediction.placeId,suggestions.placePrediction.text.text",
      }),
      body: JSON.stringify({
        input: data.input,
        sessionToken: data.sessionToken || undefined,
        includedRegionCodes: ["in"],
        locationRestriction: { rectangle: GWALIOR },
      }),
    });
    const json = await check(res);
    return ((json.suggestions ?? []) as Array<{ placePrediction?: { placeId: string; text: { text: string } } }>)
      .filter((s) => s.placePrediction)
      .slice(0, 6)
      .map((s) => ({ placeId: s.placePrediction!.placeId, text: s.placePrediction!.text.text }));
  });

export const placeDetails = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string; placeId: string; sessionToken: string }) => {
    const placeId = String(d.placeId ?? "");
    if (!/^[A-Za-z0-9_-]{10,300}$/.test(placeId)) throw new Error("Invalid place");
    return { token: d.token, placeId, sessionToken: String(d.sessionToken ?? "").slice(0, 64) };
  })
  .handler(async ({ data }) => {
    await requireUser(data.token);
    const qs = data.sessionToken ? `?sessionToken=${encodeURIComponent(data.sessionToken)}` : "";
    const res = await fetch(`${GATEWAY_URL}/places/v1/places/${data.placeId}${qs}`, {
      headers: headers({ "X-Goog-FieldMask": "id,displayName,formattedAddress,location,addressComponents" }),
    });
    const p = await check(res);
    const comps: Comp[] = (p.addressComponents ?? []).map((c: { types: string[]; longText: string }) => ({ types: c.types, long: c.longText }));
    const r = build(comps, p.formattedAddress ?? "", p.location.latitude, p.location.longitude);
    const name = p.displayName?.text as string | undefined;
    if (name && !r.address.toLowerCase().includes(name.toLowerCase())) r.address = `${name}, ${r.address}`;
    // Fill a missing pincode from reverse geocoding the exact point
    if (!r.pincode) r.pincode = (await reverse(r.lat, r.lon)).pincode;
    return r;
  });

async function reverse(lat: number, lon: number): Promise<ResolvedAddress> {
  const res = await fetch(`${GATEWAY_URL}/maps/api/geocode/json?latlng=${lat},${lon}&language=en&region=in`, { headers: headers() });
  const json = await check(res);
  if (json.status !== "OK" || !json.results?.length) throw new Error(`Could not find this address (${json.status})`);
  type R = { formatted_address: string; types: string[]; address_components: { types: string[]; long_name: string }[] };
  const results = json.results as R[];
  const best = results.find((r) => r.types.some((t) => ["street_address", "premise", "subpremise", "plus_code"].includes(t))) ?? results[0]!;
  // Merge components from all results (most precise first) so area + pincode are always found
  const comps: Comp[] = [best, ...results].flatMap((r) => r.address_components.map((c) => ({ types: c.types, long: c.long_name })))
    .filter((c) => !c.types.includes("plus_code"));
  return build(comps, best.formatted_address, lat, lon);
}

export const reverseGeocode = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string; lat: number; lon: number }) => {
    const lat = Number(d.lat), lon = Number(d.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) throw new Error("Invalid location");
    return { token: d.token, lat, lon };
  })
  .handler(async ({ data }) => {
    await requireUser(data.token);
    return reverse(data.lat, data.lon);
  });
