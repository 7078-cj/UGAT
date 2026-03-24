import { Button, Divider, NavLink, Paper, Stack, Text } from "@mantine/core";
import {
  IconHome2,
  IconMapPin2,
  IconPlant2,
  IconPlus,
  IconUsersGroup,
  IconWheat,
} from "@tabler/icons-react";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: IconHome2 },
  { id: "farmers", label: "Farmers", icon: IconPlant2 },
  { id: "customers", label: "Customers", icon: IconUsersGroup },
  { id: "farms", label: "Farms", icon: IconMapPin2 },
];

export default function Sidebar({ active, setTab, onRegister }) {
  return (
    <Stack p="sm" gap="md">
      <Stack gap={4}>
        <Paper
          p="xs"
          radius="md"
          style={{
            background: "linear-gradient(135deg, var(--mantine-color-ube-2), var(--mantine-color-ube-0))",
          }}
        >
          <Text fw={700} size="lg" c="ube.8">UGAT</Text>
        </Paper>
        <Text size="xs" c="dimmed">Admin navigation</Text>
      </Stack>
      <Divider />
      <Stack gap={4}>
        {NAV.map((item) => (
          <NavLink
            key={item.id}
            label={item.label}
            leftSection={<item.icon size={16} />}
            active={active === item.id}
            onClick={() => setTab(item.id)}
            variant="filled"
            color="ube"
            style={{
              transition: "transform 120ms ease, box-shadow 120ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(2px)";
              e.currentTarget.style.boxShadow = "0 6px 14px rgba(106, 13, 173, 0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        ))}
      </Stack>
      <Divider />
      <Button
        variant="light"
        leftSection={<IconWheat size={16} />}
        justify="flex-start"
        onClick={() => onRegister("farmer")}
        style={{ transition: "all 140ms ease" }}
      >
        Add Farmer
      </Button>
      <Button
        variant="light"
        leftSection={<IconPlus size={16} />}
        justify="flex-start"
        onClick={() => onRegister("customer")}
        style={{ transition: "all 140ms ease" }}
      >
        Add Customer
      </Button>
    </Stack>
  );
}