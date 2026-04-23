import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const NAVY = '#021A35';
const GOLD = '#FDD20D';

const inputStyle = {
  width: '100%', padding: '14px 16px', borderRadius: 8,
  border: '1px solid #CBD5E1', background: 'white',
  fontSize: '0.95rem', boxSizing: 'border-box',
  fontFamily: "'Outfit', sans-serif", color: '#021A35',
};

const labelStyle = {
  display: 'block', fontSize: '0.82rem', fontWeight: 600,
  color: '#475569', textTransform: 'uppercase',
  letterSpacing: '0.05em', marginBottom: 6,
};

export default function CohortApply() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    city: '', archetype: '', leadership_stage: '',
    business_or_ministry: '', why_now: '', commitment_confirmed: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(field) {
    return e => setForm(prev => ({
      ...prev,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.commitment_confirmed) {
      setError('Please confirm your commitment before applying.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/called-to-carry/cohort-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push('/cohort/thank-you');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Apply — Called to Carry Cohort</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ background: '#F8F9FA', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>

        {/* Header */}
        <div style={{ background: NAVY, padding: '20px 24px', textAlign: 'center' }}>
          <p style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontStyle: 'italic', margin: 0 }}>
            Called to Carry Cohort
          </p>
          <h1 style={{ color: 'white', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 700, margin: '8px 0 0' }}>
            Application
          </h1>
        </div>

        {/* Form */}
        <div style={{ maxWidth: 620, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '40px 32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 32, marginTop: 0 }}>
              Applications are reviewed within 48 hours. Upon approval you will be directed to complete your $497 enrollment.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>First Name *</label>
                  <input required type="text" value={form.first_name} onChange={update('first_name')} placeholder="First" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Last Name *</label>
                  <input required type="text" value={form.last_name} onChange={update('last_name')} placeholder="Last" style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Email Address *</label>
                <input required type="email" value={form.email} onChange={update('email')} placeholder="your@email.com" style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input type="tel" value={form.phone} onChange={update('phone')} placeholder="Optional" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>City</label>
                  <input type="text" value={form.city} onChange={update('city')} placeholder="City, State" style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Your Called to Carry Archetype</label>
                <input type="text" value={form.archetype} onChange={update('archetype')} placeholder="e.g. Pioneer Builder, Seer Reformer" style={inputStyle} />
                <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '6px 0 0' }}>
                  Complete the free assessment at calledtocarry.awakeningdestiny.global/assessment if you have not yet.
                </p>
              </div>

              <div>
                <label style={labelStyle}>Leadership Stage *</label>
                <select required value={form.leadership_stage} onChange={update('leadership_stage')} style={inputStyle}>
                  <option value="">Select your stage</option>
                  <option value="emerging">Emerging — sensing the call, early formation</option>
                  <option value="developing">Developing — building, learning to lead</option>
                  <option value="established">Established — leading others, building teams</option>
                  <option value="executive">Executive — organizational or movement leadership</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>What Are You Building or Leading? *</label>
                <textarea required value={form.business_or_ministry} onChange={update('business_or_ministry')} rows={3}
                  placeholder="Describe your ministry, business, or assignment..."
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} />
              </div>

              <div>
                <label style={labelStyle}>Why Now? *</label>
                <textarea required value={form.why_now} onChange={update('why_now')} rows={4}
                  placeholder="What makes this the right season for this kind of formation work?"
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} />
              </div>

              {/* Commitment checkbox */}
              <div style={{ padding: '16px', background: '#F0F9FF', borderRadius: 10, border: '1px solid #BAE6FD' }}>
                <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.commitment_confirmed} onChange={update('commitment_confirmed')}
                    style={{ marginTop: 3, flexShrink: 0, width: 16, height: 16 }} />
                  <span style={{ fontSize: '0.9rem', color: '#0369A1', lineHeight: 1.5 }}>
                    I understand this is an application. Upon approval I commit to showing up fully to all 6 cohort sessions and completing the formation work.
                  </span>
                </label>
              </div>

              {error && (
                <p style={{ color: '#DC2626', fontSize: '0.88rem', margin: 0, padding: '10px 14px', background: '#FEE2E2', borderRadius: 8 }}>
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading}
                style={{ background: NAVY, color: GOLD, border: 'none', padding: '18px', borderRadius: 8, fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 8 }}>
                {loading ? 'Submitting...' : 'Submit Application — $497'}
              </button>

              <p style={{ color: '#94a3b8', fontSize: '0.78rem', textAlign: 'center', margin: 0 }}>
                Secure checkout via Stripe. Applications reviewed within 48 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}