import { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import DataTable, { Td } from "./DataTable";
import UserCell from "./UserCell";
import Badge from "./Badge";
import FarmerModal from "./FarmerModal"; // ✅
import { Alert, Group, Loader, Stack, Text, TextInput, ThemeIcon, Title } from "@mantine/core";
import { IconPlant2, IconSearch, IconUserOff } from "@tabler/icons-react";

export default function FarmersTable() {
    const { farmers, fetchFarmers, loading, errors } = useAdmin();
    const [search, setSearch] = useState("");
    const [selectedFarmer, setSelectedFarmer] = useState(null); // ✅

    useEffect(() => { fetchFarmers(); }, []);

    const filtered = farmers.filter(f =>
        `${f.first_name} ${f.last_name} ${f.username}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <Stack gap="md">
            <Group justify="space-between">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="ube"><IconPlant2 size={16} /></ThemeIcon>
                  <Title order={4}>All Farmers {!loading.farmers && `(${filtered.length})`}</Title>
                </Group>
                <TextInput
                  leftSection={<IconSearch size={16} />}
                  placeholder="Search farmers..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  w={280}
                />
            </Group>
            {loading.farmers && <Loader size="sm" />}
            {errors.farmers && <Alert color="red">{errors.farmers}</Alert>}

            <DataTable
                headers={["Farmer", "Username", "Phone", "Farm", "Address", "Status"]}
                empty={loading.farmers ? "Loading…" : "No farmers found."}
            >
                {filtered.length > 0 && filtered.map(f => (
                    <tr
                        key={f.id}
                        onClick={() => setSelectedFarmer(f)} // ✅ OPEN MODAL
                        style={{ cursor: "pointer" }}
                    >
                        <Td>
                            <UserCell
                                firstName={f.first_name}
                                lastName={f.last_name}
                                email={f.email}
                                color="green"
                            />
                        </Td>

                        <Td muted>@{f.username}</Td>
                        <Td>{f.profile?.phone ?? "—"}</Td>
                        <Td>{f.farm?.[0]?.name ?? "—"}</Td>
                        <Td muted>{f.profile?.address ?? "—"}</Td>
                        <Td><Badge label="Active" variant="green" /></Td>
                    </tr>
                ))}
            </DataTable>

            {/* ✅ MODAL */}
            {selectedFarmer && (
                <FarmerModal
                    farmer={selectedFarmer}
                    onClose={() => setSelectedFarmer(null)}
                />
            )}
            {!loading.farmers && filtered.length === 0 && (
              <Group gap="xs">
                <IconUserOff size={16} color="var(--mantine-color-gray-6)" />
                <Text c="dimmed" size="sm">No farmers match your search.</Text>
              </Group>
            )}
        </Stack>
    );
}