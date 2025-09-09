npm i tailwindcss @tailwindcss/vite

How to apply in your pages (examples)

Top bar + page layout:

<!-- <nav className="h-14 border-b border-[color:var(--color-border)] 95 backdrop-blur px-4 flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="text-lg font-semibold">Convoy Connect</span>
</div>
<div className="flex items-center gap-2">
{/* dark-mode toggle example */}
<button onClick={() => document.documentElement.classList.remove('dark')} className="btn-secondary">Light</button>
<button onClick={() => document.documentElement.classList.add('dark')} className="btn-primary">Dark</button>
</div>
</nav>
<main className="cc-page">
<header className="mb-4">
<h1 className="cc-page-title">Dashboard</h1>
<p className="text-sm text-[color:var(--color-text-secondary)]">Unit readiness and active dispatches</p>
</header>
<div className="cc-actionbar">
<div className="flex items-center gap-2">
<input className="input w-64" placeholder="Search" />
<button className="btn-secondary">Filter</button>
<button className="btn-primary">New Request</button>
</div>
</div>
{/* content here */}
</main>

Status badge usage:
<span className="state-DISPATCHED">DISPATCHED</span>

Lightly striped table with sticky header:

<table className="table">
<thead className="thead">
<tr>
<th className="th sortable">Vehicle</th>
<th className="th">Driver</th>
<th className="th">Status</th>
</tr>
</thead>
<tbody>
{rows.map((r) => (
<tr key={r.id} className={`tr tr-striped row-hover`}>
<td className="td">{r.vehicle}</td>
<td className="td">{r.driver}</td>
<td className="td"><span className={`state-${r.status}`}>{r.status}</span></td>
</tr>
))}
</tbody>
</table>

Form field with comfy size + inline validation:
<label className="label required" htmlFor="destination">Destination</label>
<input id="destination" className="input" />

<p className="error">This field is required</p>

Dark mode toggle
Use document.documentElement.classList.toggle('dark') from a settings button. All tokens are dark‑aware already. -->
