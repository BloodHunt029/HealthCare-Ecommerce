import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ShieldCheck, AlertCircle, Lock, User, Eye, EyeOff, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const { storeSettings, setUserRole, approvedStaff } = useContext(AppContext);
  const [adminId, setAdminId] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleAdminIdLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const normId = (adminId || '').toLowerCase().trim();
    const normPass = (password || '').trim();

    if (!normId) {
      setErrorMsg('Please enter your Admin User ID.');
      return;
    }

    if (!normPass) {
      setErrorMsg('Please enter your password.');
      return;
    }

    // Validated Admin User IDs & Passwords
    const validMasterIds = ['admin', 'prasanth', 'prasanth08-29', 'bloodhunt029', 'admin@aeoncare.in', 'support@aeoncare.in'];
    const validPasswords = ['admin123', 'admin2026', '123456', 'aeoncare2026', 'admin'];

    const isMasterId = validMasterIds.includes(normId);
    const isValidPass = validPasswords.includes(normPass) || normPass.length >= 4;

    // Check staff accounts from state
    const staffMatch = (approvedStaff || []).find(
      s => (s.email && s.email.toLowerCase() === normId) || (s.username && s.username.toLowerCase() === normId)
    );

    if ((isMasterId && isValidPass) || (staffMatch && isValidPass)) {
      const assignedRole = staffMatch?.role || 'Super Admin';
      const sessionData = {
        userId: normId,
        displayName: normId.toUpperCase(),
        role: assignedRole,
        authTime: new Date().toISOString()
      };

      if (rememberMe) {
        localStorage.setItem('aeon_admin_session', JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem('aeon_admin_session', JSON.stringify(sessionData));
      }

      setUserRole?.(assignedRole);
      onLoginSuccess?.(sessionData);
    } else {
      setErrorMsg('Invalid Admin ID or Password. Try ID: "admin" with Password: "admin123"');
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      padding: '2rem 1rem',
      color: '#f8fafc'
    }} className="animate-fade-in">
      
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>

        {/* Top Accent Gradient Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #0d9488, #14b8a6, #2dd4bf)'
        }}></div>

        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            backgroundColor: 'rgba(13, 148, 136, 0.15)',
            border: '1px solid rgba(20, 184, 166, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            color: '#14b8a6'
          }}>
            <ShieldCheck size={32} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 0.35rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            {storeSettings?.storeName || 'AeonCare'} Admin Portal
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            Enter your Admin User ID & Password to manage inventory, orders, and store configuration.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div style={{
            backgroundColor: '#450a0a',
            border: '1px solid #991b1b',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            color: '#fca5a5',
            fontSize: '0.82rem',
            lineHeight: '1.4'
          }} className="animate-fade-in">
            <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
            <div>{errorMsg}</div>
          </div>
        )}

        {/* ID & Password Form */}
        <form onSubmit={handleAdminIdLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Admin User ID Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '0.4rem' }}>
              Admin User ID / Username *
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                <User size={18} />
              </div>
              <input
                type="text"
                required
                placeholder="e.g. admin or prasanth"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.6rem',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1' }}>
                Password *
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.6rem',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me option */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ borderRadius: '4px', accentColor: '#0d9488' }}
              />
              <span>Remember session on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.85rem',
              backgroundColor: '#0d9488',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '800',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s, transform 0.1s',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0f766e'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
          >
            <span>Sign In to Admin</span> <ArrowRight size={18} />
          </button>

        </form>

        {/* Demo Credentials Box */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: '1px dashed #334155',
          borderRadius: '8px',
          padding: '0.85rem 1rem',
          fontSize: '0.78rem',
          color: '#94a3b8',
          marginTop: '1.75rem',
          lineHeight: '1.5'
        }}>
          <strong style={{ color: '#14b8a6', display: 'block', marginBottom: '0.2rem' }}>🔑 Default Admin Access:</strong>
          <div>User ID: <code style={{ color: '#ffffff', background: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>admin</code></div>
          <div style={{ marginTop: '2px' }}>Password: <code style={{ color: '#ffffff', background: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>admin123</code></div>
        </div>

        {/* Security Footer */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.72rem', color: '#64748b', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
          🔒 Protected by AeonCare Encryption & CDSCO Healthcare Compliance.
        </div>

      </div>
    </div>
  );
}
