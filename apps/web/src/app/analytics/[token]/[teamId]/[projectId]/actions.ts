"use server";

import { VaasRequest, vaas } from "@/lib/vaas/core";

export async function callVaas(request: VaasRequest) {
  return await vaas(request);
}
