import { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";

// ─── tiny helpers ────────────────────────────────────────────────
const baseURL = import.meta.env.VITE_API_URL ?? "";

function Avatar({ name, size = 10 }) {
    const initials = name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    return (
        <span
            className={`inline-flex items-center justify-center w-${size} h-${size}
                        rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm shrink-0`}
        >
            {initials}
        </span>
    );
}

function Pill({ label, color = "gray" }) {
    const map = {
        gray:    "bg-stone-100 text-stone-500",
        green:   "bg-emerald-50 text-emerald-600",
        blue:    "bg-blue-50 text-blue-600",
        purple:  "bg-purple-50 text-purple-600",
        amber:   "bg-amber-50 text-amber-600",
    };
    return (
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${map[color]}`}>
            {label}
        </span>
    );
}

function Spinner() {
    return (
        <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    );
}

// quality / soil colour maps
const qualityColor = { poor: "gray", fair: "amber", good: "blue", excellent: "green" };
const soilColor    = { sandy: "amber", loamy: "green", clay: "blue",
                    silty: "purple", peaty: "gray", chalky: "gray" };

// ─── EXPORT FORM ─────────────────────────────────────────────────
function ExportForm({ farmId, onDone, onCancel }) {
    const { createExport } = useAdmin();

    const [form, setForm] = useState({
        price: "",
        stocks: "",
        quality: "",
        temperature: "",
        soil_quality: "",
    });
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState(null);

    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async () => {
        if (!form.price || !form.stocks) {
            setErr("Price and stocks are required.");
            return;
        }
        setBusy(true);
        setErr(null);
        try {
            const payload = {
                price:   parseFloat(form.price),
                stocks:  parseFloat(form.stocks),
                ...(form.quality     && { quality:     form.quality }),
                ...(form.temperature && { temperature: parseFloat(form.temperature) }),
                ...(form.soil_quality && { soil_quality: form.soil_quality }),
            };
            await createExport(farmId, payload);
            onDone();
        } catch (e) {
            setErr(e?.message ?? "Something went wrong.");
        } finally {
            setBusy(false);
        }
    };

    const fieldCls = "w-full px-3 py-1.5 text-xs border border-stone-200 rounded-lg " +
                    "outline-none focus:border-emerald-400 bg-white";
    const selectCls = fieldCls + " appearance-none";

    return (
        <div className="border border-stone-200 rounded-xl p-4 space-y-3 bg-stone-50">
            <p className="text-xs font-semibold text-stone-700">New Export</p>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] text-stone-400 mb-0.5">Price (₱) *</label>
                    <input className={fieldCls} type="number" placeholder="0.00"
                        value={form.price} onChange={(e) => set("price", e.target.value)} />
                </div>
                <div>
                    <label className="block text-[10px] text-stone-400 mb-0.5">Stocks (kg) *</label>
                    <input className={fieldCls} type="number" placeholder="0"
                        value={form.stocks} onChange={(e) => set("stocks", e.target.value)} />
                </div>
                <div>
                    <label className="block text-[10px] text-stone-400 mb-0.5">Quality</label>
                    <select className={selectCls} value={form.quality}
                        onChange={(e) => set("quality", e.target.value)}>
                        <option value="">— select —</option>
                        {["poor","fair","good","excellent"].map(q => (
                            <option key={q} value={q}>{q.charAt(0).toUpperCase() + q.slice(1)}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] text-stone-400 mb-0.5">Temperature (°C)</label>
                    <input className={fieldCls} type="number" placeholder="25"
                        value={form.temperature} onChange={(e) => set("temperature", e.target.value)} />
                </div>
                <div className="col-span-2">
                    <label className="block text-[10px] text-stone-400 mb-0.5">Soil Quality</label>
                    <select className={selectCls} value={form.soil_quality}
                        onChange={(e) => set("soil_quality", e.target.value)}>
                        <option value="">— select —</option>
                        {["sandy","loamy","clay","silty","peaty","chalky"].map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {err && <p className="text-[10px] text-rose-500 bg-rose-50 px-2 py-1 rounded">{err}</p>}

            <div className="flex gap-2">
                <button
                    onClick={handleSubmit}
                    disabled={busy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-500
                            hover:bg-emerald-600 text-white rounded-lg disabled:opacity-50"
                >
                    {busy ? <Spinner /> : null}
                    {busy ? "Saving…" : "Save Export"}
                </button>
                <button
                    onClick={onCancel}
                    className="px-3 py-1.5 text-xs text-stone-500 hover:bg-stone-200 rounded-lg"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ─── FARM EDIT FORM ───────────────────────────────────────────────
function FarmEditForm({ farm, onDone, onCancel }) {
    const { updateFarm } = useAdmin();

    const [form, setForm] = useState({
        name:        farm.name ?? "",
        description: farm.description ?? "",
        address:     farm.address ?? "",
        latitude:    farm.latitude ?? "",
        longitude:   farm.longitude ?? "",
    });
    const [busy, setBusy] = useState(false);
    const [err, setErr]   = useState(null);

    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async () => {
        if (!form.name.trim()) { setErr("Farm name is required."); return; }
        setBusy(true);
        setErr(null);
        try {
            await updateFarm(farm.id, {
                name:        form.name,
                description: form.description,
                address:     form.address,
                latitude:    form.latitude  || null,
                longitude:   form.longitude || null,
            });
            onDone();
        } catch (e) {
            setErr(e?.message ?? "Something went wrong.");
        } finally {
            setBusy(false);
        }
    };

    const fieldCls = "w-full px-3 py-1.5 text-xs border border-stone-200 rounded-lg " +
                    "outline-none focus:border-emerald-400 bg-white";

    return (
        <div className="border border-stone-200 rounded-xl p-4 space-y-3 bg-stone-50">
            <p className="text-xs font-semibold text-stone-700">Edit Farm</p>

            <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                    <label className="block text-[10px] text-stone-400 mb-0.5">Farm Name *</label>
                    <input className={fieldCls} value={form.name}
                        onChange={(e) => set("name", e.target.value)} />
                </div>
                <div className="col-span-2">
                    <label className="block text-[10px] text-stone-400 mb-0.5">Description</label>
                    <textarea className={fieldCls + " resize-none h-16"} value={form.description}
                        onChange={(e) => set("description", e.target.value)} />
                </div>
                <div className="col-span-2">
                    <label className="block text-[10px] text-stone-400 mb-0.5">Address</label>
                    <input className={fieldCls} value={form.address}
                        onChange={(e) => set("address", e.target.value)} />
                </div>
                <div>
                    <label className="block text-[10px] text-stone-400 mb-0.5">Latitude</label>
                    <input className={fieldCls} type="number" step="any" value={form.latitude}
                        onChange={(e) => set("latitude", e.target.value)} />
                </div>
                <div>
                    <label className="block text-[10px] text-stone-400 mb-0.5">Longitude</label>
                    <input className={fieldCls} type="number" step="any" value={form.longitude}
                        onChange={(e) => set("longitude", e.target.value)} />
                </div>
            </div>

            {err && <p className="text-[10px] text-rose-500 bg-rose-50 px-2 py-1 rounded">{err}</p>}

            <div className="flex gap-2">
                <button
                    onClick={handleSubmit}
                    disabled={busy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-500
                            hover:bg-emerald-600 text-white rounded-lg disabled:opacity-50"
                >
                    {busy ? <Spinner /> : null}
                    {busy ? "Saving…" : "Save Changes"}
                </button>
                <button
                    onClick={onCancel}
                    className="px-3 py-1.5 text-xs text-stone-500 hover:bg-stone-200 rounded-lg"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ─── PORTFOLIO UPLOADER ───────────────────────────────────────────
function PortfolioUploader({ farm, exportId, onDone }) {
    const { uploadPortfolio } = useAdmin();

    const [files, setFiles]   = useState([]);
    const [busy, setBusy]     = useState(false);
    const [err, setErr]       = useState(null);
    const [previews, setPreviews] = useState([]);

    const handleFiles = (e) => {
        const chosen = [...e.target.files];
        setFiles(chosen);
        setPreviews(chosen.map((f) => URL.createObjectURL(f)));
    };

    const handleUpload = async () => {
        if (!files.length) { setErr("Select at least one image."); return; }
        setBusy(true);
        setErr(null);
        try {
            await uploadPortfolio(farm.id, exportId, files);
            setFiles([]);
            setPreviews([]);
            onDone();
        } catch (e) {
            setErr(e?.message ?? "Upload failed.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="mt-2 space-y-2">
            {/* previews */}
            {previews.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {previews.map((src, i) => (
                        <img key={i} src={src} className="w-14 h-14 object-cover rounded-lg border border-stone-200" />
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 text-xs border border-stone-200
                                hover:border-emerald-400 rounded-lg text-stone-500 bg-white">
                    Choose Photos
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
                </label>

                {files.length > 0 && (
                    <span className="text-[10px] text-stone-400">{files.length} file(s) selected</span>
                )}

                <button
                    onClick={handleUpload}
                    disabled={busy || !files.length}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-500
                            hover:bg-purple-600 text-white rounded-lg disabled:opacity-40"
                >
                    {busy ? <Spinner /> : null}
                    {busy ? "Uploading…" : "Upload"}
                </button>
            </div>

            {err && <p className="text-[10px] text-rose-500">{err}</p>}
        </div>
    );
}

// ─── EXPORT CARD ──────────────────────────────────────────────────
function ExportCard({ exp, farm }) {
    const [showUploader, setShowUploader] = useState(false);
    const { fetchFarms } = useAdmin();

    const handleUploadDone = async () => {
        await fetchFarms();
        setShowUploader(false);
    };

    return (
        <div className="border border-stone-100 rounded-xl p-3 bg-white space-y-2">
            {/* meta row */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-stone-800">₱{exp.price}</span>
                    <span className="text-[10px] text-stone-400">·</span>
                    <span className="text-xs text-stone-500">{exp.stocks} kg</span>
                    {exp.quality && (
                        <Pill label={exp.quality} color={qualityColor[exp.quality] ?? "gray"} />
                    )}
                    {exp.soil_quality && (
                        <Pill label={exp.soil_quality} color={soilColor[exp.soil_quality] ?? "gray"} />
                    )}
                    {exp.temperature != null && (
                        <Pill label={`${exp.temperature}°C`} color="blue" />
                    )}
                </div>
                <span className="text-[10px] text-stone-400">
                    {new Date(exp.created_at).toLocaleDateString("en-PH", {
                        year: "numeric", month: "short", day: "numeric",
                    })}
                </span>
            </div>

            {/* portfolio */}
            {exp.portfolio.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {exp.portfolio.map((p) => (
                        <img
                            key={p.id}
                            src={`${p.photo}`}
                            className="w-14 h-14 object-cover rounded-lg border border-stone-100"
                            onError={(e) => { e.target.style.display = "none"; }}
                        />
                    ))}
                </div>
            )}

            {/* upload photos */}
            <button
                onClick={() => setShowUploader((v) => !v)}
                className="text-[10px] text-purple-500 hover:text-purple-700 flex items-center gap-1"
            >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4" />
                </svg>
                {showUploader ? "Hide uploader" : "Add photos"}
            </button>

            {showUploader && (
                <PortfolioUploader farm={farm} exportId={exp.id} onDone={handleUploadDone} />
            )}
        </div>
    );
}

// ─── FARM CARD ────────────────────────────────────────────────────
function FarmCard({ farm }) {
    const [view, setView] = useState("exports"); // "exports" | "edit" | "newExport"
    const { fetchFarms } = useAdmin();

    const handleDone = async () => {
        await fetchFarms();
        setView("exports");
    };

    return (
        <div className="border border-stone-200 rounded-xl overflow-hidden">

            {/* farm header */}
            <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-100">
                <div>
                    <p className="text-sm font-semibold text-stone-800">{farm.name}</p>
                    {farm.address && (
                        <p className="text-[10px] text-stone-400 mt-0.5">{farm.address}</p>
                    )}
                </div>

                {/* action buttons */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setView(view === "edit" ? "exports" : "edit")}
                        className={`px-2.5 py-1 text-[10px] rounded-lg border transition-colors
                            ${view === "edit"
                                ? "bg-stone-200 border-stone-300 text-stone-700"
                                : "bg-white border-stone-200 text-stone-500 hover:border-stone-400"}`}
                    >
                        {view === "edit" ? "Cancel Edit" : "Edit Farm"}
                    </button>
                    <button
                        onClick={() => setView(view === "newExport" ? "exports" : "newExport")}
                        className={`px-2.5 py-1 text-[10px] rounded-lg border transition-colors
                            ${view === "newExport"
                                ? "bg-stone-200 border-stone-300 text-stone-700"
                                : "bg-white border-stone-200 text-stone-500 hover:border-stone-400"}`}
                    >
                        {view === "newExport" ? "Cancel" : "+ Export"}
                    </button>
                </div>
            </div>

            {/* body */}
            <div className="p-4 space-y-3">

                {/* edit form */}
                {view === "edit" && (
                    <FarmEditForm farm={farm} onDone={handleDone} onCancel={() => setView("exports")} />
                )}

                {/* new export form */}
                {view === "newExport" && (
                    <ExportForm farmId={farm.id} onDone={handleDone} onCancel={() => setView("exports")} />
                )}

                {/* export list */}
                {view === "exports" && (
                    <>
                        {farm.export.length === 0 ? (
                            <p className="text-xs text-stone-400 italic">No exports yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {farm.export.map((exp) => (
                                    <ExportCard key={exp.id} exp={exp} farm={farm} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// ─── MAIN MODAL ───────────────────────────────────────────────────
export default function FarmerModal({ farmer, onClose }) {
    const { farms, fetchFarms, loading } = useAdmin();

    // always refresh farms when modal opens so data is current
    useEffect(() => {
        fetchFarms();
    }, [farmer.id]);

    const farmerFarms = farms.filter((f) => f.owner.id === farmer.id);
    const fullName    = `${farmer.first_name} ${farmer.last_name}`.trim();

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex justify-center items-start
                    pt-16 px-4 z-50 overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl shadow-black/10
                        border border-stone-100 overflow-hidden mb-16"
            >
                {/* ── header ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                        <Avatar name={fullName || farmer.username} size={10} />
                        <div>
                            <p className="text-sm font-semibold text-stone-800">{fullName || "—"}</p>
                            <p className="text-[11px] text-stone-400">@{farmer.username}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {farmer.email && (
                            <span className="text-[11px] text-stone-400 hidden sm:block">
                                {farmer.email}
                            </span>
                        )}
                        <button
                            onClick={onClose}
                            className="w-7 h-7 flex items-center justify-center rounded-lg
                                    text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── profile strip ── */}
                {(farmer.profile?.phone || farmer.profile?.address) && (
                    <div className="flex gap-4 px-6 py-2.5 bg-stone-50 border-b border-stone-100">
                        {farmer.profile?.phone && (
                            <span className="text-[11px] text-stone-500">
                                📞 {farmer.profile.phone}
                            </span>
                        )}
                        {farmer.profile?.address && (
                            <span className="text-[11px] text-stone-500">
                                📍 {farmer.profile.address}
                            </span>
                        )}
                    </div>
                )}

                {/* ── farms ── */}
                <div className="px-6 py-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                            Farms
                            <span className="ml-1.5 font-normal text-stone-400 normal-case tracking-normal">
                                ({farmerFarms.length})
                            </span>
                        </p>
                    </div>

                    {loading.farms ? (
                        <div className="flex items-center gap-2 text-xs text-stone-400 py-4">
                            <Spinner /> Loading farms…
                        </div>
                    ) : farmerFarms.length === 0 ? (
                        <p className="text-xs text-stone-400 italic py-2">
                            This farmer has no registered farms.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {farmerFarms.map((farm) => (
                                <FarmCard key={farm.id} farm={farm} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}