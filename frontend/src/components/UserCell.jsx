import { Avatar, Group, Stack, Text } from "@mantine/core";

function initials(firstName, lastName) {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

export default function UserCell({ firstName, lastName, email, color = "green" }) {
    return (
        <Group gap="sm" wrap="nowrap">
          <Avatar color={color === "green" ? "teal" : "ube"} radius="xl">
            {initials(firstName, lastName)}
          </Avatar>
          <Stack gap={0}>
            <Text fw={600} size="sm">{firstName} {lastName}</Text>
            {email && <Text c="dimmed" size="xs">{email}</Text>}
          </Stack>
        </Group>
    );
}