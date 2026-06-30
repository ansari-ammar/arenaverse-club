import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArenaShell, GlassCard } from "@/components/arena/Shell";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support — ArenaVerse" }] }),
  component: Support,
});

type Ticket = { id: string; name: string; type: string; description: string; priority: string; screenshot?: string; status: "Open" | "In Progress" | "Resolved"; response?: string; createdAt: string };

const STORAGE = "arena_tickets_v1";
function loadTickets(): Ticket[] { try { return JSON.parse(localStorage.getItem(STORAGE) ?? "[]"); } catch { return []; } }
function saveTickets(t: Ticket[]) { localStorage.setItem(STORAGE, JSON.stringify(t)); }

const ISSUE_TYPES = ["Complaint", "Suggestion", "Feedback", "Report Issue", "Booking Help", "Payment Issue"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const FAQS = [
  { q: "How do I redeem my UU student discount?", a: "Sign in via University Login with your UU ID — the 20% discount applies automatically at checkout." },
  { q: "Can I cancel my booking?", a: "Bookings can be cancelled up to 2 hours before slot start from your Profile page. Refunds reach you in 3–5 business days." },
  { q: "What payment methods are supported?", a: "UPI, all major cards, Razorpay, Paytm, Stripe and cash at counter." },
  { q: "How does the digital pass work?", a: "After payment you receive a QR pass — show it at entry. It also doubles as a receipt." },
  { q: "Do I need to be a member?", a: "No. Membership unlocks lounge access, priority slots and bonus rewards but is optional." },
];

function Support() {
  const [tickets, setTickets] = useState<Ticket[]>(loadTickets());
  const [form, setForm] = useState({ name: "", type: ISSUE_TYPES[0], description: "", priority: "Medium" });
  const [screenshot, setScreenshot] = useState<string>("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2 || form.description.trim().length < 10) return alert("Add your name and a description of at least 10 characters.");
    const t: Ticket = {
      id: "TCK-" + Math.random().toString(36).slice(2,8).toUpperCase(),
      ...form, screenshot, status: "Open", createdAt: new Date().toISOString(),
      response: form.type === "Feedback" ? "Thanks! The team has been notified." : undefined,
    };
    const next = [t, ...tickets];
    setTickets(next); saveTickets(next);
    setSubmitted(t.id);
    setForm({ name: form.name, type: ISSUE_TYPES[0], description: "", priority: "Medium" });
    setScreenshot("");
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 2 * 1024 * 1024) return alert("Max 2MB");
    const r = new FileReader(); r.onload = () => setScreenshot(String(r.result)); r.readAsDataURL(f);
  }

  return (
    <ArenaShell title="Support Center">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <GlassCard>
            <h2 className="font-display text-xl font-black">Raise a Ticket</h2>
            <p className="mt-1 text-sm text-muted-foreground">Complaints, suggestions, feedback or report an issue.</p>
            <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Name" value={form.name} onChange={v => setForm({...form, name: v})} />
              <SelectField label="Issue Type" value={form.type} onChange={v => setForm({...form, type: v})} options={ISSUE_TYPES} />
              <SelectField label="Priority" value={form.priority} onChange={v => setForm({...form, priority: v})} options={PRIORITIES} />
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Screenshot (optional)</span>
                <input type="file" accept="image/*" onChange={onFile} className="mt-2 w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-xs" />
              </label>
              <label className="sm:col-span-2 block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Description</span>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4}
                  placeholder="Describe the issue or your feedback…"
                  className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/30" />
              </label>
              {screenshot && <img src={screenshot} alt="preview" className="h-32 w-32 rounded-xl object-cover sm:col-span-2" />}
              <button className="btn-primary sm:col-span-2">Submit Ticket</button>
              {submitted && <p className="sm:col-span-2 text-sm text-neon-cyan">✓ Ticket <span className="font-bold">{submitted}</span> created. We'll respond within 24 hours.</p>}
            </form>
          </GlassCard>

          <GlassCard>
            <h2 className="font-display text-xl font-black">My Tickets</h2>
            {tickets.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No tickets yet.</p> : (
              <div className="mt-4 space-y-3">
                {tickets.map(t => (
                  <div key={t.id} className="rounded-xl border border-border bg-background/40 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-mono text-xs text-neon-cyan">{t.id}</div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="rounded-full bg-secondary px-2 py-0.5">{t.type}</span>
                        <span className="rounded-full bg-neon-purple/20 px-2 py-0.5 text-neon-purple">{t.priority}</span>
                        <span className={`rounded-full px-2 py-0.5 ${t.status==="Resolved"?"bg-neon-cyan/20 text-neon-cyan":t.status==="In Progress"?"bg-neon-gold/20 text-neon-gold":"bg-secondary"}`}>{t.status}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{t.description}</p>
                    {t.response && <p className="mt-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 p-2 text-xs"><span className="font-bold text-neon-cyan">Admin:</span> {t.response}</p>}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard>
            <h2 className="font-display text-xl font-black">FAQs</h2>
            <div className="mt-4 space-y-2">
              {FAQS.map((f, i) => (
                <details key={i} className="group rounded-xl border border-border bg-background/40 p-4">
                  <summary className="cursor-pointer text-sm font-semibold marker:hidden">{f.q}</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </GlassCard>
        </div>

        <aside className="space-y-4">
          <GlassCard>
            <h3 className="font-display text-lg font-black">Contact</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div>📍 ArenaVerse · United University<br/><span className="text-xs text-muted-foreground">Rawatpur, Prayagraj — 211012</span></div>
              <div>📞 +91 80000 00000</div>
              <div>✉️ support@arenaverse.club</div>
              <div className="text-xs text-muted-foreground">Open 10am – 1am · 365 days</div>
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-neon-cyan">SLA</h3>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>· Urgent — under 2 hours</li>
              <li>· High — under 6 hours</li>
              <li>· Medium — within 24 hours</li>
              <li>· Low — within 72 hours</li>
            </ul>
          </GlassCard>
        </aside>
      </div>
    </ArenaShell>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
    <input value={value} onChange={e => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/30" /></label>;
}
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return <label className="block"><span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
    <select value={value} onChange={e => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-neon-purple">
      {options.map(o => <option key={o}>{o}</option>)}
    </select></label>;
}
