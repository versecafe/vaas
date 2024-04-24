"use server";

import { VsasRequest } from "@/lib/vaas/speed-insights";
import { vsas } from "@/lib/vaas/speed-insights";

export async function callVsas(request: VsasRequest) {
  return await vsas(request);
}
