import { Badge as MantineBadge } from "@mantine/core";

const COLORS = {
  green: "green",
  blue: "blue",
  amber: "yellow",
  coral: "red",
  gray: "gray",
};

export default function Badge({ label, variant = "gray" }) {
  return (
    <MantineBadge variant="light" color={COLORS[variant] ?? "gray"}>
      {label}
    </MantineBadge>
  );
}