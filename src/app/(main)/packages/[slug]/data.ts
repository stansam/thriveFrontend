import { cache } from "react";
import { MainService } from "@/lib/services/main.service";

export const getPackageDetailsCached = cache(async (slug: string) => {
  return await MainService.getPackageDetails(slug);
});