const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { email, name = '', source = 'skygrid-site' } = req.body || {};

  if (!email || !emailRegex.test(String(email).trim())) {
    return res.status(400).json({ ok: false, error: 'Valid email required' });
  }

  const record = {
    email: String(email).trim().toLowerCase(),
    name: String(name).trim(),
    source,
    createdAt: new Date().toISOString(),
  };

  // Airtable-backed mode. Configure these secrets in Vercel/AWS/GitHub Actions.
  if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
    const table = encodeURIComponent(process.env.AIRTABLE_EMAIL_TABLE || 'Email List');
    const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${table}`;

    const airtableRes = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Email: record.email,
              Name: record.name,
              Source: record.source,
              CreatedAt: record.createdAt,
            },
          },
        ],
      }),
    });

    if (!airtableRes.ok) {
      const detail = await airtableRes.text();
      console.error('Airtable signup failed:', detail);
      return res.status(502).json({
        ok: false,
        error: 'Signup storage temporarily unavailable',
      });
    }
  } else {
    // Safe fallback: do not fail public signup when Airtable is not configured.
    console.log('SkyGrid signup fallback:', record);
  }

  return res.status(200).json({ ok: true, message: 'You are on the SkyGrid list.' });
}
