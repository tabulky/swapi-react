"use client";

import { createFetchStore } from "@/lib/fetch-store/createFetchStore";

export { PlanetsResource } from "./resources";

export const {
  FetchProvider: SwapiFetchProvider,
  useResource: useSwapiResource,
} = createFetchStore();
