export default function Home() {
  return (
    <div style={{padding:20, background:'#0F172A', color:'#F8FAFC'}}>
      <h1 style={{color:'#22F3FF'}}>SkyGrid Live Dashboard</h1>
      <iframe
        src="https://dune.com/embeds/YOUR_QUERY_ID"
        width="100%"
        height="600"
        style={{border:'none', marginTop:20}}
      />
    </div>
  );
}
