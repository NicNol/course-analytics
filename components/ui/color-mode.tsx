"use client";

import { ThemeProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import * as React from "react";

/**
 * Chakra v3 removed its own colour-mode system in favour of next-themes.
 *
 * Deliberately no `useColorModeValue` here. The theme is unknown during SSR but
 * read from localStorage on the client's first render, so a hook that returns a
 * different value on each side makes Emotion emit a different class name and
 * React fails hydration. Use CSS conditional values instead —
 * `bg={{ base: "white", _dark: "gray.800" }}` — which resolve at paint time.
 *
 * `useColorMode` is safe because it is only read inside event handlers.
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
