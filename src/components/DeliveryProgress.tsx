import { FREE_DELIVERY_THRESHOLD, formatPrice } from "@/lib/config";
import { useStore } from "@/lib/store";

export function DeliveryProgress({ compact = false }: { compact?: boolean }) {
  const { subtotal, freeDelivery, remainingForFree } = useStore();
  const pct = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  return (
    <div className={`border-4 border-ink bg-paper ${compact ? "p-3" : "p-5"}`}>
      <div className="mb-2 flex items-end justify-between gap-3">
        <span className="font-mono text-[10px] font-extrabold tracking-widest uppercase">
          Free delivery
        </span>
        <span className="font-mono text-[10px] font-bold">
          {formatPrice(subtotal)} / {formatPrice(FREE_DELIVERY_THRESHOLD)}
        </span>
      </div>
      <div className="h-3 w-full border-2 border-ink bg-white">
        <div
          className={`h-full transition-[width] duration-500 ${freeDelivery ? "bg-neon-green" : "bg-accent"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-sm font-bold">
        {freeDelivery ? (
          <>🎉 FREE DELIVERY UNLOCKED</>
        ) : (
          <>Add {formatPrice(remainingForFree)} more to unlock FREE DELIVERY.</>
        )}
      </p>
    </div>
  );
}
