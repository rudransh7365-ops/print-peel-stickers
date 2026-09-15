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
  "Premium print on thick matte paper. Sharp colours, clean edges, ready to put up.";

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
];

export const STICKER_TYPES = [
  "anime",
  "football",
  "sports",
  "typography",
  "minimal",
  "floral",
  "cars",
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
