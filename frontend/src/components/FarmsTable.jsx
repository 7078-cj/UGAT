import { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import DataTable, { Td } from "./DataTable";
import Badge from "./Badge";
import FarmMap from "./FarmMap";
import { Alert, Card, Group, Loader, Stack, Text, TextInput, ThemeIcon, Title } from "@mantine/core";
import { IconMapPin2, IconMoodEmpty, IconSearch } from "@tabler/icons-react";

export default function FarmsTable() {
    const { farms, markers, fetchFarms, loading, errors } = useAdmin();
    const [search, setSearch] = useState("");
    const [selectedFarmId, setSelectedFarmId] = useState(null);

    useEffect(() => { fetchFarms(); }, []);

    const filtered = farms.filter(f =>
        `${f.name} ${f.owner?.username}`.toLowerCase().includes(search.toLowerCase())
    );
    const filteredMarkerIds = new Set(filtered.map((farm) => farm.id));
    const visibleMarkers = markers.filter((marker) => filteredMarkerIds.has(marker.id));

    return (
        <Stack gap="md">
            <Group justify="space-between">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="ube"><IconMapPin2 size={16} /></ThemeIcon>
                  <Title order={4}>All Farms {!loading.farms && `(${filtered.length})`}</Title>
                </Group>
                <TextInput
                  leftSection={<IconSearch size={16} />}
                  placeholder="Search farms..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  w={280}
                />
            </Group>
            {loading.farms && <Loader size="sm" />}
            {errors.farms && <Alert color="red">{errors.farms}</Alert>}

            <DataTable
                headers={["Farm Name", "Owner", "Address", "Coordinates", "Exports"]}
                empty={loading.farms ? "Loading…" : "No farms found."}
            >
                {filtered.length > 0 && filtered.map(f => (
                    <tr
                      key={f.id}
                      onClick={() => setSelectedFarmId(f.id)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: selectedFarmId === f.id ? "var(--mantine-color-ube-0)" : undefined,
                      }}
                    >
                        <Td><Text fw={600}>{f.name}</Text></Td>
                        <Td>{f.owner?.first_name} {f.owner?.last_name}</Td>
                        <Td muted>{f.address ?? "—"}</Td>
                        <Td mono>{f.latitude && f.longitude ? `${f.latitude}, ${f.longitude}` : "—"}</Td>
                        <Td>
                            <Badge label={`${f.export?.length ?? 0} exports`} variant="amber" />
                        </Td>
                    </tr>
                ))}
            </DataTable>

            <Card>
              <Stack gap="sm">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="ube"><IconMapPin2 size={16} /></ThemeIcon>
                  <Title order={5}>Farms Map</Title>
                </Group>
                <FarmMap
                  markers={visibleMarkers}
                  loading={loading.farms}
                  error={errors.farms}
                  focusedMarkerId={selectedFarmId}
                  onMarkerSelect={setSelectedFarmId}
                />
                <Text size="xs" c="dimmed">
                  Click a farm row to focus the map, or click a marker to highlight a farm.
                </Text>
              </Stack>
            </Card>
            {!loading.farms && filtered.length === 0 && (
              <Group gap="xs">
                <IconMoodEmpty size={16} color="var(--mantine-color-gray-6)" />
                <Text c="dimmed" size="sm">No farms match your search.</Text>
              </Group>
            )}
        </Stack>
    );
}