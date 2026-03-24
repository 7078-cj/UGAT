import { ActionIcon, Avatar, Badge, Group, Paper, Text, ThemeIcon, Title } from "@mantine/core";
import { IconBell, IconCalendarEvent, IconSparkles } from "@tabler/icons-react";

const TITLES = {
  dashboard: "Dashboard",
  farmers: "Farmers",
  customers: "Customers",
  farms: "Farms",
};

export default function TopBar({ tab }) {
  const date = new Date().toLocaleDateString("en-PH", {
    weekday: "short", month: "short", day: "numeric",
  });

  return (
    <Paper
      radius={0}
      h="100%"
      px="md"
      py="sm"
      style={{
        borderBottom: "1px solid var(--mantine-color-ube-1)",
        background: "linear-gradient(90deg, rgba(247,241,255,.95) 0%, rgba(255,255,255,1) 45%)",
      }}
    >
      <Group justify="space-between" h="100%">
        <Group gap="sm">
          <ThemeIcon variant="light" color="ube" size={34}>
            <IconSparkles size={18} />
          </ThemeIcon>
          <div>
            <Title order={3}>{TITLES[tab] ?? tab}</Title>
            <Group gap={6}>
              <IconCalendarEvent size={12} color="var(--mantine-color-gray-6)" />
              <Text size="xs" c="dimmed">{date}</Text>
            </Group>
          </div>
        </Group>
        <Group gap="xs">
          <Badge variant="light" color="ube">Admin</Badge>
          <ActionIcon variant="light" color="ube" aria-label="Notifications">
            <IconBell size={16} />
          </ActionIcon>
          <Avatar color="ube" radius="xl">AD</Avatar>
        </Group>
      </Group>
    </Paper>
  );
}