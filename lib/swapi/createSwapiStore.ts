"use client";

import { createFetchStore } from "@/lib/fetch-store/createFetchStore";

export const {
  FetchProvider: SwapiFetchProvider,
  useResource: useSwapiResource,
} = createFetchStore();
