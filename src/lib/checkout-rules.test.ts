import assert from "node:assert/strict";
import { calculateVerifiedOrder } from "./checkout-rules";

const stickerId = "ronaldo-chibi-sticker-1";
const oneSticker = [{ productId: stickerId, size: "3 × 3 inch", qty: 1 }];

assert.equal(calculateVerifiedOrder(oneSticker, "Gwalior").delivery, 40, "Gwalior delivery remains ₹40");
assert.throws(() => calculateVerifiedOrder(oneSticker, "Udaipur"), /not delivering/, "orders outside Gwalior stay blocked");
assert.equal(calculateVerifiedOrder([{ productId: stickerId, size: "3 × 3 inch", qty: 18 }], "Gwalior").delivery, 0, "free delivery remains at the ₹180 threshold");
assert.throws(() => calculateVerifiedOrder([{ productId: stickerId, size: "unknown", qty: 1 }], "Gwalior"), /no longer available/, "unrecognized product sizes cannot be ordered");

console.log("Checkout delivery and catalog validation checks passed.");