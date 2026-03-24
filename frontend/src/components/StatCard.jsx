import { Card, Group, Text, ThemeIcon } from "@mantine/core";

export default function StatCard({ label, value, icon: Icon }) {
  return (
    <Card
      shadow="sm"
      p="lg"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, var(--mantine-color-neutral-0) 100%)",
      }}
    >
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="sm" c="dimmed">{label}</Text>
          <Text fw={700} size="2rem">{value}</Text>
        </div>
        {Icon && (
          <ThemeIcon variant="light" color="ube" size={36}>
            <Icon size={18} />
          </ThemeIcon>
        )}
      </Group>
    </Card>
  );
}