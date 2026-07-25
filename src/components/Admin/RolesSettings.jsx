import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Shield, Users, Activity, Lock, CheckCircle2, XCircle, UserPlus, Clock, Trash2, Mail } from 'lucide-react';

export default function RolesSettings() {
  const { 
    userRole, setUserRole, 
    approvedStaff, pendingRequests, 
    approveStaffRequest, rejectStaffRequest, removeApprovedStaff 
  } = useContext(AppContext);

  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Store/Catalog Manager');
  const [selectedPendingRoles, setSelectedPendingRoles] = useState({});

  const rolesList = [
    { name: 'Super Admin', desc: 'Full administrative access to settings, inventory, refunds, discounts, layouts, and audit logs.', color: 'hsl(var(--primary))' },
    { name: 'Store/Catalog Manager', desc: 'Manage products details, variants, rentable rates, low stock alerts, and homepage collections.', color: 'hsl(var(--accent))' },
    { name: 'Order/Support Agent', desc: 'Process order fulfillments, track rental due calendars, extend agreements, and handle returns pickups.', color: '#3b82f6' },
    { name: 'Marketing Manager', desc: 'Configure promotional coupon rules, generate UTM campaign links, check analytics dashboards, and configure pixels.', color: '#8b5cf6' },
    { name: 'Content Editor', desc: 'Publish caregiver blogs and edit FAQ accordion elements. Access restricted from core transaction data.', color: '#10b981' }
  ];

  const handleAddManualStaff = (e) => {
    e.preventDefault();
    if (!newStaffEmail.trim()) return;
    approveStaffRequest(newStaffEmail.trim(), newStaffRole);
    setNewStaffEmail('');
  };

  const handlePendingRoleChange = (email, role) => {
    setSelectedPendingRoles(prev => ({ ...prev, [email]: role }));
  };

  // Static Audit logs
  const auditLogs = [
    { time: '2026-07-25 18:40', user: 'Super Admin', action: 'Approved prasanth08-29@gmail.com with Super Admin privileges.' },
    { time: '2026-07-25 18:00', user: 'System', action: 'Initialized persistent staff email whitelist and authorization rules.' },
    { time: '2026-07-18 20:30', user: 'Super Admin', action: 'Modified SEO meta Title override tags on upper arm BP cuff PDP.' },
    { time: '2026-07-18 20:45', user: 'Order Agent', action: 'Scheduled equipment collection return request for order AC-1001.' }
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1050px', margin: '0 auto' }}>
      
      {/* Welcome header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: '#1e293b' }}>
          Roles & Staff Authorization Settings
        </h1>
        <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem', margin: '4px 0 0' }}>
          Approve or reject staff access requests, manage active admin roles, and inspect back-office logs.
        </p>
      </div>

      {/* ================= SECTION 1: PENDING STAFF APPROVALS (If Any) ================= */}
      {pendingRequests && pendingRequests.length > 0 && (
        <div className="card animate-fade-in" style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Clock size={20} style={{ color: '#d97706' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#92400e', margin: 0 }}>
              Pending Staff Access Requests ({pendingRequests.length})
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#b45309', marginBottom: '1.25rem' }}>
            The following Gmail accounts attempted to sign into the Admin Panel. Assign a staff role and approve or reject access.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingRequests.map(req => {
              const assignedRole = selectedPendingRoles[req.email] || 'Store/Catalog Manager';
              return (
                <div key={req.email} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #fef3c7',
                  borderRadius: '8px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={16} style={{ color: '#2563eb' }} />
                      {req.email}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      Requested access on {req.requestedAt}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <select 
                      className="form-input" 
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '180px' }}
                      value={assignedRole}
                      onChange={(e) => handlePendingRoleChange(req.email, e.target.value)}
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Store/Catalog Manager">Store/Catalog Manager</option>
                      <option value="Order/Support Agent">Order/Support Agent</option>
                      <option value="Marketing Manager">Marketing Manager</option>
                      <option value="Content Editor">Content Editor</option>
                    </select>

                    <button
                      onClick={() => approveStaffRequest(req.email, assignedRole)}
                      className="btn btn-primary"
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', backgroundColor: '#10b981', borderColor: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <CheckCircle2 size={14} /> Approve Access
                    </button>

                    <button
                      onClick={() => rejectStaffRequest(req.email)}
                      className="btn btn-ghost"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side: Role Definitions & Active Session */}
        <div className="card" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Shield size={20} style={{ color: '#2563eb' }} /> Active Staff Role
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            {rolesList.map(r => {
              const isSelected = userRole === r.name;
              return (
                <button
                  key={r.name}
                  onClick={() => {
                    setUserRole(r.name);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0.85rem 1rem',
                    border: '1px solid',
                    borderColor: isSelected ? r.color : '#e2e8f0',
                    backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.05)' : '#ffffff',
                    borderRadius: '8px',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: r.color }}></span>
                    <strong style={{ fontSize: '0.9rem', color: isSelected ? r.color : '#1e293b' }}>{r.name}</strong>
                    {isSelected && <span style={{ fontSize: '0.65rem', fontWeight: '800', color: r.color, textTransform: 'uppercase', border: '1px solid', padding: '0px 4px', borderRadius: '4px', borderColor: r.color }}>Active Session</span>}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4', margin: 0 }}>{r.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Approved Staff List & Add New Staff */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Approved Staff Accounts */}
          <div className="card" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Users size={20} style={{ color: '#10b981' }} /> Approved Staff Accounts ({approvedStaff?.length || 0})
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Only staff emails listed below can log into the Admin Portal.
            </p>

            {/* Staff Accounts List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {approvedStaff && approvedStaff.map(staff => (
                <div key={staff.email} style={{
                  border: '1px solid #f1f5f9',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>
                      {staff.email}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>
                      Role: {staff.role || 'Super Admin'}
                    </div>
                  </div>

                  <button
                    onClick={() => removeApprovedStaff(staff.email)}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                    title="Revoke Staff Access"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Staff Form */}
            <form onSubmit={handleAddManualStaff} style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#334155', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <UserPlus size={16} /> Add Pre-Approved Staff Gmail
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <input 
                  type="email" 
                  required
                  className="form-input" 
                  placeholder="staffname@gmail.com" 
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select 
                    className="form-input"
                    style={{ flex: 1 }}
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Store/Catalog Manager">Store/Catalog Manager</option>
                    <option value="Order/Support Agent">Order/Support Agent</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                    <option value="Content Editor">Content Editor</option>
                  </select>
                  <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    + Add Staff
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Audit Logs */}
          <div className="card" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Activity size={20} style={{ color: '#8b5cf6' }} /> System Audit Logs
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {auditLogs.map((log, i) => (
                <div key={i} style={{ fontSize: '0.78rem', paddingBottom: '0.6rem', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>{log.time}</span>
                    <strong style={{ color: '#334155' }}>{log.user}</strong>
                  </div>
                  <span style={{ color: '#1e293b', lineHeight: '1.3' }}>{log.action}</span>
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
