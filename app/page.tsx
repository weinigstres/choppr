export default function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: 'bold' }}>Choppr</h1>
      <p style={{ fontSize: '20px', marginBottom: '40px', color: '#666' }}>
        IT Governance & Operating Model Platform
      </p>

      <div style={{ marginBottom: '30px', padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px', marginTop: 0 }}>Quick Links</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <a href="/login" style={{ color: '#0070f3', textDecoration: 'none', fontSize: '18px' }}>
              → Login / Sign Up
            </a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href="/app" style={{ color: '#0070f3', textDecoration: 'none', fontSize: '18px' }}>
              → Dashboard
            </a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href="/app/canvas" style={{ color: '#0070f3', textDecoration: 'none', fontSize: '18px' }}>
              → Operating Model Canvas
            </a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href="/onboarding" style={{ color: '#0070f3', textDecoration: 'none', fontSize: '18px' }}>
              → Onboarding
            </a>
          </li>
        </ul>
      </div>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0, fontSize: '20px' }}>✓ Status: Application Ready</h3>
        <p style={{ margin: 0, color: '#666' }}>The application is running and connected to Supabase.</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>About Choppr</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#444' }}>
          Choppr is the definitive IT governance and operating-model platform. It provides a holistic,
          data-driven model of "the business of IT," uniting industry best-practices into one interactive system.
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#444', marginTop: '10px' }}>
          Based on IT4IT™ reference architecture, combined with COBIT's governance principles and
          ITIL 4's service-management practices.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '18px', marginTop: 0, marginBottom: '10px' }}>Value Streams</h3>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            Interactive visualization of IT value chains
          </p>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '18px', marginTop: 0, marginBottom: '10px' }}>Profile-Driven</h3>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            Adapt your IT operating model based on your enterprise profile
          </p>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '18px', marginTop: 0, marginBottom: '10px' }}>Risk & Controls</h3>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            Built-in library of IT controls from ISO 27001, ITGC, DORA
          </p>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '18px', marginTop: 0, marginBottom: '10px' }}>Governance Bodies</h3>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            Map organizational committees and approval workflows
          </p>
        </div>
      </div>
    </div>
  );
}
