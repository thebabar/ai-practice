import { verifyToken } from '@clerk/backend'
import { streamAnthropic } from './_lib/anthropic-stream.js'

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = (req.headers['authorization'] || '').toString()
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization Bearer token' })
  }

  const secretKey = process.env.CLERK_SECRET_KEY
  if (!secretKey) {
    return res.status(500).json({ error: 'Server missing CLERK_SECRET_KEY' })
  }

  try {
    await verifyToken(token, { secretKey })
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token' })
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY
  if (!anthropicKey) {
    return res.status(500).json({ error: 'Server missing ANTHROPIC_API_KEY' })
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body
  const messages = body?.messages
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Missing messages' })
  }

  await streamAnthropic(
    {
      apiKey: anthropicKey,
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
