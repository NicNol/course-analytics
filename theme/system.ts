import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

/**
 * Chakra UI v2 compatibility layer.
 *
 * v3 ships a different default theme than v2 — a neutral (zinc) gray ramp instead of
 * v2's blue-tinted slate, a different orange, Inter as the default font, smaller
 * Heading steps, and new shadow values. This app was designed against v2's defaults and
 * never declared a custom theme, so those defaults *are* the design.
 *
 * Everything below is copied from @chakra-ui/theme@2 to keep the app looking identical.
 * When a visual difference turns up, fix it here rather than in component markup.
 */

// @chakra-ui/theme v2 foundations/colors
const grayV2 = {
  50: { value: "#F7FAFC" },
  100: { value: "#EDF2F7" },
  200: { value: "#E2E8F0" },
  300: { value: "#CBD5E0" },
  400: { value: "#A0AEC0" },
  500: { value: "#718096" },
  600: { value: "#4A5568" },
  700: { value: "#2D3748" },
  800: { value: "#1A202C" },
  900: { value: "#171923" },
  // v2 stopped at 900; v3's own recipes reference gray.950, so extend the ramp.
  950: { value: "#0D0F14" },
};

const orangeV2 = {
  50: { value: "#FFFAF0" },
  100: { value: "#FEEBC8" },
  200: { value: "#FBD38D" },
  300: { value: "#F6AD55" },
  400: { value: "#ED8936" },
  500: { value: "#DD6B20" },
  600: { value: "#C05621" },
  700: { value: "#9C4221" },
  800: { value: "#7B341E" },
  900: { value: "#652B19" },
  950: { value: "#3D1A0F" },
};

const blueV2 = {
  50: { value: "#ebf8ff" },
  100: { value: "#bee3f8" },
  200: { value: "#90cdf4" },
  300: { value: "#63b3ed" },
  400: { value: "#4299e1" },
  500: { value: "#3182ce" },
  600: { value: "#2b6cb0" },
  700: { value: "#2c5282" },
  800: { value: "#2a4365" },
  900: { value: "#1A365D" },
  950: { value: "#102A43" },
};

