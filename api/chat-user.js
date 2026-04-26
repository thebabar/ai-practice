import { streamAnthropic } from './_lib/anthropic-stream.js'

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = (req.headers['x-api-key'] || '').toString().trim()
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing x-api-key header' })
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body
  const messages = body?.messages
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Missing messages' })
  }

  await streamAnthropic(
    {
      apiKey,
      model: 'claude-haiku-4-5-20251001',
      messages,
      systemPrompt: typeof body?.systemPrompt === 'string' ? body.systemPrompt : undefined,
      maxTokens: typeof body?.maxTokens === 'number' ? body.maxTokens : 1024,
    },
    res,
  )
}

function safeParse(s) {
  try { return JSON.parse(s) } catch { return null }
}
