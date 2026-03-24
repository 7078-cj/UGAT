import { createTheme } from "@mantine/core";

export const ubeTheme = createTheme({
  primaryColor: "ube",
  defaultRadius: "lg",
  colors: {
    ube: [
      "#f7f1fb",
      "#ebdbf4",
      "#d8b8e7",
      "#c493db",
      "#b070cf",
      "#9f52c1",
      "#8a3aad",
      "#742994",
      "#5B2C6F",
      "#4a205a",
    ],
    secondary: [
      "#edf9ee",
      "#d8f0dc",
      "#b3e2ba",
      "#8fd598",
      "#6ac876",
      "#4CAF50",
      "#3f9644",
      "#327b37",
      "#26622b",
      "#1b491f",
    ],
    tertiary: [
      "#fff1e7",
      "#ffe0cc",
      "#ffc199",
      "#ffa266",
      "#ff883d",
      "#F97316",
      "#de6208",
      "#b95007",
      "#943f06",
      "#6e2e04",
    ],
    neutral: [
      "#f8f9fa",
      "#f1f3f5",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#868e96",
      "#495057",
      "#343a40",
      "#212529",
    ],
  },
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  headings: {
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    fontWeight: "700",
  },
  components: {
    Button: {
      defaultProps: {
        color: "ube",
        radius: "xl",
      },
    },
    Card: {
      defaultProps: {
        radius: "xl",
        withBorder: true,
      },
    },
    Paper: {
      defaultProps: {
        radius: "xl",
      },
    },
    NavLink: {
      defaultProps: {
        radius: "xl",
      },
    },
    TextInput: {
      defaultProps: {
        radius: "xl",
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: "xl",
      },
    },
  },
});
