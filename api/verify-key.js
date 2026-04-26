export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ valid: false, error: 'Method not allowed' })
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body
  const key = body && typeof body.key === 'string' ? body.key.trim() : ''

  if (!key) {
    return res.status(400).json({ valid: false, error: 'Missing key' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'hi' }],
      }),
    })

    if (response.ok) {
      return res.status(200).json({ valid: true })
    }

    let detail
    try {
      const data = await response.json()
      detail = data?.error?.message
    } catch {
      // ignore
    }
    return res.status(200).json({ valid: false, status: response.status, error: detail })
  } catch (err) {
    return res.status(200).json({ valid: false, error: 'Network error reaching Anthropic' })
  }
}

function safeParse(s) {
  try { return JSON.parse(s) } catch { return null }
}
