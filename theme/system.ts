import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

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
        black: { value: "#000000" },
        white: { value: "#FFFFFF" },
      },
      lineHeights: {
        3: { value: "0.75rem" },
        4: { value: "1rem" },
        5: { value: "1.25rem" },
        6: { value: "1.5rem" },
        7: { value: "1.75rem" },
        8: { value: "2rem" },
        9: { value: "2.25rem" },
        10: { value: "2.5rem" },
        normal: { value: "normal" },
        none: { value: "1" },
        base: { value: "1.5" },
      },
      fonts: {
        heading: { value: systemFontStack },
        body: { value: systemFontStack },
      },
      sizes: {
        container: {
          sm: { value: "640px" },
          md: { value: "768px" },
          lg: { value: "1024px" },
          xl: { value: "1280px" },
        },
      },
    },

    textStyles: {
      buttonV2Md: { value: { fontSize: "md" } },
      selectV2Md: { value: { fontSize: "md", lineHeight: "normal" } },
      tagLabelV2Md: { value: { fontSize: "sm", lineHeight: "1.2" } },
    },

    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { _light: "{colors.white}", _dark: "{colors.gray.800}" } },
        },
        fg: {
          DEFAULT: { value: { _light: "{colors.gray.800}", _dark: "{colors.whiteAlpha.900}" } },
        },
      },
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
      icon: {
        base: { verticalAlign: "baseline" },
      },

      link: {
        base: {
          display: "inline",
          color: "inherit",
          textDecoration: "none",
          transitionProperty: "common",
          transitionDuration: "fast",
          transitionTimingFunction: "ease-out",
          _hover: {
            textDecoration: "underline",
            textDecorationColor: "currentColor",
            textUnderlineOffset: "auto",
          },
        },
      },

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

      button: {
        base: {
          borderRadius: "md",
          fontWeight: "semibold",
          borderWidth: "0",
          transitionDuration: "normal",
          lineHeight: "1.2",
        },
        variants: {
          size: {
            md: {
              h: "10",
              minW: "10",
              textStyle: "buttonV2Md",
              px: "4",
              _icon: { width: "1em", height: "1em" },
            },
          },
          variant: {
            solid: {
              bg: { base: "gray.100", _dark: "whiteAlpha.200" },
              color: "inherit",
              _hover: { bg: { base: "gray.200", _dark: "whiteAlpha.300" } },
              _active: { bg: { base: "gray.300", _dark: "whiteAlpha.400" } },
            },
            ghost: {
              bg: "transparent",
              color: { base: "colorPalette.600", _dark: "inherit" },
              _hover: { bg: { base: "colorPalette.50", _dark: "rgba(0, 0, 0, 0.12)" } },
              _active: { bg: { base: "colorPalette.100", _dark: "rgba(0, 0, 0, 0.24)" } },
            },
            link: {
              padding: 0,
              height: "auto",
              lineHeight: "normal",
              verticalAlign: "baseline",
              color: { base: "colorPalette.500", _dark: "colorPalette.200" },
              _hover: { textDecoration: "none" },
              _active: { color: { base: "colorPalette.700", _dark: "colorPalette.500" } },
            },
          },
        },
      },
    },

    slotRecipes: {
      table: {
        slots: ["root", "header", "body", "row", "columnHeader", "cell", "caption", "footer"],
        base: {
          root: {
            fontVariantNumeric: "lining-nums tabular-nums",
            borderCollapse: "collapse",
            width: "full",
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
              root: { fontSize: "md" },
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
              row: { bg: "transparent" },
            },
          },
        },
      },

      nativeSelect: {
        slots: ["root", "field", "indicator"],
        variants: {
          size: {
            md: {
              field: {
                textStyle: "selectV2Md",
                h: "10",
                ps: "4",
                pe: "8",
                borderRadius: "md",
              },
            },
          },
        },
      },

      tag: {
        slots: ["root", "label"],
        variants: {
          size: {
            md: {
              root: { minH: "6", minW: "6", px: "2" },
              label: { textStyle: "tagLabelV2Md" },
            },
          },
        },
      },

      avatar: {
        slots: ["root", "fallback"],
        base: {
          root: {
            bg: "gray.400",
            color: "white",
          },
        },
        variants: {
          size: {
            md: {
              root: {
                "--avatar-size": "sizes.12",
                "--avatar-font-size": "calc(3rem / 2.5)",
                width: "12",
                height: "12",
                fontSize: "calc(3rem / 2.5)",
              },
              fallback: { fontSize: "calc(3rem / 2.5)", lineHeight: "3rem" },
            },
          },
          variant: {
            subtle: { root: { bg: "gray.400", color: "white" } },
          },
        },
      },

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
      fontFamily: "body",
      lineHeight: "base",
    },
  },
});

export const system = createSystem(defaultConfig, config);
