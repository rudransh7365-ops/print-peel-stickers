import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { FREE_DELIVERY_THRESHOLD } from "./config";

export type CartItem = {
  /** unique line key */
  key: string;
  productId?: string;
  name: string;
  image?: string;
  size: string;
  price: number;
  qty: number;
  custom?: {
    shape: string;
    size: string;
    instructions: string;
    hasImage: boolean;
    imageName?: string;
    imageDataUrl?: string;
  };
};

type Store = {
  cart: CartItem[];
  wishlist: string[];
  recent: string[];
  addToCart: (item: Omit<CartItem, "key"> & { key?: string }) => void;
  removeFromCart: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  pushRecent: (id: string) => void;
  count: number;
  subtotal: number;
  freeDelivery: boolean;
  remainingForFree: number;
  hydrated: boolean;
};

const StoreContext = createContext<Store | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(read<CartItem[]>("pp_cart", []));
    setWishlist(read<string[]>("pp_wishlist", []));
    setRecent(read<string[]>("pp_recent", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("pp_cart", JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem("pp_wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem("pp_recent", JSON.stringify(recent));
  }, [recent, hydrated]);

  const addToCart = useCallback((item: Omit<CartItem, "key"> & { key?: string }) => {
    const key =
      item.key ?? (item.custom ? `custom-${Date.now()}` : `${item.productId}-${item.size}`);
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + item.qty } : i));
      }
      return [...prev, { ...item, key }];
    });
    toast.success("Added to cart", { description: `${item.name} · ${item.size}` });
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      prev.flatMap((i) => (i.key === key ? (qty < 1 ? [] : [{ ...i, qty }]) : [i])),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => {
      const has = prev.includes(id);
      toast.success(has ? "Removed from wishlist" : "Saved to wishlist");
      return has ? prev.filter((x) => x !== id) : [...prev, id];
    });
  }, []);

  const pushRecent = useCallback((id: string) => {
    setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8));
  }, []);

  const value = useMemo<Store>(() => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    return {
      cart,
      wishlist,
      recent,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      toggleWishlist,
      isWishlisted: (id) => wishlist.includes(id),
      pushRecent,
      count: cart.reduce((s, i) => s + i.qty, 0),
      subtotal,
      freeDelivery: subtotal >= FREE_DELIVERY_THRESHOLD,
      remainingForFree: Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
      hydrated,
    };
  }, [
    cart,
    wishlist,
    recent,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    toggleWishlist,
    pushRecent,
    hydrated,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
