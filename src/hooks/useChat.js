import { useCallback, useRef, useState } from 'react'
import { useAuth as useClerkAuth } from '@clerk/clerk-react'
import { useApiKey } from './useApiKey.js'

const CLERK_ENABLED = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

function useGetClerkTokenEnabled() {
  const { getToken } = useClerkAuth()
  return getToken
}
function useGetClerkTokenDisabled() {
  return async () => null
}
const useGetClerkToken = CLERK_ENABLED ? useGetClerkTokenEnabled : useGetClerkTokenDisabled

export function useChat({ tier = 'user', systemPrompt } = {}) {
  const { key } = useApiKey()
  const getToken = useGetClerkToken()

  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const sendMessage = useCallback(async (content) => {
    if (isStreaming) return
    setError(null)

    const userMsg = { role: 'user', content }
    const history = [...messages, userMsg]
    setMessages([...history, { role: 'assistant', content: '' }])
    setIsStreaming(true)

    const finishWithError = (msg) => {
      setError(msg)
      setMessages((prev) => prev.slice(0, -1))
      setIsStreaming(false)
    }

    const headers = { 'content-type': 'application/json' }
    let endpoint
    if (tier === 'pro') {
      if (!CLERK_ENABLED) {
        finishWithError('Pro tier requires Clerk to be configured')
        return
      }
      const token = await getToken()
      if (!token) {
        finishWithError('Sign in to use the pro tier')
        return
      }
      headers['authorization'] = `Bearer ${token}`
      endpoint = '/api/chat-pro'
    } else {
      if (!key) {
        finishWithError('Set your Anthropic API key first')
        return
      }
      headers['x-api-key'] = key
      endpoint = '/api/chat-user'
    }

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ messages: history, systemPrompt }),
        signal: controller.signal,
      })

      if (!res.ok) {
        let detail = `HTTP ${res.status}`
        try {
          const data = await res.json()
          if (data?.error) detail = data.error
        } catch {
          // ignore
        }
        finishWithError(detail)
        return
      }

      if (!res.body) {
        finishWithError('No response body')
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let assembled = ''
      let streamError = null

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
            if (typeof obj.text === 'string') {
              assembled += obj.text
              setMessages((prev) => {
                const copy = prev.slice()
                copy[copy.length - 1] = { role: 'assistant', content: assembled }
                return copy
              })
            } else if (obj.error) {
              streamError = obj.error
            }
          } catch {
            // skip malformed
          }
        }
      }

      if (streamError) {
        setError(streamError)
      }
    } catch (e) {
      if (e.name !== 'AbortError') setError(e.message || 'Request failed')
    } finally {
      abortRef.current = null
      setIsStreaming(false)
    }
  }, [messages, isStreaming, tier, key, getToken, systemPrompt])

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
    setIsStreaming(false)
  }, [])

  return { messages, isStreaming, error, sendMessage, stop, reset }
}
