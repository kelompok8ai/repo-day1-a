import Image from "next/image";
import { BRAND } from "@/lib/brand";

export function BankLogo({ size = 40 }: { size?: number }) {
  return (
    <Image
      src={BRAND.images.logo}
      alt="Bank Sumut"
      width={size}
      height={size}
      className="rounded-xl"
      priority
    />
  );
}
