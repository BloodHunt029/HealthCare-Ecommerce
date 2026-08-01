import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { PhoneCall, X, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export default function RequestCallbackWidget() {
  const { submitLead } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [topic, setTopic] = useState('Product Choice Assistance');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    submitLead({
      name,
      phone,
      pincode: pincode || '600089',
      need: `[Callback Request] Topic: ${topic}`
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setName('');
      setPhone('');
      setPincode('');
    }, 3000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          backgroundColor: 'hsl(var(--primary))',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50px',
          padding: '0.75rem 1.25rem',
          boxShadow: '0 10px 25px rgba(13, 148, 136, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontWeight: '700',
          fontSize: '0.875rem',
          zIndex: 999,
          transition: 'all 0.2s ease-in-out'
        }}
        className="btn-hover-scale"
        title="Request a Call Back"
      >
        <PhoneCall size={18} />
        <span>Request Callback</span>
      </button>

      {/* Callback Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0, left: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="animate-fade-in card" style={{ width: '100%', maxWidth: '440px', padding: '1.75rem', position: 'relative' }}>
            
            <button
              onClick={() => setIsOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--primary))', padding: '0.6rem', borderRadius: '10px' }}>
                <PhoneCall size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>Request Free Expert Callback</h3>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Speak with our clinical equipment specialist in 15 mins</span>
              </div>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', backgroundColor: 'hsl(var(--success-bg))', borderRadius: '12px', color: 'hsl(var(--success))' }}>
                <CheckCircle2 size={48} style={{ marginBottom: '0.75rem' }} />
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Callback Request Logged!</h4>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Our healthcare support agent will phone you at <strong>{phone}</strong> shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98401 23456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>Pincode</label>
                    <input
                      type="text"
                      placeholder="600089"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>Topic / Help Needed</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: '0.9rem', backgroundColor: '#fff' }}
                  >
                    <option value="Product Choice Assistance">Product Choice & Sizing Assistance</option>
                    <option value="Home Safety Consultation">Home Safety & Accessibility Audit</option>
                    <option value="Bulk Order Inquiry">Bulk / Hospital Purchase Quote</option>
                    <option value="Delivery Time Query">Express Delivery Inquiry</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                  <ShieldCheck size={16} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
                  <span>100% Privacy Guarantee. We never spam or share your contact details.</span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.75rem', fontWeight: '800', fontSize: '0.95rem', width: '100%' }}
                >
                  Call Me Back
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
