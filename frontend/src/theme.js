import { createTheme } from "@mantine/core";

export const ubeTheme = createTheme({
  primaryColor: "ube",
  defaultRadius: "md",
  colors: {
    ube: [
      "#f7f1ff",
      "#efe2ff",
      "#e6ccff",
      "#d2adf3",
      "#b57edc",
      "#9f5bcb",
      "#8a2be2",
      "#7a1fcf",
      "#6A0DAD",
      "#530984",
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
        radius: "md",
      },
    },
    Card: {
      defaultProps: {
        radius: "lg",
        withBorder: true,
      },
    },
    TextInput: {
      defaultProps: {
        radius: "md",
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: "md",
      },
    },
  },
});
