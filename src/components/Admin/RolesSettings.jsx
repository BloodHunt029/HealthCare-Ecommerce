import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Shield, Users, Activity, Lock, Unlock } from 'lucide-react';

export default function RolesSettings() {
  const { userRole, setUserRole, resetToDefaults } = useContext(AppContext);

  const rolesList = [
    { name: 'Super Admin', desc: 'Full administrative access to settings, inventory, refunds, discounts, layouts, and audit logs.', color: 'hsl(var(--primary))' },
    { name: 'Store/Catalog Manager', desc: 'Manage products details, variants, rentable rates, low stock alerts, and homepage collections.', color: 'hsl(var(--accent))' },
    { name: 'Order/Support Agent', desc: 'Process order fulfillments, track rental due calendars, extend agreements, and handle returns pickups.', color: '#3b82f6' },
    { name: 'Marketing Manager', desc: 'Configure promotional coupon rules, generate UTM campaign links, check analytics dashboards, and configure pixels.', color: '#8b5cf6' },
    { name: 'Content Editor', desc: 'Publish caregiver blogs and edit FAQ accordion elements. Access restricted from core transaction data.', color: '#10b981' }
  ];

  // Static Audit logs
  const auditLogs = [
    { time: '2026-07-18 19:40', user: 'Super Admin (System)', action: 'Initialized database and loaded default medical equipment catalog.' },
    { time: '2026-07-18 20:00', user: 'Sanjay Kumar (Storefront)', action: 'Completed order AC-1001 for Premium Electric Hospital Bed (Rent).' },
    { time: '2026-07-18 20:15', user: 'Meera Sen (Storefront)', action: 'Checked out diaper packs using coupon HEALTH10.' },
    { time: '2026-07-18 20:30', user: 'Super Admin', action: 'Modified SEO meta Title override tags on upper arm BP cuff PDP.' },
    { time: '2026-07-18 20:45', user: 'Order Agent', action: 'Scheduled equipment collection return request for order AC-1001.' }
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      
      {/* Welcome header */}
      <div style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Roles & Scoped Authorization</h1>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem' }}>Configure staff permission scopes and audit back-office transactions logs.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left Side: Role Swapper */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Shield size={20} /> Active Staff Role
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {rolesList.map(r => {
              const isSelected = userRole === r.name;
              return (
                <button
                  key={r.name}
                  onClick={() => {
                    setUserRole(r.name);
                    alert(`Staff session switched. Scoped authorization active for: ${r.name}`);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0.85rem 1rem',
                    border: '1px solid',
                    borderColor: isSelected ? r.color : 'hsl(var(--border))',
                    backgroundColor: isSelected ? 'hsl(var(--secondary) / 0.3)' : 'hsl(var(--card))',
                    borderRadius: '8px',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: r.color }}></span>
                    <strong style={{ fontSize: '0.9rem', color: isSelected ? r.color : 'hsl(var(--text-main))' }}>{r.name}</strong>
                    {isSelected && <span style={{ fontSize: '0.65rem', fontWeight: '800', color: r.color, textTransform: 'uppercase', border: '1px solid', padding: '0px 4px', borderRadius: '4px', borderColor: r.color }}>Active Session</span>}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', lineHeight: '1.4' }}>{r.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Audit Log & Data Storage Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ backgroundColor: 'white' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              💾 Persistent Local Storage
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', marginBottom: '1rem' }}>
              All inventory, prices, layout edits, orders, and telemetry sessions are saved to browser local storage and will persist across terminal restarts.
            </p>
            <button 
              className="btn btn-outline" 
              style={{ fontSize: '0.8rem', color: 'hsl(var(--destructive))', borderColor: 'hsl(var(--destructive) / 0.3)' }}
              onClick={resetToDefaults}
            >
              🔄 Reset Store Data to Defaults
            </button>
          </div>

          {/* Audit Logs */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Activity size={20} /> System Audit Logs
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {auditLogs.map((log, i) => (
                <div key={i} style={{ fontSize: '0.8rem', paddingBottom: '0.75rem', borderBottom: '1px solid hsl(var(--border))', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--text-muted))' }}>
                    <span>{log.time}</span>
                    <strong>{log.user}</strong>
                  </div>
                  <span style={{ color: 'hsl(var(--text-main))', lineHeight: '1.3' }}>{log.action}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

// Scoped View authorization helper to lock page segments based on role
export function RoleAccessWrapper({ children, allowedRoles, currentRole }) {
  const isAllowed = allowedRoles.includes(currentRole);
  
  if (!isAllowed) {
    return (
      <div className="card text-center animate-fade-in" style={{ padding: '4rem 2rem', border: '2px dashed hsl(var(--border))', maxWidth: '600px', margin: '3rem auto' }}>
        <div style={{ backgroundColor: 'hsl(var(--destructive-bg))', color: 'hsl(var(--destructive))', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Lock size={28} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Access Denied</h2>
        <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          Your current session active role (<strong>{currentRole}</strong>) does not have scoped authorization to inspect or write data to this panel.
        </p>
        <div style={{ fontSize: '0.8rem', color: 'hsl(var(--primary))', fontWeight: '600' }}>
          Contact Super Admin or switch active roles under "Roles Settings" to request clearance.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
