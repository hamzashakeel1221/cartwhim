import {
  Baby, BatteryCharging, Car, ChefHat, CookingPot, Dumbbell, GlassWater, Headphones, Lamp,
  Fan, Glasses, Package, Pencil, Smartphone, Utensils, Scissors, ShoppingBag, Sparkles, SprayCan, Wallet, Watch, type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  baby: Baby, "battery-charging": BatteryCharging, car: Car, "chef-hat": ChefHat,
  "cooking-pot": CookingPot, dumbbell: Dumbbell, "glass-water": GlassWater, headphones: Headphones,
  lamp: Lamp, fan: Fan, glasses: Glasses, smartphone: Smartphone, utensils: Utensils, pencil: Pencil, scissors: Scissors, "shopping-bag": ShoppingBag, sparkles: Sparkles,
  "spray-can": SprayCan, wallet: Wallet, watch: Watch,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = map[name] ?? Package;
  return <C className={className} aria-hidden />;
}
