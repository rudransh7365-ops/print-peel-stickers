import dreadlockBoy1 from "@/assets/dreadlock-boy-1.jpg.asset.json";
import ronaldoChibi1 from "@/assets/ronaldo-chibi-1.jpg.asset.json";
import cristianoPoster1 from "@/assets/cristiano-poster-1.jpg.asset.json";
import hibiscus1 from "@/assets/hibiscus-bloom-1.jpg.asset.json";
import tulip1 from "@/assets/tulip-envelope-1.jpg.asset.json";
import limited1 from "@/assets/limited-edition-1.png.asset.json";
import gojo1 from "@/assets/gojo-run-1.png.asset.json";
import neymar1 from "@/assets/neymar-jr-1.png.asset.json";
import rengoku1 from "@/assets/rengoku-1.png.asset.json";
import bmwPoster1 from "@/assets/bmw-m4-poster-1.png.asset.json";
import zoroThreeSword1 from "@/assets/zoro-three-sword-1.png.asset.json";
import strawHatCrew1 from "@/assets/straw-hat-crew-1.png.asset.json";
import zenitsuThunderPoster1 from "@/assets/zenitsu-thunder-poster-1.png.asset.json";
import porsche911RainPoster1 from "@/assets/porsche-911-rain-poster-1.png.asset.json";
import bmwM4StreetPoster2 from "@/assets/bmw-m4-street-poster-2.png.asset.json";
import bugattiAirfieldPoster1 from "@/assets/bugatti-airfield-poster-1.png.asset.json";
import beanStreetwear1 from "@/assets/bean-streetwear-1.jpg.asset.json";
import shrekSlay1 from "@/assets/shrek-slay-1.jpg.asset.json";
import evilEyeProtection1 from "@/assets/evil-eye-protection-1.jpg.asset.json";
import messi10Sticker1 from "@/assets/messi-10-sticker-1.png.asset.json";
import lokiTricksterSticker1 from "@/assets/loki-trickster-sticker-1.png.asset.json";
import zenitsuSwordSticker1 from "@/assets/zenitsu-sword-sticker-1.jpeg.asset.json";
import luffyPeekSticker1 from "@/assets/luffy-peek-sticker-1.jpeg.asset.json";
import sukunaCurseSticker1 from "@/assets/sukuna-curse-sticker-1.jpeg.asset.json";
import brolyPowerSticker1 from "@/assets/broly-power-sticker-1.jpeg.asset.json";
import gojoPurpleSticker2 from "@/assets/gojo-purple-sticker-2.jpeg.asset.json";
import itachiAkatsukiSticker1 from "@/assets/itachi-akatsuki-sticker-1.jpg.asset.json";
import luffyKingQuoteSticker1 from "@/assets/luffy-king-quote-sticker-1.jpg.asset.json";

export type Category = "stickers" | "posters";

export type SizeOption = { label: string; price: number };

export type Product = {
  id: string;
  name: string;
  category: Category;
  /** sticker type used by the filter pills: anime, football, meme, typography, sports, minimal, floral, cars */
  types: string[];
  description: string;
  /** base price, shown on cards */
  price: number;
  sizes: SizeOption[];
  /** first image is the card image. Add more images to this array to extend a product gallery. */
  images: string[];
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  recentlyAdded?: boolean;
  limited?: boolean;
  popular?: boolean;
};

const STICKER_SIZES: SizeOption[] = [
  { label: "3 × 3 inch", price: 20 },
  { label: "5 × 5 inch", price: 35 },
];

const POSTER_SIZES: SizeOption[] = [
  { label: "1/4 A4", price: 30 },
  { label: "1/2 A4", price: 50 },
  { label: "A4", price: 80 },
];

const STICKER_DESC =
  "Premium laminated vinyl sticker. Water resistant, scratch resistant and easy to clean.";
const POSTER_DESC =
  "Premium self-adhesive poster on thick matte paper. Sharp colours, clean edges and ready to stick up.";

