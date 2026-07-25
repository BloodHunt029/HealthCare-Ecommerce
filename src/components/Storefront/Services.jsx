import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ShieldAlert, Users, Settings, Home, CheckCircle2, PhoneCall } from 'lucide-react';

export default function Services() {
  const { submitLead } = useContext(AppContext);
  const [selectedService, setSelectedService] = useState('Home Safety Assessment');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientPincode, setClientPincode] = useState('');
  const [clientNeeds, setClientNeeds] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: clientName,
      phone: clientPhone,
      pincode: clientPincode,
      need: `${selectedService}: ${clientNeeds}`
    };
    submitLead(payload);
    setSuccess(true);
    setClientName('');
    setClientPhone('');
    setClientPincode('');
    setClientNeeds('');
    setTimeout(() => setSuccess(false), 5000);
  };

  const serviceOffers = [
    {
      title: 'Home Safety Assessment',
      icon: <Home size={28} />,
      desc: 'Prevent falls & accidents. An expert therapist visits your home to evaluate flooring, stairs, bathroom fixtures (grab bars, shower chairs), lighting, and bedroom accessibility, delivering a safety audit report.',
      charge: '₹999 Consultation'
    },
    {
      title: 'Clinical Equipment Setup',
      icon: <Settings size={28} />,
      desc: 'Expert delivery, assembly, structural testing, and demonstration of electric beds, patient hoists, motorized wheelchairs, and oxygen concentrators. Crucial for first-time caregivers.',
      charge: 'Free for Chennai Rentals/Purchases'
    },
    {
      title: 'Personalized Caregiver Matching',
      icon: <Users size={28} />,
      desc: 'We assist in sourcing, screening, and matching trained patient care assistants, nursing staff, or physiotherapists for post-operative recovery, geriatric care, or chronic care management at home.',
      charge: 'Custom Quote'
    }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem', flex: 1 }} className="animate-fade-in">
      
      {/* Intro */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
        <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>Value Added Health Services</span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1rem' }}>Integrated Care Services at Your Doorstep</h1>
        <p style={{ color: 'hsl(var(--text-muted))', fontSize: '1.05rem', lineHeight: '1.6' }}>
          AeonCare provides critical in-home services in Chennai to ensure patient environments are safe, equipment is fully operational, and families have professional staffing resources.
        </p>
      </div>

      {/* Services Offers Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        {serviceOffers.map(svc => (
          <div key={svc.title} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', padding: '0.75rem', borderRadius: '12px' }}>
                {svc.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{svc.title}</h3>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', lineHeight: '1.5', flex: 1, marginBottom: '1.5rem' }}>{svc.desc}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid hsl(var(--border))', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'hsl(var(--primary))' }}>{svc.charge}</span>
              <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setSelectedService(svc.title)}>
                Request callback
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Leads form and Call Assist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Booking Form */}
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.5rem' }}>Request Service Consultation</h2>
          
          {success && (
            <div style={{ backgroundColor: 'hsl(var(--success-bg))', color: 'hsl(var(--success))', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} />
              <span>Lead logged successfully! A customer support assistant will phone you back in 1 hour.</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Caregiver / Client Name</label>
                <input type="text" className="form-input" required value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number (WhatsApp Active)</label>
                <input type="tel" className="form-input" required value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="e.g. 9176000000" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Target Service</label>
                <select className="form-input" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                  <option value="Home Safety Assessment">Home Safety Assessment</option>
                  <option value="Clinical Equipment Setup">Clinical Equipment Setup</option>
                  <option value="Personalized Caregiver Matching">Personalized Caregiver Matching</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Pincode (Chennai Service Limits)</label>
                <input type="text" maxLength="6" className="form-input" required value={clientPincode} onChange={(e) => setClientPincode(e.target.value.replace(/\D/g,''))} placeholder="e.g. 600041" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description of Patient Care Needs</label>
              <textarea className="form-input" required value={clientNeeds} onChange={(e) => setClientNeeds(e.target.value)} placeholder="e.g. Patient is 75 yrs old recovering from hip replacement, needs safety bars fitted in bathroom." style={{ minHeight: '90px', fontFamily: 'inherit' }}></textarea>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Submit Inquiry Lead</button>
          </form>
        </div>

        {/* Callback Banner */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-h) 80% 25%) 100%)',
          color: 'white',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2.5rem 2rem'
        }}>
          <div style={{ backgroundColor: 'white', color: 'hsl(var(--primary))', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContext: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <PhoneCall size={24} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Emergency Helpline</h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '2rem' }}>
            Facing discharge emergency from hospital and need immediate installation of oxygen concentrators or ICU cots? Call our rapid helpline. 
          </p>
          <a href="tel:+919840123456" className="btn btn-accent" style={{ alignSelf: 'flex-start', padding: '0.625rem 1.25rem' }}>
            Call +91 98401 23456
          </a>
        </div>

      </div>

    </div>
  );
}
