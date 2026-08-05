"use client";

import { ThemeProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import * as React from "react";

/**
 * Chakra v3 removed its own colour-mode system in favour of next-themes.
 * These re-exports keep the v2 `useColorMode` / `useColorModeValue` API so the
 * ~30 existing call sites only had to change their import path.
 */

export type ColorMode = "light" | "dark";

export function ColorModeProvider(props: ThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      defaultTheme="light"
      /* v2 stored the preference under this key — reuse it so returning
         visitors keep their choice instead of being reset to light. */
      storageKey="chakra-ui-color-mode"
      {...props}
    />
  );
}

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleColorMode = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return {
    colorMode: resolvedTheme as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue<Light, Dark>(light: Light, dark: Dark) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}
