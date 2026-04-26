// Shared helper: stream a Claude response back to the client as simplified SSE.
// Forwards only text deltas as `data: {"text":"..."}\n\n`, ending with `data: [DONE]\n\n`.
// On upstream error, emits `data: {"error":"..."}\n\n` and ends.

export async function streamAnthropic({ apiKey, model, messages, systemPrompt, maxTokens = 1024 }, res) {
  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      stream: true,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages,
    }),
  })

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  if (typeof res.flushHeaders === 'function') res.flushHeaders()

  if (!upstream.ok || !upstream.body) {
    let detail = `Anthropic error ${upstream.status}`
    try {
      const data = await upstream.json()
      if (data?.error?.message) detail = data.error.message
    } catch {
      // ignore
    }
    res.write(`data: ${JSON.stringify({ error: detail, status: upstream.status })}\n\n`)
    res.write('data: [DONE]\n\n')
    res.end()
    return
  }

  const reader = upstream.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split('\n\n')
      buffer = events.pop() ?? ''
      for (const evt of events) {
        const dataLine = evt.split('\n').find((l) => l.startsWith('data: '))
        if (!dataLine) continue
        const payload = dataLine.slice(6)
        if (!payload || payload === '[DONE]') continue
        try {
          const obj = JSON.parse(payload)
          if (obj.type === 'content_block_delta' && obj.delta?.type === 'text_delta') {
            res.write(`data: ${JSON.stringify({ text: obj.delta.text })}\n\n`)
          } else if (obj.type === 'message_stop') {
            // handled by [DONE] below
          }
        } catch {
          // skip malformed event
        }
      }
    }
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`)
  }

  res.write('data: [DONE]\n\n')
  res.end()
}
