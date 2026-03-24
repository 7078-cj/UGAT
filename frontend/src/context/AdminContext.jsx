import { createContext, useContext, useState, useCallback } from "react";
import { getRequest, postRequest } from "../utils/requests/requests";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
    const [token] = useState(
        JSON.parse(localStorage.getItem("authTokens")) || null
    );

    const [farmers, setFarmers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [farms, setFarms] = useState([]);
    const [markers, setMarkers] = useState([]);

    const [loading, setLoading] = useState({});
    const [errors, setErrors] = useState({});

    // ─────────────────────────────────────────────
    // GENERIC FETCH
    // ─────────────────────────────────────────────
    const load = useCallback(async (key, setter, endpoint) => {
        if (!token?.access) return;

        setLoading((p) => ({ ...p, [key]: true }));
        setErrors((p) => ({ ...p, [key]: null }));

        try {
            const data = await getRequest(endpoint, token.access);
            setter(data);
        } catch (err) {
            setErrors((p) => ({ ...p, [key]: err.message || "Error" }));
        } finally {
            setLoading((p) => ({ ...p, [key]: false }));
        }
    }, [token]);

    // ─────────────────────────────────────────────
    // MARKERS
    // ─────────────────────────────────────────────
    const generateMarkers = useCallback((farmsData) => {
        const m = farmsData
            .filter((f) => f.latitude && f.longitude)
            .map((f) => ({
                id: f.id,
                lat: Number(f.latitude),
                lng: Number(f.longitude),
                name: f.name,
                farm: f, // 🔥 attach full farm
            }));

        setMarkers(m);
    }, []);

    // ─────────────────────────────────────────────
    // FETCHERS
    // ─────────────────────────────────────────────
    const fetchFarmers = useCallback(
        () => load("farmers", setFarmers, "users/?role=farmer"),
        [load]
    );

    const fetchCustomers = useCallback(
        () => load("customers", setCustomers, "users/?role=customer"),
        [load]
    );

    const fetchFarms = useCallback(async () => {
        if (!token?.access) return;

        setLoading((p) => ({ ...p, farms: true }));

        try {
            const data = await getRequest("farms/", token.access);
            setFarms(data);
            generateMarkers(data);
        } catch (err) {
            setErrors((p) => ({ ...p, farms: err.message || "Error" }));
        } finally {
            setLoading((p) => ({ ...p, farms: false }));
        }
    }, [token, generateMarkers]);

    // ─────────────────────────────────────────────
    // EXPORT
    // ─────────────────────────────────────────────
    const createExport = async (farmId, payload) => {
        if (!token?.access) return;

        const res = await postRequest(
            `farms/${farmId}/exports/`,
            payload,
            token.access
        );

        await fetchFarms(); // 🔥 auto refresh
        return res;
    };

    // ─────────────────────────────────────────────
    // PORTFOLIO
    // ─────────────────────────────────────────────
    const uploadPortfolio = async (farmId, exportId, files) => {
        if (!token?.access || !files.length) return;

        const formData = new FormData();

        files.forEach((file) => {
            formData.append("photos", file);
        });

        const res = await postRequest(
            `farms/${farmId}/exports/${exportId}/photos/`,
            formData,
            token.access,
            true
        );

        await fetchFarms(); // 🔥 refresh
        return res;
    };

    // ─────────────────────────────────────────────
    // UPDATE FARM (FIXED METHOD)
    // ─────────────────────────────────────────────
    const updateFarm = async (farmId, payload) => {
        if (!token?.access) return;

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}farms/${farmId}/`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.access}`,
                },
                body: JSON.stringify(payload),
            }
        );

        const data = await res.json();

        await fetchFarms(); 
        return data;
    };

    // ─────────────────────────────────────────────
    // REGISTER
    // ─────────────────────────────────────────────
    const registerFarmer = useCallback(async (formData) => {
        if (!token?.access) return;

        const data = await postRequest(
            "register/farmer",
            formData,
            token.access
        );

        await fetchFarmers();
        await fetchFarms();

        return data;
    }, [token, fetchFarmers, fetchFarms]);

    const registerCustomer = useCallback(async (formData) => {
        const data = await postRequest("register/", formData);
        await fetchCustomers();
        return data;
    }, [fetchCustomers]);

    return (
        <AdminContext.Provider
            value={{
                farmers, fetchFarmers,
                customers, fetchCustomers,
                farms, fetchFarms,
                markers,

                createExport,
                uploadPortfolio,
                updateFarm,

                registerFarmer,
                registerCustomer,

                loading,
                errors,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
    return ctx;
}