export const PRODUCTS: Product[] = [
  {
    id: "ronaldo-chibi-sticker-1",
    name: "Ronaldo Chibi Sticker #1",
    category: "stickers",
    types: ["football", "sports"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [ronaldoChibi1.url],
    tags: ["Football", "Ronaldo", "Sports", "Trending"],
    featured: true,
    trending: true,
    bestSeller: true,
  },
  {
    id: "gojo-run-sticker-1",
    name: "Gojo Run Sticker #1",
    category: "stickers",
    types: ["anime"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [gojo1.url],
    tags: ["Anime", "Gojo", "Jujutsu", "Trending"],
    featured: true,
    trending: true,
    popular: true,
  },
  {
    id: "rengoku-flame-sticker-1",
    name: "Rengoku Flame Sticker #1",
    category: "stickers",
    types: ["anime"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [rengoku1.url],
    tags: ["Anime", "Rengoku", "Demon Slayer"],
    featured: true,
    bestSeller: true,
  },
  {
    id: "neymar-jr-sticker-1",
    name: "Neymar Jr Sticker #1",
    category: "stickers",
    types: ["football", "sports"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [neymar1.url],
    tags: ["Football", "Neymar", "Brazil", "Sports"],
    trending: true,
    recentlyAdded: true,
  },
  {
    id: "dreadlock-boy-sticker-1",
    name: "Dreadlock Boy Sticker #1",
    category: "stickers",
    types: ["minimal"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [dreadlockBoy1.url],
    tags: ["Minimal", "Rap", "Portrait"],
    featured: true,
    recentlyAdded: true,
  },
  {
    id: "limited-edition-sticker-1",
    name: "Limited Edition Sticker #1",
    category: "stickers",
    types: ["typography"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [limited1.url],
    tags: ["Typography", "Bold", "Limited"],
    limited: true,
    trending: true,
  },
  {
    id: "hibiscus-bloom-sticker-1",
    name: "Hibiscus Bloom Sticker #1",
    category: "stickers",
    types: ["floral", "minimal"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [hibiscus1.url],
    tags: ["Floral", "Pink", "Aesthetic"],
    bestSeller: true,
  },
  {
    id: "tulip-envelope-sticker-1",
    name: "Tulip Envelope Sticker #1",
    category: "stickers",
    types: ["floral", "minimal"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [tulip1.url],
    tags: ["Floral", "Cute", "Aesthetic"],
    recentlyAdded: true,
    popular: true,
  },
  {
    id: "zoro-three-sword-sticker-1",
    name: "Zoro Three Sword Sticker #1",
    category: "stickers",
    types: ["anime"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [zoroThreeSword1.url],
    tags: ["Anime", "Zoro", "One Piece", "Sword"],
    recentlyAdded: true,
    trending: true,
  },
  {
    id: "straw-hat-crew-sticker-1",
    name: "Straw Hat Crew Sticker #1",
    category: "stickers",
    types: ["anime", "minimal"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [strawHatCrew1.url],
    tags: ["Anime", "One Piece", "Crew", "Manga"],
    recentlyAdded: true,
    popular: true,
  },
  {
    id: "bean-streetwear-sticker-1",
    name: "Bean Streetwear Sticker #1",
    category: "stickers",
    types: ["meme"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [beanStreetwear1.url],
    tags: ["Meme", "Bean", "Streetwear", "Funny"],
    recentlyAdded: true,
  },
  {
    id: "shrek-slay-sticker-1",
    name: "Shrek Slay Sticker #1",
    category: "stickers",
    types: ["meme"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [shrekSlay1.url],
    tags: ["Meme", "Shrek", "Funny", "Sunglasses"],
    recentlyAdded: true,
    popular: true,
  },
  {
    id: "evil-eye-protection-sticker-1",
    name: "Evil Eye Protection Sticker #1",
    category: "stickers",
    types: ["typography", "minimal"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [evilEyeProtection1.url],
    tags: ["Evil Eye", "Protection", "Typography", "Symbol"],
    recentlyAdded: true,
  },
  {
    id: "cristiano-poster-1",
    name: "Cristiano Poster #1",
    category: "posters",
    types: ["football", "sports"],
    description: POSTER_DESC,
    price: 30,
    sizes: POSTER_SIZES,
    images: [cristianoPoster1.url],
    tags: ["Football", "Ronaldo", "Poster", "Trending"],
    featured: true,
    trending: true,
    bestSeller: true,
  },
  {
    id: "bmw-m4-poster-1",
    name: "BMW M4 Poster #1",
    category: "posters",
    types: ["cars"],
    description: POSTER_DESC,
    price: 30,
    sizes: POSTER_SIZES,
    images: [bmwPoster1.url],
    tags: ["Cars", "BMW", "Poster"],
    recentlyAdded: true,
    popular: true,
  },
  {
    id: "zenitsu-thunder-poster-1",
    name: "Zenitsu Thunder Poster #1",
    category: "posters",
    types: ["anime"],
    description: POSTER_DESC,
    price: 30,
    sizes: POSTER_SIZES,
    images: [zenitsuThunderPoster1.url],
    tags: ["Anime", "Zenitsu", "Demon Slayer", "Thunder"],
    recentlyAdded: true,
    trending: true,
  },
  {
    id: "porsche-911-rain-poster-1",
    name: "Porsche 911 Rain Poster #1",
    category: "posters",
    types: ["cars"],
    description: POSTER_DESC,
    price: 30,
    sizes: POSTER_SIZES,
    images: [porsche911RainPoster1.url],
    tags: ["Cars", "Porsche", "911", "Motorsport"],
    recentlyAdded: true,
    bestSeller: true,
  },
  {
    id: "bmw-m4-street-poster-2",
    name: "BMW M4 Street Poster #2",
    category: "posters",
    types: ["cars"],
    description: POSTER_DESC,
    price: 30,
    sizes: POSTER_SIZES,
    images: [bmwM4StreetPoster2.url],
    tags: ["Cars", "BMW", "M4", "Street"],
    recentlyAdded: true,
    trending: true,
  },
  {
    id: "bugatti-airfield-poster-1",
    name: "Bugatti Airfield Poster #1",
    category: "posters",
    types: ["cars"],
    description: POSTER_DESC,
    price: 30,
    sizes: POSTER_SIZES,
    images: [bugattiAirfieldPoster1.url],
    tags: ["Cars", "Bugatti", "Jet", "Airfield"],
    recentlyAdded: true,
    popular: true,
  },
  {
    id: "cristiano-sticker-1",
    name: "Cristiano Red Seven Sticker #1",
    category: "stickers",
    types: ["football", "sports"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [cristianoPoster1.url],
    tags: ["Football", "Ronaldo", "CR7", "Sports"],
    recentlyAdded: true,
  },
  {
    id: "bmw-m4-editorial-sticker-1",
    name: "BMW M4 Editorial Sticker #1",
    category: "stickers",
    types: ["cars"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [bmwPoster1.url],
    tags: ["Cars", "BMW", "M4", "Editorial"],
    recentlyAdded: true,
  },
  {
    id: "zenitsu-thunder-sticker-1",
    name: "Zenitsu Thunder Sticker #1",
    category: "stickers",
    types: ["anime"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [zenitsuThunderPoster1.url],
    tags: ["Anime", "Zenitsu", "Demon Slayer", "Thunder"],
    recentlyAdded: true,
  },
  {
    id: "porsche-911-rain-sticker-1",
    name: "Porsche 911 Rain Sticker #1",
    category: "stickers",
    types: ["cars"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [porsche911RainPoster1.url],
    tags: ["Cars", "Porsche", "911", "Rain"],
    recentlyAdded: true,
  },
  {
    id: "bmw-m4-street-sticker-2",
    name: "BMW M4 Street Sticker #2",
    category: "stickers",
    types: ["cars"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [bmwM4StreetPoster2.url],
    tags: ["Cars", "BMW", "M4", "Street"],
    recentlyAdded: true,
  },
  {
    id: "bugatti-airfield-sticker-1",
    name: "Bugatti Airfield Sticker #1",
    category: "stickers",
    types: ["cars"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [bugattiAirfieldPoster1.url],
    tags: ["Cars", "Bugatti", "Jet", "Airfield"],
    recentlyAdded: true,
  },
  {
    id: "messi-10-sticker-1",
    name: "Messi Number 10 Sticker #1",
    category: "stickers",
    types: ["football", "sports", "typography"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [messi10Sticker1.url],
    tags: ["Football", "Messi", "Number 10", "Typography"],
    recentlyAdded: true,
  },
  {
    id: "loki-trickster-sticker-1",
    name: "Loki Trickster Sticker #1",
    category: "stickers",
    types: ["minimal", "typography"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [lokiTricksterSticker1.url],
    tags: ["Loki", "Trickster", "Helmet", "Typography"],
    recentlyAdded: true,
  },
  {
    id: "zenitsu-sword-sticker-1",
    name: "Zenitsu Sword Sticker #1",
    category: "stickers",
    types: ["anime"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [zenitsuSwordSticker1.url],
    tags: ["Anime", "Zenitsu", "Demon Slayer", "Sword"],
    recentlyAdded: true,
  },
  {
    id: "luffy-peek-sticker-1",
    name: "Luffy Peek Sticker #1",
    category: "stickers",
    types: ["anime"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [luffyPeekSticker1.url],
    tags: ["Anime", "Luffy", "One Piece", "Straw Hat"],
    recentlyAdded: true,
    popular: true,
  },
  {
    id: "sukuna-curse-sticker-1",
    name: "Sukuna Curse Sticker #1",
    category: "stickers",
    types: ["anime"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [sukunaCurseSticker1.url],
    tags: ["Anime", "Sukuna", "Jujutsu", "Curse"],
    recentlyAdded: true,
  },
  {
    id: "broly-power-sticker-1",
    name: "Broly Power Sticker #1",
    category: "stickers",
    types: ["anime"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [brolyPowerSticker1.url],
    tags: ["Anime", "Broly", "Dragon Ball", "Power"],
    recentlyAdded: true,
  },
  {
    id: "gojo-purple-sticker-2",
    name: "Gojo Purple Aura Sticker #2",
    category: "stickers",
    types: ["anime"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [gojoPurpleSticker2.url],
    tags: ["Anime", "Gojo", "Jujutsu", "Purple Aura"],
    recentlyAdded: true,
    trending: true,
  },
  {
    id: "itachi-akatsuki-sticker-1",
    name: "Itachi Akatsuki Sticker #1",
    category: "stickers",
    types: ["anime", "minimal"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [itachiAkatsukiSticker1.url],
    tags: ["Anime", "Itachi", "Naruto", "Akatsuki"],
    recentlyAdded: true,
  },
  {
    id: "luffy-king-quote-sticker-1",
    name: "Luffy King Quote Sticker #1",
    category: "stickers",
    types: ["anime", "typography"],
    description: STICKER_DESC,
    price: 20,
    sizes: STICKER_SIZES,
    images: [luffyKingQuoteSticker1.url],
    tags: ["Anime", "Luffy", "One Piece", "Quote"],
    recentlyAdded: true,
  },
];

export const STICKER_TYPES = [
  "anime",
  "football",
  "sports",
  "typography",
  "minimal",
  "floral",
  "cars",
  "meme",
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const searchProducts = (q: string) => {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return PRODUCTS.filter((p) =>
    [p.name, p.category, p.description, ...p.tags, ...p.types]
      .join(" ")
      .toLowerCase()
      .includes(s),
  );
};
