import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import {
  Alert,
  Anchor,
  Button,
  Card,
  Center,
  Container,
  Grid,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import {
  IconAlertCircle,
  IconAt,
  IconLock,
  IconUser
} from '@tabler/icons-react'

function Register() {
  const nav = useNavigate()
  const { loginUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const form = useForm({
    initialValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: ''
    },
    validate: {
      first_name: (value) => (value.trim().length < 2 ? 'First name is required' : null),
      last_name: (value) => (value.trim().length < 2 ? 'Last name is required' : null),
      username: (value) => (value.trim().length < 3 ? 'Username must be at least 3 characters' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Enter a valid email address'),
      password: (value) => (value.length < 8 ? 'Password must be at least 8 characters' : null),
    },
  })

  const RegisterUser = async (values) => {
    setSubmitError('')
    setLoading(true)
    const url = import.meta.env.VITE_API_URL

    const response = await fetch(`${url}register/admin`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values)
    })

    const data = await response.json()

    if (response.status === 201) {
      const fakeEvent = {
        preventDefault: () => {},
        target: {
          username: { value: values.username },
          password: { value: values.password },
        },
      }
      await loginUser(fakeEvent)
      nav('/')
    } else {
      console.error(data)
      setSubmitError(data?.detail || "Registration failed")
    }
    setLoading(false)
  }

  return (
    <Container size="sm" py={48}>
      <Center mih="85vh">
        <Card shadow="lg" w="100%" maw={560} p="xl">
          <Stack gap="lg">
            <Stack gap={4} align="center">
              <Title order={2}>Create admin account</Title>
              <Text c="dimmed" size="sm">Set up your UGAT admin access</Text>
            </Stack>

            <form onSubmit={form.onSubmit(RegisterUser)}>
              <Stack gap="sm">
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput label="First Name" placeholder="Juan" leftSection={<IconUser size={16} />} {...form.getInputProps('first_name')} />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput label="Last Name" placeholder="Dela Cruz" leftSection={<IconUser size={16} />} {...form.getInputProps('last_name')} />
                  </Grid.Col>
                </Grid>

                <TextInput label="Username" placeholder="jdelacruz" leftSection={<IconUser size={16} />} {...form.getInputProps('username')} />
                <TextInput label="Email" placeholder="juan@email.com" leftSection={<IconAt size={16} />} {...form.getInputProps('email')} />
                <PasswordInput label="Password" placeholder="Minimum 8 characters" leftSection={<IconLock size={16} />} {...form.getInputProps('password')} />

                {submitError && (
                  <Alert color="red" icon={<IconAlertCircle size={16} />} variant="light">
                    {submitError}
                  </Alert>
                )}

                <Button fullWidth type="submit" loading={loading} mt="sm">Register</Button>
              </Stack>
            </form>

            <Group justify="center" gap={4}>
              <Text size="sm" c="dimmed">Already have an account?</Text>
              <Anchor component={Link} to="/login" size="sm">Login</Anchor>
            </Group>
          </Stack>
        </Card>
      </Center>
    </Container>
  )
}

export default Register