import Image from "next/image";
import { BRAND } from "@/lib/brand";

export function DashboardHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="relative mx-6 mt-6 overflow-hidden rounded-2xl shadow-lg">
      <div className="relative h-44 sm:h-52">
        <Image
          src={BRAND.images.dashboardBanner}
          alt="Bank Sumut Corporate"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-900/70 to-navy-900/30" />
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <div className="mb-2 h-1 w-12 rounded-full bg-brand-500" />
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
          {subtitle && (
            <p className="mt-2 max-w-xl text-sm text-slate-300">{subtitle}</p>
          )}
        </div>
        <div className="absolute bottom-4 right-4 hidden overflow-hidden rounded-lg border border-white/20 sm:block">
          <Image
            src={BRAND.images.corporate}
            alt="Bank Sumut"
            width={100}
            height={64}
            className="h-16 w-auto object-cover opacity-90"
          />
        </div>
      </div>
    </div>
  );
}
