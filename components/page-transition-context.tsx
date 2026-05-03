"use client";

import { createContext, useContext } from "react";

export type PageTransitionApi = {
  startNavigate: (href: string) => void;
};

export const PageTransitionContext =
  createContext<PageTransitionApi | null>(null);

export function usePageTransition() {
  return useContext(PageTransitionContext);
}
