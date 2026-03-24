import { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import DataTable, { Td } from "./DataTable";
import UserCell from "./UserCell";
import Badge from "./Badge";
import { Alert, Group, Loader, Stack, Text, TextInput, ThemeIcon, Title } from "@mantine/core";
import { IconSearch, IconUserOff, IconUsersGroup } from "@tabler/icons-react";

export default function CustomersTable() {
    const { customers, fetchCustomers, loading, errors } = useAdmin();
    const [search, setSearch] = useState("");

    useEffect(() => { fetchCustomers(); }, []);

    const filtered = customers.filter(c =>
        `${c.first_name} ${c.last_name} ${c.username}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Stack gap="md">
            <Group justify="space-between">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="ube"><IconUsersGroup size={16} /></ThemeIcon>
                  <Title order={4}>All Customers {!loading.customers && `(${filtered.length})`}</Title>
                </Group>
                <TextInput
                  leftSection={<IconSearch size={16} />}
                  placeholder="Search customers..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  w={280}
                />
            </Group>

            {loading.customers && <Loader size="sm" />}
            {errors.customers && <Alert color="red">{errors.customers}</Alert>}

            <DataTable
                headers={["Customer", "Username", "Phone", "Address", "Status"]}
                empty={loading.customers ? "Loading…" : "No customers found."}
            >
                {filtered.length > 0 && filtered.map(c => (
                    <tr key={c.id}>
                        <Td>
                            <UserCell firstName={c.first_name} lastName={c.last_name} email={c.email} color="blue" />
                        </Td>
                        <Td muted>@{c.username}</Td>
                        <Td>{c.profile?.phone ?? "—"}</Td>
                        <Td muted>{c.profile?.address ?? "—"}</Td>
                        <Td><Badge label="Active" variant="blue" /></Td>
                    </tr>
                ))}
            </DataTable>
            {!loading.customers && filtered.length === 0 && (
              <Group gap="xs">
                <IconUserOff size={16} color="var(--mantine-color-gray-6)" />
                <Text c="dimmed" size="sm">No customers match your search.</Text>
              </Group>
            )}
        </Stack>
    );
}