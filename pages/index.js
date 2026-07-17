import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed');
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top left, rgba(34,243,255,0.24), transparent 28%), radial-gradient(circle at top right, rgba(255,77,166,0.22), transparent 30%), linear-gradient(145deg, #1E293B 0%, #0F172A 48%, #020617 100%)',
      color: '#F8FAFC',
      fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      padding: '40px 22px'
    }}>
      <main style={{maxWidth: 1120, margin: '0 auto'}}>
        <section style={{padding: '56px 0 32px'}}>
          <p style={{color:'#22F3FF', letterSpacing: '0.16em', textTransform:'uppercase', fontSize:12, fontWeight:700}}>SkyGrid Protocol by Aura-Core™</p>
          <h1 style={{fontSize:'clamp(42px, 8vw, 92px)', lineHeight:0.92, margin:'16px 0', letterSpacing:'-0.06em'}}>
            Infrastructure of Tomorrow.<br />Ownership Forever.
          </h1>
          <p style={{fontSize:20, color:'#CBD5E1', maxWidth:760, lineHeight:1.6}}>
            A brighter decentralized intelligence network for validated nodes, live metrics, energy-aware compute, and reliable data operations.
          </p>
          <div style={{display:'flex', gap:12, flexWrap:'wrap', marginTop:30}}>
            <a href="#dashboard" style={{background:'linear-gradient(135deg,#22F3FF,#FF4DA6)', color:'#020617', padding:'13px 18px', borderRadius:14, textDecoration:'none', fontWeight:800}}>View Live Dashboard</a>
            <a href="#join" style={{border:'1px solid rgba(248,250,252,0.22)', color:'#F8FAFC', padding:'13px 18px', borderRadius:14, textDecoration:'none', fontWeight:700}}>Join the List</a>
          </div>
        </section>

        <section style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, margin:'28px 0'}}>
          {[
            ['Nodes', '1,284', 'distributed signal capacity'],
            ['Confidence', '0.87', 'multi-source validation'],
            ['Regions', '12', 'active operating zones'],
            ['Reliability', '99.9%', 'target uptime posture']
          ].map(([label, value, detail]) => (
            <div key={label} style={{background:'rgba(30,41,59,0.72)', border:'1px solid rgba(34,243,255,0.16)', borderRadius:22, padding:22, boxShadow:'0 0 28px rgba(34,243,255,0.08)'}}>
              <p style={{margin:0, color:'#94A3B8', fontSize:13}}>{label}</p>
              <strong style={{display:'block', fontSize:32, color: label === 'Reliability' ? '#FF4DA6' : '#22F3FF', marginTop:8}}>{value}</strong>
              <p style={{margin:'8px 0 0', color:'#CBD5E1'}}>{detail}</p>
            </div>
          ))}
        </section>

        <section id="join" style={{margin:'38px 0', background:'rgba(15,23,42,0.72)', border:'1px solid rgba(255,77,166,0.20)', borderRadius:24, padding:24}}>
          <h2 style={{marginTop:0}}>Join SkyGrid updates</h2>
          <p style={{color:'#CBD5E1'}}>Reliable signup with backend validation and Airtable-ready storage.</p>
          <form onSubmit={submit} style={{display:'flex', gap:10, flexWrap:'wrap'}}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{padding:'13px 14px', borderRadius:14, minWidth:280, border:'1px solid rgba(148,163,184,0.35)', background:'#F8FAFC', color:'#020617'}}
            />
            <button type="submit" style={{padding:'13px 18px', borderRadius:14, border:0, background:'linear-gradient(135deg,#22F3FF,#FF4DA6)', color:'#020617', fontWeight:800}}>
              {status === 'loading' ? 'Adding…' : 'Join SkyGrid'}
            </button>
          </form>
          {status === 'success' && <p style={{color:'#22F3FF'}}>Added successfully. Welcome to the SkyGrid list.</p>}
          {status === 'error' && <p style={{color:'#FF4DA6'}}>Signup is temporarily unavailable. Please try again in a moment.</p>}
        </section>

        <section id="dashboard" style={{margin:'38px 0'}}>
          <h2>Live Command Dashboard</h2>
          <div style={{border:'1px solid rgba(34,243,255,0.18)', borderRadius:24, overflow:'hidden', background:'rgba(2,6,23,0.72)', minHeight:620}}>
            <iframe
              src="https://dune.com/embeds/YOUR_QUERY_ID"
              width="100%"
              height="600"
              style={{border:'none'}}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
