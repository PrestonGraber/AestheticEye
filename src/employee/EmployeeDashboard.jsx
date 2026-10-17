import React, { useState } from 'react';
const resources = [
  { title: 'Patient resources', text: 'Instructions and information to share before and after a visit.', href: '/patient-resources/', type: 'Patient care' },
  { title: 'Treatment gallery', text: 'The practice’s published before-and-after photographs.', href: '/gallery/', type: 'Treatments' },
  { title: 'Payment plans', text: 'Financing information and the existing Cherry application.', href: '/payment-plans/', type: 'Patient care' },
  { title: 'Practice information', text: 'Office locations, opening hours, and contact details.', href: '/contact/', type: 'Practice' },
];
const views = ['Overview', 'Enquiries', 'Quiz leads', 'Website resources'];
export default function EmployeeDashboard({ name, preview = false, onExit, busy = false }) {
  const [view, setView] = useState('Overview');
  const [query, setQuery] = useState('');
  const visible = resources.filter((resource) => `${resource.title} ${resource.text} ${resource.type}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <div className="staff-dashboard">
    {preview && <div className="staff-preview"><strong>Design preview</strong><span>No live staff or patient data. Sign-in is not connected.</span><button onClick={onExit}>Exit preview</button></div>}
    <div className="staff-layout">
      <aside className="staff-sidebar">
        <p className="employee-eyebrow">Team workspace</p>
        <nav aria-label="Workspace sections">{views.map((item) => <button key={item} aria-current={view === item ? 'page' : undefined} onClick={() => { setView(item); setQuery(''); }}>{item}<span aria-hidden="true">↗</span></button>)}</nav>
        <div className="staff-sidebar-bottom"><span>AestheticEye</span><small>Cincinnati & Dayton</small>{!preview && <button onClick={onExit} disabled={busy}>Sign out</button>}</div>
      </aside>
      <section className="staff-content" aria-label={view}>
        <p className="employee-eyebrow">AestheticEye / {view}</p>
        <h1>{view === 'Overview' ? name ? `Welcome, ${name}.` : 'Your practice, at a glance.' : view}</h1>
        <p className="staff-intro">{view === 'Overview' ? 'A clear starting point for your team’s day.' : view === 'Website resources' ? 'Find the information your patients need, ready to share.' : 'A dedicated space for your team to follow up.'}</p>
        {view === 'Overview' && <>
          <div className="staff-status-grid">{['Enquiries', 'Quiz leads'].map((item) => <button key={item} onClick={() => setView(item)}><span>{item}</span><strong>Not connected</strong><small>View workspace <span aria-hidden="true">↗</span></small></button>)}</div>
          <div className="staff-section-heading"><h2>Useful every day</h2><button onClick={() => setView('Website resources')}>All resources <span aria-hidden="true">↗</span></button></div>
          <ResourceList resources={resources.slice(0, 2)} />
          <p className="staff-note">Patient records and scheduling remain in your existing practice systems.</p>
        </>}
        {['Enquiries', 'Quiz leads'].includes(view) && <div className="staff-empty">
          <span className="staff-empty-mark" aria-hidden="true">{view === 'Enquiries' ? '↗' : '≋'}</span>
          <p className="employee-eyebrow">Connection pending</p>
          <h2>{view === 'Enquiries' ? 'Enquiries aren’t connected yet.' : 'Quiz leads aren’t connected yet.'}</h2>
          <p>{view === 'Enquiries' ? 'Website enquiries will appear here once your practice’s form delivery and staff permissions are connected.' : 'Quiz responses will appear here once lead capture, consent, and staff permissions are connected.'}</p>
          <p className="staff-empty-detail">No records are being collected or displayed in this workspace yet.</p>
        </div>}
        {view === 'Website resources' && <>
          <label className="staff-search" htmlFor="staff-resource-search"><span>Search resources</span><input id="staff-resource-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try gallery, instructions, or payment" /></label>
          <p className="staff-result-count" role="status">{visible.length} {visible.length === 1 ? 'resource' : 'resources'}</p>
          {visible.length ? <ResourceList resources={visible} /> : <p className="staff-no-results">No matching resources. Try a different word or clear your search.</p>}
        </>}
      </section>
    </div>
  </div>;
}
function ResourceList({ resources }) {
  return <div className="staff-resource-list">{resources.map((resource) => <a key={resource.href} href={resource.href}><div><small>{resource.type}</small><h3>{resource.title}</h3><p>{resource.text}</p></div><span aria-hidden="true">↗</span></a>)}</div>;
}
