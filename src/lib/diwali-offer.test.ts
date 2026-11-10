import assert from "node:assert/strict";
import { canonicalizeOrderItems, getPosterPairs, normalizeCartItems, stickerSalePrice, type OfferProduct } from "./diwali-offer";
import type { CartItem } from "./store";

const products: OfferProduct[] = [
  { id: "p1", name: "Poster One", category: "posters", sizes: [{ label: "1/4 A4", price: 25 }, { label: "1/2 A4", price: 50 }], images: ["one.jpg"] },
  { id: "p2", name: "Poster Two", category: "posters", sizes: [{ label: "1/4 A4", price: 25 }, { label: "1/2 A4", price: 50 }], images: ["two.jpg"] },
  { id: "s1", name: "Sticker", category: "stickers", sizes: [{ label: "3 × 3 inch", price: 10 }, { label: "4 × 4 inch", price: 15 }], images: ["sticker.jpg"] },
];
const poster = (productId: string, size = "1/4 A4", qty = 1): CartItem => ({ key: `${productId}-${size}`, productId, name: "Poster", size, price: 25, qty });

assert.equal(stickerSalePrice("stickers", "4 × 4 inch", 15), 10, "4×4 sticker sale is ₹10 from ₹15");
assert.equal(stickerSalePrice("stickers", "3 × 3 inch", 10), 10, "3×3 sticker remains ₹10");
assert.equal(stickerSalePrice("posters", "1/4 A4", 25), 25, "poster catalog prices remain unchanged");
assert.equal(getPosterPairs([poster("p1")], products).length, 0, "one paid poster does not unlock a gift");
assert.deepEqual(getPosterPairs([poster("p1", "1/4 A4", 2)], products), [{ index: 0, qualifyingSizes: ["1/4 A4"] }], "two same-size paid posters unlock one same-size gift");
assert.equal(getPosterPairs([poster("p1", "1/4 A4", 4)], products).length, 2, "four paid posters unlock two gifts");
assert.deepEqual(getPosterPairs([poster("p1", "1/4 A4"), poster("p2", "1/2 A4")], products)[0]?.qualifyingSizes, ["1/4 A4", "1/2 A4"], "mixed-size pair allows either qualifying size");
assert.equal(getPosterPairs([poster("p1", "1/4 A4")], products).length, 0, "removing a qualifying poster removes eligibility");

const qualified: CartItem[] = [poster("p1", "1/4 A4", 2)];
const withGift = normalizeCartItems([...qualified, { ...poster("p2", "1/4 A4"), key: "free-0", price: 0, qty: 1, freePosterGiftFor: 0 }], products);
assert.equal(withGift.find((item) => item.freePosterGiftFor === 0)?.price, 0, "free poster remains ₹0 in the cart");
assert.equal(normalizeCartItems([poster("p1") , ...withGift.filter((item) => item.freePosterGiftFor !== undefined)], products).some((item) => item.freePosterGiftFor !== undefined), false, "removing a qualifying poster removes the gift");
assert.throws(() => canonicalizeOrderItems(qualified, products), /Choose every free poster/, "checkout rejects a qualified cart without selected gifts");
const checked = canonicalizeOrderItems(withGift, products);
assert.equal(checked.reduce((sum, item) => sum + item.price * item.qty, 0), 50, "checkout subtotal excludes the free poster");
assert.equal(checked.find((item) => item.freePosterGiftFor === 0)?.price, 0, "order records the gift at zero price");

console.log("Diwali offer pricing, pairing, removal, and order validation checks passed.");