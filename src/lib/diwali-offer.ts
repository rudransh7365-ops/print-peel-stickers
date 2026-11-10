import type { CartItem } from "@/lib/store";

export type OfferProduct = {
  id: string;
  name: string;
  category: "stickers" | "posters";
  sizes: { label: string; price: number }[];
  images: string[];
};

export type PosterPair = { index: number; qualifyingSizes: string[] };

export function stickerSalePrice(category: string, size: string, regularPrice: number) {
  return category === "stickers" && /4\s*[×x]\s*4/i.test(size) ? 10 : regularPrice;
}

export function getPosterPairs(
  items: Pick<CartItem, "productId" | "size" | "qty" | "freePosterGiftFor">[],
  products: readonly Pick<OfferProduct, "id" | "category">[],
): PosterPair[] {
  const byId = new Map(products.map((product) => [product.id, product]));
  const units: string[] = [];
  for (const item of items) {
    if (item.freePosterGiftFor !== undefined || byId.get(item.productId ?? "")?.category !== "posters") continue;
    for (let unit = 0; unit < item.qty; unit += 1) units.push(item.size);
  }
  const pairs: PosterPair[] = [];
  for (let unit = 0; unit + 1 < units.length; unit += 2) {
    pairs.push({ index: pairs.length, qualifyingSizes: [...new Set([units[unit], units[unit + 1]])] });
  }
  return pairs;
}

export function normalizeCartItems<T extends CartItem>(items: T[], products: readonly OfferProduct[]): T[] {
  const byId = new Map(products.map((product) => [product.id, product]));
  const repriced = items.map((item) => {
    if (!item.productId || item.custom) return item;
    const product = byId.get(item.productId);
    const selected = product?.sizes.find((option) => option.label === item.size);
    if (!product || !selected) return item;
    if (item.freePosterGiftFor !== undefined) return { ...item, price: 0 };
    return { ...item, price: stickerSalePrice(product.category, item.size, selected.price) };
  });

  const pairs = getPosterPairs(repriced, products);
  const seen = new Set<number>();
  return repriced.flatMap((item) => {
    if (item.freePosterGiftFor === undefined) return [item];
    const pair = pairs[item.freePosterGiftFor];
    const product = byId.get(item.productId ?? "");
    if (!pair || !product || product.category !== "posters" || item.qty !== 1 || seen.has(pair.index)) return [];
    seen.add(pair.index);
    const size = pair.qualifyingSizes.includes(item.size) ? item.size : pair.qualifyingSizes[0];
    return [{ ...item, size, price: 0 }];
  });
}

export function canonicalizeOrderItems(
  items: Pick<CartItem, "productId" | "name" | "image" | "size" | "qty" | "freePosterGiftFor">[],
  products: readonly OfferProduct[],
) {
  const byId = new Map(products.map((product) => [product.id, product]));
  const paid = items.filter((item) => item.freePosterGiftFor === undefined);
  const free = items.filter((item) => item.freePosterGiftFor !== undefined);
  const pairs = getPosterPairs(paid, products);

  if (items.length === 0 || items.length > 200) throw new Error("Your cart items could not be verified.");
  for (const item of items) {
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 99) throw new Error("Please check item quantities in your cart.");
    const product = byId.get(item.productId ?? "");
    if (!product) throw new Error("A product in your cart is no longer available.");
    const size = product.sizes.find((option) => option.label === item.size);
    if (!size) throw new Error(`The selected size for ${product.name} is no longer available.`);
    if (item.freePosterGiftFor !== undefined && product.category !== "posters") throw new Error("The free item must be a poster.");
  }
  if (free.length !== pairs.length) throw new Error("Choose every free poster before placing your order.");

  const giftsByPair = new Set<number>();
  const canonicalPaid = paid.map((item) => {
    const product = byId.get(item.productId ?? "");
    if (!product) throw new Error("A product in your cart is no longer available.");
    const selected = product.sizes.find((option) => option.label === item.size);
    if (!selected) throw new Error("A selected size is no longer available.");
    return {
      productId: product.id,
      name: product.name,
      image: product.images[0] ?? "",
      size: selected.label,
      price: stickerSalePrice(product.category, selected.label, selected.price),
      qty: item.qty,
    };
  });
  const canonicalFree = free.map((item) => {
    const pairIndex = item.freePosterGiftFor;
    const pair = typeof pairIndex === "number" ? pairs[pairIndex] : undefined;
    const product = byId.get(item.productId ?? "");
    if (!pair || !product || giftsByPair.has(pairIndex)) throw new Error("A free poster selection needs to be refreshed.");
    if (!pair.qualifyingSizes.includes(item.size)) throw new Error("A free poster cannot be larger than its qualifying pair.");
    const selected = product.sizes.find((option) => option.label === item.size);
    if (!selected) throw new Error("The free poster size is unavailable.");
    giftsByPair.add(pairIndex);
    return {
      productId: product.id,
      name: product.name,
      image: product.images[0] ?? "",
      size: selected.label,
      price: 0,
      qty: 1,
      freePosterGiftFor: pairIndex,
    };
  });
  if (giftsByPair.size !== pairs.length) throw new Error("Choose every free poster before placing your order.");

  return [...canonicalPaid, ...canonicalFree];
}