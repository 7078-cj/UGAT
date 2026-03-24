import { Card, ScrollArea, Table, Text } from "@mantine/core";

export default function DataTable({ headers, children, empty = "No results found." }) {
  const hasRows = Boolean(children);

  return (
    <Card p={0} shadow="sm">
      <ScrollArea>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              {headers.map((header) => (
                <Table.Th key={header}>{header}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {hasRows ? (
              children
            ) : (
              <Table.Tr>
                <Table.Td colSpan={headers.length}>
                  <Text c="dimmed" ta="center" py="lg">{empty}</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}

export function Td({ children, muted = false, mono = false }) {
  return (
    <Table.Td>
      <Text c={muted ? "dimmed" : "dark"} ff={mono ? "monospace" : undefined} size={muted ? "sm" : "md"}>
        {children}
      </Text>
    </Table.Td>
  );
}