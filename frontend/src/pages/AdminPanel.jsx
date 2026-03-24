import { useState } from "react";
import Sidebar from "../components/SideBar";
import TopBar from "../components/TopBar";
import Dashboard from "../components/DashBoard";
import FarmersTable from "../components/FarmersTable";
import CustomersTable from "../components/CustomersTable";
import FarmsTable from "../components/FarmsTable";
import RegisterModal from "../components/RegisterModal";
import { AppShell } from "@mantine/core";

export default function AdminPanel() {
    const [tab, setTab] = useState("dashboard");
    const [modal, setModal] = useState(null); // "farmer" | "customer" | null

    return (
        <AppShell
          header={{ height: 72 }}
          navbar={{ width: 260, breakpoint: "sm" }}
          padding="md"
          styles={{
            main: {
              background: "var(--mantine-color-gray-0)",
            },
          }}
        >
          <AppShell.Header>
            <TopBar tab={tab} />
          </AppShell.Header>
          <AppShell.Navbar>
            <Sidebar
              active={tab}
              setTab={setTab}
              onRegister={setModal}
            />
          </AppShell.Navbar>
          <AppShell.Main>
            {tab === "dashboard" && <Dashboard onRegister={setModal} />}
            {tab === "farmers" && <FarmersTable />}
            {tab === "customers" && <CustomersTable />}
            {tab === "farms" && <FarmsTable />}
          </AppShell.Main>
          {modal && (
            <RegisterModal role={modal} onClose={() => setModal(null)} />
          )}
        </AppShell>
    );
}