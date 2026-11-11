import { PRODUCTS } from "@/data/products";
import { DELIVERY_FEE_STANDARD, FREE_DELIVERY_THRESHOLD, deliveryFeeForCity, isServiceableCity } from "@/lib/config";

export type CheckoutItemInput = {
  key?: string;
  productId: string;
  size: string;
  qty: number;
};

export function calculateVerifiedOrder(items: CheckoutItemInput[], city: string) {
  if (!isServiceableCity(city)) throw new Error("We are not delivering to this area yet. Please enter a Gwalior address.");
  if (items.length === 0 || items.length > 100) throw new Error("Your cart is empty or could not be verified.");

  const verified = items.map((item) => {
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 99) {
      throw new Error("Please check item quantities in your cart.");
    }
    const product = PRODUCTS.find((candidate) => candidate.id === item.productId);
    const size = product?.sizes.find((candidate) => candidate.label === item.size);
    if (!product || !size) throw new Error("A product or size in your cart is no longer available.");
    return {
      key: item.key ?? `${product.id}-${size.label}`,
      productId: product.id,
      name: product.name,
      image: product.images[0] ?? "",
      size: size.label,
      price: size.price,
      qty: item.qty,
    };
  });

  const subtotal = verified.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : deliveryFeeForCity(city) || DELIVERY_FEE_STANDARD;
  return { items: verified, subtotal, delivery, total: subtotal + delivery };
}