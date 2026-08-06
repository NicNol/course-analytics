import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const fontStack =
  'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: fontStack },
        body: { value: fontStack },
      },
      sizes: {
        content: { value: "1054px" },
      },
    },

    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { _light: "{colors.white}", _dark: "{colors.gray.900}" } },
          subtle: { value: { _light: "{colors.gray.50}", _dark: "{colors.gray.800}" } },
          muted: { value: { _light: "{colors.gray.100}", _dark: "{colors.gray.700}" } },
          panel: { value: { _light: "{colors.white}", _dark: "{colors.gray.800}" } },
        },
        chrome: {
          bg: { value: { _light: "{colors.gray.900}", _dark: "{colors.gray.950}" } },
          fg: { value: { _light: "{colors.gray.50}", _dark: "{colors.gray.100}" } },
          muted: { value: { _light: "{colors.gray.400}", _dark: "{colors.gray.400}" } },
        },
      },

      radii: {
        l1: { value: "{radii.sm}" },
        l2: { value: "{radii.md}" },
        l3: { value: "{radii.lg}" },
      },
    },
  },

  globalCss: {
    html: {
      colorPalette: "orange",
    },
  },
});

export const system = createSystem(defaultConfig, config);
