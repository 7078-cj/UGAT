import { useContext, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import StatCard from "./StatCard";
import Badge from "./Badge";
import UserCell from "./UserCell";
import DataTable, { Td } from "./DataTable";
import FarmMap from "./FarmMap";
import { Card, Grid, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconArrowRight, IconMapPin, IconPlant2, IconTractor, IconUserPlus, IconUsersGroup } from "@tabler/icons-react";
import AuthContext from "../context/AuthContext";

const QUICK = [
    { label: "Register Farmer", desc: "Add a new farmer account", role: "farmer", icon: IconPlant2 },
    { label: "Register Customer", desc: "Add a new customer account", role: "customer", icon: IconUserPlus },
];

export default function Dashboard({ onRegister }) {
    
        const { farmers, customers, farms,
                loading, errors, markers } = useAdmin();


    const isLoading = loading.farmers || loading.farms;
    const recentFarmers = [...farmers].slice(-3).reverse();

    return (
      <Stack gap="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          <StatCard label="Total Farmers" value={isLoading ? "—" : farmers.length} icon={IconPlant2} />
          <StatCard label="Total Customers" value={isLoading ? "—" : customers.length} icon={IconUsersGroup} />
          <StatCard label="Active Farms" value={isLoading ? "—" : farms.length} icon={IconTractor} />
        </SimpleGrid>

        <Card>
          <Stack gap="sm">
            <Title order={4}>Quick Actions</Title>
            <Grid>
              {QUICK.map((q) => (
                <Grid.Col key={q.label} span={{ base: 12, sm: 6 }}>
                  <Paper
                    withBorder
                    radius="md"
                    p="md"
                    onClick={() => q.role && onRegister(q.role)}
                    style={{
                      cursor: "pointer",
                      transition: "transform 150ms ease, box-shadow 150ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 12px 24px rgba(106, 13, 173, .12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap">
                        <ThemeIcon variant="light" color="ube">
                          <q.icon size={16} />
                        </ThemeIcon>
                        <div>
                          <Text fw={600}>{q.label}</Text>
                          <Text size="xs" c="dimmed">{q.desc}</Text>
                        </div>
                      </Group>
                      <IconArrowRight size={16} color="var(--mantine-color-ube-6)" />
                    </Group>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Card>

        <Stack gap="sm">
          <Title order={4}>Recent Farmers</Title>
          <DataTable headers={["Farmer", "Farm", "Date joined", "Status"]} empty="No farmers yet.">
            {recentFarmers.length > 0 && recentFarmers.map(f => (
              <tr key={f.id}>
                <Td>
                  <UserCell
                    firstName={f.first_name}
                    lastName={f.last_name}
                    email={f.email}
                    color="green"
                  />
                </Td>
                <Td muted>{f.farm?.[0]?.name ?? "—"}</Td>
                <Td muted>{new Date(f.date_joined).toLocaleDateString("en-PH")}</Td>
                <Td><Badge label="Active" variant="green" /></Td>
              </tr>
            ))}
          </DataTable>
        </Stack>

        <Card>
          <Stack gap="sm">
            <Group gap="xs">
              <ThemeIcon variant="light" color="ube">
                <IconMapPin size={16} />
              </ThemeIcon>
              <Title order={4}>Farm Locations</Title>
            </Group>
            <FarmMap
              markers={markers}
              loading={loading.farms}
              error={errors.farms}
            />
          </Stack>
        </Card>
      </Stack>
    );
}