const systemFontStack =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        gray: grayV2,
        orange: orangeV2,
        blue: blueV2,
      },
      // v3 prepends "Inter" to both stacks; v2 did not.
      fonts: {
        heading: { value: systemFontStack },
        body: { value: systemFontStack },
      },
      // v3 dropped container.* in favour of breakpoint-*. Re-added so the existing
      // maxW="container.xl" call sites keep their exact widths.
      sizes: {
        container: {
          sm: { value: "640px" },
          md: { value: "768px" },
          lg: { value: "1024px" },
          xl: { value: "1280px" },
        },
      },
    },

    semanticTokens: {
      colors: {
        // v2 chakra-body-bg / chakra-body-text. v3 defaults to pure black in dark mode.
        bg: {
          DEFAULT: { value: { _light: "{colors.white}", _dark: "{colors.gray.800}" } },
        },
        fg: {
          DEFAULT: { value: { _light: "{colors.gray.800}", _dark: "{colors.whiteAlpha.900}" } },
        },
      },
      // v2 foundations/shadows
      shadows: {
        sm: { value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
        md: {
          value: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
        lg: {
          value: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        xl: {
          value: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
        "dark-lg": {
          value:
            "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px",
        },
      },
    },

    recipes: {
      // v2's Link was a plain inline <a>; v3's recipe makes it inline-flex, which
      // shrink-wraps the anchor and breaks `textAlign: center` on block children
      // (the course code and title on each card).
      link: {
        base: {
          display: "inline",
          color: "inherit",
          textDecoration: "none",
          transitionProperty: "common",
          transitionDuration: "fast",
          transitionTimingFunction: "ease-out",
          _hover: { textDecoration: "underline" },
        },
      },

      // v2 Heading: bold, and sizes that map onto much larger font sizes than v3's
      // textStyle-based scale (v3 size="lg" is 1.125rem; v2's was 1.5rem/1.875rem).
      // Merging leaves v3's `textStyle` in place, but explicit fontSize/lineHeight
      // take precedence over it, so these values are what render.
      heading: {
        base: { fontWeight: "bold" },
        variants: {
          size: {
            xs: { fontSize: "sm", lineHeight: 1.2 },
            sm: { fontSize: "md", lineHeight: 1.2 },
            md: { fontSize: "xl", lineHeight: 1.2 },
            lg: { fontSize: ["2xl", null, "3xl"], lineHeight: [1.33, null, 1.2] },
            xl: { fontSize: ["3xl", null, "4xl"], lineHeight: [1.33, null, 1.2] },
            "2xl": { fontSize: ["4xl", null, "5xl"], lineHeight: [1.2, null, 1] },
            "3xl": { fontSize: ["5xl", null, "6xl"], lineHeight: 1 },
            "4xl": { fontSize: ["6xl", null, "7xl"], lineHeight: 1 },
          },
        },
      },

      // v2 Button: semibold, radius md (v3 uses l2 = 0.25rem), no border.
      button: {
        base: {
          borderRadius: "md",
          fontWeight: "semibold",
          borderWidth: "0",
          transitionDuration: "normal",
        },
        variants: {
          size: {
            // v3 forces icons inside buttons to 1.25rem via _icon; v2 left them at
            // 1em, so they tracked the button's font size.
            md: {
              h: "10",
              minW: "10",
              fontSize: "md",
              px: "4",
              _icon: { width: "1em", height: "1em" },
            },
          },
          variant: {
            // v2's ghost variant for a non-gray colorScheme. The menus and
            // BackBreadcrumb pass colorScheme="black", which is not a real palette in
            // either version — every token below resolves to nothing and the button
            // falls back to inherited colour with no hover fill, exactly as in v2.
            ghost: {
              bg: "transparent",
              color: { base: "colorPalette.600", _dark: "colorPalette.200" },
              _hover: { bg: { base: "colorPalette.50", _dark: "colorPalette.200/12" } },
              _active: { bg: { base: "colorPalette.100", _dark: "colorPalette.200/24" } },
            },
            link: {
              padding: 0,
              height: "auto",
              lineHeight: "normal",
              verticalAlign: "baseline",
              color: { base: "colorPalette.500", _dark: "colorPalette.200" },
              _hover: { textDecoration: "underline", _disabled: { textDecoration: "none" } },
              _active: { color: { base: "colorPalette.700", _dark: "colorPalette.500" } },
            },
          },
        },
      },
    },

    slotRecipes: {
      // v2 Table baseStyle + "simple" variant + size md. v3's default `line` variant
      // drops the uppercase column headers entirely.
      table: {
        slots: ["root", "header", "body", "row", "columnHeader", "cell", "caption", "footer"],
        base: {
          root: {
            fontVariantNumeric: "lining-nums tabular-nums",
            borderCollapse: "collapse",
            width: "full",
            // v3 sets verticalAlign: top on the root; v2 left cells at the browser
            // default, which centres the icon/label pairs in each row.
            verticalAlign: "middle",
          },
          columnHeader: {
            fontFamily: "heading",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "wider",
            textAlign: "start",
          },
          cell: { textAlign: "start" },
        },
        variants: {
          size: {
            md: {
              columnHeader: { px: "6", py: "3", lineHeight: "4", fontSize: "xs" },
              cell: { px: "6", py: "4", lineHeight: "5" },
            },
          },
          variant: {
            line: {
              columnHeader: {
                color: { base: "gray.600", _dark: "gray.400" },
                borderBottomWidth: "1px",
                borderColor: { base: "gray.100", _dark: "gray.700" },
              },
              cell: {
                borderBottomWidth: "1px",
                borderColor: { base: "gray.100", _dark: "gray.700" },
              },
              // v3's line variant paints every row with the page background, which
              // would cover the bg set on Table.Header / Table.Body. v2 rows were
              // transparent.
              row: { bg: "transparent" },
            },
          },
        },
      },

      // v2 Menu list/item.
      menu: {
        slots: ["content", "item"],
        base: {
          content: {
            bg: { base: "white", _dark: "gray.700" },
            boxShadow: { base: "sm", _dark: "dark-lg" },
            color: "inherit",
            minW: "3xs",
            py: "2",
            borderRadius: "md",
            borderWidth: "1px",
          },
          item: {
            py: "1.5",
            px: "3",
            _highlighted: { bg: { base: "gray.100", _dark: "whiteAlpha.100" } },
            _disabled: { opacity: 0.4, cursor: "not-allowed" },
          },
        },
      },
    },
  },

  globalCss: {
    body: {
      lineHeight: "base",
    },
  },
});

export const system = createSystem(defaultConfig, config);
