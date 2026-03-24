import { useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { useForm } from "@mantine/form";
import {
  Alert,
  Button,
  Grid,
  Modal,
  PasswordInput,
  Stack,
  Text,
  TextInput
} from "@mantine/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";

const BLANK = {
    username: "", email: "", password: "",
    first_name: "", last_name: "",
    phone: "", address: "",
    farm_name: "", farm_description: "",
};

export default function RegisterModal({ role, onClose }) {
    const { registerFarmer, registerCustomer } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);
    const [success, setSuccess] = useState(false);

    const isFarmer = role === "farmer";
    const form = useForm({
      initialValues: BLANK,
      validate: {
        first_name: (v) => (v.trim().length < 2 ? "Required" : null),
        last_name: (v) => (v.trim().length < 2 ? "Required" : null),
        username: (v) => (v.trim().length < 3 ? "Min 3 characters" : null),
        email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Invalid email"),
        password: (v) => (v.length < 8 ? "Min 8 characters" : null),
      },
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        setError(null);
        try {
            if (isFarmer) {
                await registerFarmer(values);
            } else {
                await registerCustomer(values);
            }
            setSuccess(true);
            setTimeout(onClose, 1200);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal opened onClose={onClose} centered title={`Register ${isFarmer ? "Farmer" : "Customer"}`} size="lg">
          {success ? (
            <Stack align="center" py="xl">
              <IconCheck size={24} color="green" />
              <Text c="green" fw={600}>Registered successfully</Text>
            </Stack>
          ) : (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="sm">
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput label="First name" placeholder="Juan" {...form.getInputProps("first_name")} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput label="Last name" placeholder="Dela Cruz" {...form.getInputProps("last_name")} />
                  </Grid.Col>
                </Grid>
                <TextInput label="Username" placeholder="jdelacruz" {...form.getInputProps("username")} />
                <TextInput label="Email" type="email" placeholder="juan@email.com" {...form.getInputProps("email")} />
                <PasswordInput label="Password" placeholder="Minimum 8 characters" {...form.getInputProps("password")} />
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput label="Phone" placeholder="09171234567" {...form.getInputProps("phone")} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput label="Address" placeholder="City, Province" {...form.getInputProps("address")} />
                  </Grid.Col>
                </Grid>
                {isFarmer && (
                  <>
                    <TextInput label="Farm name" placeholder="Dela Cruz Organic Farm" {...form.getInputProps("farm_name")} />
                    <TextInput label="Farm description" placeholder="Fresh vegetables grown naturally..." {...form.getInputProps("farm_description")} />
                  </>
                )}
                {error && (
                  <Alert color="red" icon={<IconAlertCircle size={16} />}>{error}</Alert>
                )}
                <Button type="submit" loading={loading}>Register</Button>
              </Stack>
            </form>
          )}
        </Modal>
    );
}