import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import {
  Anchor,
  Button,
  Card,
  Center,
  Container,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { IconLock, IconUser } from '@tabler/icons-react'

function Login() {
  let { loginUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event) => {
    setLoading(true)
    try {
      await loginUser(event)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="sm" py={48}>
      <Center mih="85vh">
        <Card shadow="lg" w="100%" maw={460} p="xl">
          <Stack gap="lg">
            <Stack gap={4} align="center">
              <Title order={2}>Welcome back</Title>
              <Text c="dimmed" size="sm">Sign in to manage your UGAT admin workspace</Text>
            </Stack>

            <form onSubmit={onSubmit}>
              <Stack gap="sm">
                <TextInput
                  required
                  label="Username"
                  name="username"
                  placeholder="Enter your username"
                  leftSection={<IconUser size={16} />}
                />
                <PasswordInput
                  required
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  leftSection={<IconLock size={16} />}
                />
                <Button
                  fullWidth
                  type="submit"
                  loading={loading}
                  mt="sm"
                >
                  Login
                </Button>
              </Stack>
            </form>

            <Group justify="center" gap={4}>
              <Text size="sm" c="dimmed">Don&apos;t have an account?</Text>
              <Anchor component={Link} to="/register" size="sm">Register</Anchor>
            </Group>
          </Stack>
        </Card>
      </Center>
    </Container>
  )
}

export default Login