import { useRouter } from 'next/router';
import Head from 'next/head';

const C = {
  navy: '#021A35',
  blue: '#0172BC',
  sky: '#00AEEF',
  gold: '#FDD20D',
  orange: '#F47722',
  cream: '#FDF8F0',
};

const SANS = "'Outfit', sans-serif";
const FONTS = "'Cormorant Garamond', Georgia, serif";

export default function Home() {
  const router = useRouter();

  const modules = [
    { id: 'calling', name: 'Calling', number: 1, tagline: 'Unearth your God-given identity, burden, and mandate.', available: true },
    { id: 'connection', name: 'Connection', number: 2, tagline: 'Build the relational foundation of Kingdom leadership.', available: false },
    { id: 'competency', name: 'Competency', number: 3, tagline: 'Develop the skills and disciplines your calling requires.', available: false },
    { id: 'capacity', name: 'Capacity', number: 4, tagline: 'Expand your ability to carry the weight of greater influence.', available: false },
    { id: 'convergence', name: 'Convergence', number: 5, tagline: 'Step into the fullness of your assignment.', available: false },
  ];

  return (
    <>
      <Head>
        <title>5C Leadership Blueprint | Awakening Destiny Global</title>
        <meta name="description" content="A five-module interactive leadership training for Kingdom entrepreneurs, pastors, and prophetic voices." />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: C.cream, fontFamily: SANS }}>

        {/* Header */}
        <div style={{ background: C.navy, padding: '16px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' }}>Awakening Destiny Global</div>
              <div style={{ color: '#fff', fontSize: 18, fontFamily: FONTS, fontWeight: 600, marginTop: 2 }}>5C Leadership Blueprint</div>
            </div>
            <a href="https://awakeningdestiny.global" target="_blank" rel="noopener noreferrer"
              style={{ color: C.gold, fontSize: 12, fontFamily: SANS, fontWeight: 600, textDecoration: 'none', border: '1px solid ' + C.gold + '40', padding: '6px 14px', borderRadius: 6 }}>
              Visit Site →
            </a>
          </div>
        </div>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(160deg, ' + C.navy + ' 0%, #0a2a4a 60%, ' + C.blue + '40 100%)', padding: '60px 24px 70px', textAlign: 'center' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ display: 'inline-block', background: C.gold + '22', border: '1px solid ' + C.gold + '40', color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', padding: '6px 16px', borderRadius: 4, marginBottom: 24, fontFamily: SANS }}>
              Interactive Training Platform
            </div>
            <h1 style={{ fontFamily: FONTS, fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
              Lead from <em>Calling</em>,<br />Not Just Capacity.
            </h1>
            <p style={{ fontFamily: FONTS, fontSize: 18, color: '#ffffffbb', lineHeight: 1.75, marginBottom: 36 }}>
              Five modules. Five dimensions of Kingdom leadership. One integrated framework
              to help you discover your mandate, build your community, and step into convergence.
            </p>
            <button
              onClick={() => router.push('/modules/calling')}
              style={{ background: C.gold, color: C.navy, border: 'none', padding: '15px 36px', borderRadius: 8, fontSize: 16, fontWeight: 700, fontFamily: SANS, cursor: 'pointer', boxShadow: '0 4px 24px ' + C.gold + '40', letterSpacing: 0.5 }}>
              Begin Module 1: Calling →
            </button>
          </div>
        </div>

        {/* Modules Grid */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
          <h2 style={{ fontFamily: FONTS, fontSize: 34, fontWeight: 700, color: C.navy, textAlign: 'center', marginBottom: 8 }}>The Five Pillars</h2>
          <p style={{ textAlign: 'center', fontFamily: FONTS, fontSize: 16, color: C.navy + '70', marginBottom: 40 }}>Each module builds on the last. Work through them in order.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {modules.map((mod) => (
              <div key={mod.id}
                onClick={() => mod.available && router.push('/modules/' + mod.id)}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '24px',
                  border: '1.5px solid ' + (mod.available ? C.gold + '40' : C.navy + '12'),
                  cursor: mod.available ? 'pointer' : 'default',
                  opacity: mod.available ? 1 : 0.6,
                  transition: 'transform .2s, box-shadow .2s',
                  boxShadow: '0 2px 12px rgba(0,0,0,.06)',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ background: mod.available ? C.navy : C.navy + '30', color: mod.available ? C.gold : '#fff', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 16 }}>
                    {mod.number}
                  </div>
                  {mod.available
                    ? <span style={{ background: C.gold + '20', color: C.orange, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 4, fontFamily: SANS }}>Available</span>
                    : <span style={{ background: C.navy + '10', color: C.navy + '50', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 4, fontFamily: SANS }}>Coming Soon</span>
                  }
                </div>
                <h3 style={{ fontFamily: FONTS, fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{mod.name}</h3>
                <p style={{ fontFamily: FONTS, fontSize: 14.5, color: C.navy + '80', lineHeight: 1.6 }}>{mod.tagline}</p>
                {mod.available && (
                  <div style={{ marginTop: 16, color: C.blue, fontSize: 13, fontWeight: 600, fontFamily: SANS }}>Start Module →</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: C.navy, padding: '20px 24px', textAlign: 'center' }}>
          <p style={{ color: '#ffffff40', fontSize: 11, fontFamily: SANS }}>
            © {new Date().getFullYear()} Awakening Destiny Global. All rights reserved. |{' '}
            <a href="https://awakeningdestiny.global" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff40', textDecoration: 'underline' }}>
              awakeningdestiny.global
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
