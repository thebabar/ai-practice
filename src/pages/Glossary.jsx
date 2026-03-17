import { useState } from 'react'
import NavBar from '../components/NavBar.jsx'

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

.gl-root { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'IBM Plex Sans', sans-serif; overflow-x: hidden; }
.gl-hero { text-align: center; padding: 48px 24px 28px; position: relative; }
.gl-hero::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 700px; height: 320px; background: radial-gradient(ellipse at 50% 0%, rgba(148,163,184,0.07) 0%, transparent 70%); pointer-events: none; }
.gl-eyebrow { font-size: 16px; letter-spacing: 0.22em; color: #94a3b8; text-transform: uppercase; margin-bottom: 14px; font-family: 'IBM Plex Mono', monospace; }
.gl-title { font-family: 'IBM Plex Sans', sans-serif; font-size: clamp(32px, 5vw, 52px); font-weight: 800; color: #fff; margin-bottom: 12px; letter-spacing: -0.02em; }
.gl-subtitle { font-size: 16px; color: #7a9bbf; max-width: 480px; margin: 0 auto 32px; line-height: 1.7; }

.gl-controls { max-width: 920px; margin: 0 auto; padding: 0 20px 24px; }
.gl-search { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid #1e3048; border-radius: 10px; padding: 13px 18px; color: #e0e8f0; font-family: 'IBM Plex Mono', monospace; font-size: 14px; outline: none; transition: border-color 0.18s; box-sizing: border-box; margin-bottom: 16px; }
.gl-search:focus { border-color: rgba(148,163,184,0.5); }
.gl-search::placeholder { color: #3a5a7a; }
.gl-cats { display: flex; gap: 8px; flex-wrap: wrap; }
.gl-cat { background: transparent; border: 1px solid #1e3048; color: #7a9bbf; font-family: 'IBM Plex Mono', monospace; font-size: 12px; padding: 5px 14px; border-radius: 100px; cursor: pointer; transition: all 0.18s; letter-spacing: 0.08em; text-transform: uppercase; }
.gl-cat:hover { border-color: #94a3b8; color: #94a3b8; }
.gl-cat.active { background: rgba(148,163,184,0.12); border-color: #94a3b8; color: #94a3b8; }

.gl-count { max-width: 920px; margin: 0 auto; padding: 0 20px 20px; font-size: 13px; color: #3a5a7a; font-family: 'IBM Plex Mono', monospace; }

.gl-grid { max-width: 920px; margin: 0 auto; padding: 0 20px 80px; display: grid; grid-template-columns: 1fr; gap: 12px; }
.gl-card { background: rgba(255,255,255,0.02); border: 1px solid #1e3048; border-radius: 14px; padding: 20px 24px; transition: border-color 0.18s; }
.gl-card:hover { border-color: #2a4a6a; }
.gl-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 10px; flex-wrap: wrap; }
.gl-term-name { font-family: 'IBM Plex Sans', sans-serif; font-size: 17px; font-weight: 700; color: #fff; line-height: 1.3; }
.gl-cat-badge { font-size: 11px; font-family: 'IBM Plex Mono', monospace; padding: 3px 10px; border-radius: 100px; border: 1px solid; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
.gl-definition { font-size: 14px; color: #7a9bbf; line-height: 1.75; margin-bottom: 8px; }
.gl-example { font-size: 13px; color: #4a7a8a; font-style: italic; margin-bottom: 10px; line-height: 1.6; }
.gl-see-in { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.gl-see-in-label { font-size: 12px; color: #3a5a7a; font-family: 'IBM Plex Mono', monospace; }
.gl-see-in-link { font-size: 12px; font-family: 'IBM Plex Mono', monospace; color: #94a3b8; text-decoration: none; border-bottom: 1px solid rgba(148,163,184,0.3); transition: color 0.15s; }
.gl-see-in-link:hover { color: #c0d0e0; border-bottom-color: #c0d0e0; }

.gl-empty { max-width: 920px; margin: 0 auto; padding: 60px 20px; text-align: center; color: #3a5a7a; font-family: 'IBM Plex Mono', monospace; font-size: 14px; }
`

const CAT_COLORS = {
  Foundations: { color: '#a78bfa', border: 'rgba(167,139,250,0.35)', bg: 'rgba(167,139,250,0.08)' },
  Tokens:      { color: '#38bdf8', border: 'rgba(56,189,248,0.35)',   bg: 'rgba(56,189,248,0.08)' },
  Sampling:    { color: '#ec4899', border: 'rgba(236,72,153,0.35)',   bg: 'rgba(236,72,153,0.08)' },
  Agents:      { color: '#34d399', border: 'rgba(52,211,153,0.35)',   bg: 'rgba(52,211,153,0.08)' },
  Embeddings:  { color: '#f97316', border: 'rgba(249,115,22,0.35)',   bg: 'rgba(249,115,22,0.08)' },
  RAG:         { color: '#06b6d4', border: 'rgba(6,182,212,0.35)',    bg: 'rgba(6,182,212,0.08)' },
}

const TERMS = [
  // Foundations
  { id: 0, term: 'Large Language Model (LLM)', category: 'Foundations', definition: 'A neural network trained on vast amounts of text to predict the next token. Through this simple objective, it learns grammar, facts, reasoning, and much more.', example: 'GPT-4, Claude, Gemini are all LLMs.', seeIn: [{ label: 'Introduction to LLMs', path: '/intro-llms' }] },
  { id: 1, term: 'Neural Network', category: 'Foundations', definition: 'A computational system composed of layers of interconnected nodes (neurons) that transform inputs into outputs by adjusting millions of learned weights.', example: null, seeIn: [{ label: 'Introduction to LLMs', path: '/intro-llms' }] },
  { id: 2, term: 'Parameters', category: 'Foundations', definition: 'The numerical weights inside a neural network that are adjusted during training. More parameters generally means greater capacity to learn. GPT-4 has an estimated ~1.8 trillion parameters.', example: null, seeIn: [{ label: 'Introduction to LLMs', path: '/intro-llms' }] },
  { id: 3, term: 'Pre-training', category: 'Foundations', definition: 'The initial phase of training an LLM on massive unlabeled text from the internet, books, and code. The objective is to predict the next token. The result is broad general world knowledge.', example: null, seeIn: [{ label: 'Introduction to LLMs', path: '/intro-llms' }] },
  { id: 4, term: 'Fine-tuning', category: 'Foundations', definition: 'Continued training of a pre-trained model on a smaller, curated dataset to adjust its behavior — e.g., to follow instructions, adopt a tone, or specialize in a domain.', example: null, seeIn: [{ label: 'Introduction to LLMs', path: '/intro-llms' }, { label: 'RAG vs Fine-Tuning', path: '/rag' }] },
  { id: 5, term: 'RLHF', category: 'Foundations', definition: 'Reinforcement Learning from Human Feedback. A fine-tuning technique where human raters rank model outputs and a reward model trains the LLM to produce responses humans prefer.', example: null, seeIn: [{ label: 'Introduction to LLMs', path: '/intro-llms' }] },
  { id: 6, term: 'Transformer', category: 'Foundations', definition: 'The neural network architecture underlying most modern LLMs. It uses attention mechanisms to process entire token sequences in parallel rather than one token at a time.', example: null, seeIn: [{ label: 'Introduction to LLMs', path: '/intro-llms' }] },
  { id: 7, term: 'Attention Mechanism', category: 'Foundations', definition: 'A component of the transformer that allows the model to weigh the relevance of every token in the context window when generating each output token. The core innovation behind modern LLMs.', example: null, seeIn: [{ label: 'Introduction to LLMs', path: '/intro-llms' }] },
  { id: 8, term: 'Emergent Abilities', category: 'Foundations', definition: 'Capabilities that appear suddenly at certain model scales rather than improving gradually — such as multi-step reasoning or code generation. They arise when the model is large enough to have internalized all required sub-skills simultaneously.', example: null, seeIn: [{ label: 'Introduction to LLMs', path: '/intro-llms' }] },
  { id: 9, term: 'Hallucination', category: 'Foundations', definition: 'When an LLM confidently generates false information. Caused by the model predicting plausible-sounding text rather than retrieving verified facts. The model has no internal truth checker.', example: 'An LLM fabricating a citation that does not exist.', seeIn: [{ label: 'Introduction to LLMs', path: '/intro-llms' }, { label: 'RAG', path: '/rag' }] },
  { id: 10, term: 'Knowledge Cutoff', category: 'Foundations', definition: "The date after which an LLM has no training data. Events, papers, or changes after this date are unknown to the model — it may hallucinate answers about them.", example: null, seeIn: [{ label: 'Introduction to LLMs', path: '/intro-llms' }, { label: 'RAG', path: '/rag' }] },
  { id: 11, term: 'Inference', category: 'Foundations', definition: 'Running a trained model to generate outputs from a prompt. Distinct from training, which updates model weights. Inference cost is paid per API call.', example: null, seeIn: [{ label: 'Introduction to LLMs', path: '/intro-llms' }] },
  { id: 12, term: 'Context Window', category: 'Foundations', definition: 'The maximum number of tokens an LLM can process in a single call (input + output combined). Everything outside this window is invisible to the model.', example: 'Claude has a 200K token context window — about 150,000 words.', seeIn: [{ label: 'Introduction to LLMs', path: '/intro-llms' }, { label: 'Token Optimization', path: '/token-optimization' }] },
  { id: 13, term: 'System Prompt', category: 'Foundations', definition: 'Instructions given to the LLM at the start of a conversation to define its behavior, tone, persona, and constraints. Processed before the user message.', example: '"You are a helpful assistant that only answers questions about cooking."', seeIn: [{ label: 'Introduction to LLMs', path: '/intro-llms' }, { label: 'Token Optimization', path: '/token-optimization' }] },
  { id: 14, term: 'Chain-of-Thought (CoT)', category: 'Foundations', definition: 'A prompting technique where the model is asked to reason step-by-step before giving a final answer. Significantly improves accuracy on math, logic, and multi-step tasks.', example: '"Think step by step before answering."', seeIn: [{ label: 'Agents & Tools', path: '/agents-tools' }] },

  // Tokens
  { id: 15, term: 'Token', category: 'Tokens', definition: 'The basic unit of text an LLM processes. Roughly 1 token ≈ ¾ of a word in English. Tokens can be whole words, subwords, punctuation, or spaces.', example: '"unhappiness" → ["un", "happi", "ness"] — 3 tokens.', seeIn: [{ label: 'Token Optimization', path: '/token-optimization' }, { label: 'Introduction to LLMs', path: '/intro-llms' }] },
  { id: 16, term: 'Tokenization', category: 'Tokens', definition: 'The process of converting raw text into a sequence of token IDs before feeding it to an LLM. Different models use different tokenizers.', example: null, seeIn: [{ label: 'Token Optimization', path: '/token-optimization' }] },
  { id: 17, term: 'Byte Pair Encoding (BPE)', category: 'Tokens', definition: 'The most common tokenization algorithm. Starts with individual characters, then iteratively merges the most frequent adjacent pairs to build a vocabulary of subword tokens.', example: null, seeIn: [{ label: 'Token Optimization', path: '/token-optimization' }] },
  { id: 18, term: 'Vocabulary', category: 'Tokens', definition: 'The fixed set of all possible tokens a model can recognize and generate. Typically 50,000–100,000 tokens. Words outside the vocabulary are split into subword tokens.', example: null, seeIn: [{ label: 'Token Optimization', path: '/token-optimization' }] },
  { id: 19, term: 'Prompt', category: 'Tokens', definition: 'The full input text sent to an LLM, including the system prompt, conversation history, retrieved context, and the current user message.', example: null, seeIn: [{ label: 'Token Optimization', path: '/token-optimization' }, { label: 'RAG', path: '/rag' }] },
  { id: 20, term: 'KV Cache', category: 'Tokens', definition: 'A performance optimization that stores the computed key-value attention states for tokens already processed. Avoids recomputing attention for the entire context on every new token generated.', example: null, seeIn: [{ label: 'Token Optimization', path: '/token-optimization' }] },

  // Sampling
  { id: 21, term: 'Temperature', category: 'Sampling', definition: 'A parameter (typically 0–2) controlling randomness in token sampling. 0 = always pick the most likely token (deterministic). Higher values = more varied, creative, or unpredictable output.', example: 'Temperature 0 for factual Q&A; 1.2 for creative writing.', seeIn: [{ label: 'Temperature & Sampling', path: '/temperature-sampling' }] },
  { id: 22, term: 'Top-p (Nucleus Sampling)', category: 'Sampling', definition: 'Samples from the smallest set of tokens whose cumulative probability exceeds p. More adaptive than top-k because it adjusts the candidate pool size based on the probability distribution.', example: 'top_p=0.9 uses only the tokens that together make up 90% of the probability mass.', seeIn: [{ label: 'Temperature & Sampling', path: '/temperature-sampling' }] },
  { id: 23, term: 'Top-k', category: 'Sampling', definition: 'Limits token sampling to the k most probable next tokens, ignoring all others. A simpler but less adaptive alternative to top-p.', example: 'top_k=50 considers only the 50 most likely next tokens.', seeIn: [{ label: 'Temperature & Sampling', path: '/temperature-sampling' }] },
  { id: 24, term: 'Greedy Decoding', category: 'Sampling', definition: 'Always selects the single most probable next token at each step. Fully deterministic but can produce repetitive or locally optimal but globally suboptimal text. Equivalent to temperature=0.', example: null, seeIn: [{ label: 'Temperature & Sampling', path: '/temperature-sampling' }] },
  { id: 25, term: 'Logits', category: 'Sampling', definition: 'The raw, unnormalized scores output by the model for each token in the vocabulary before softmax converts them to probabilities. Temperature is applied by dividing logits before softmax.', example: null, seeIn: [{ label: 'Temperature & Sampling', path: '/temperature-sampling' }] },
  { id: 26, term: 'Softmax', category: 'Sampling', definition: 'A mathematical function that converts a vector of logits into a probability distribution that sums to 1. Each value represents the probability of the corresponding token being selected next.', example: null, seeIn: [{ label: 'Temperature & Sampling', path: '/temperature-sampling' }] },
  { id: 27, term: 'Beam Search', category: 'Sampling', definition: 'A decoding strategy that maintains multiple candidate sequences (beams) simultaneously, selecting the overall most probable complete sequence rather than the best token at each individual step.', example: null, seeIn: [{ label: 'Temperature & Sampling', path: '/temperature-sampling' }] },

  // Agents
  { id: 28, term: 'AI Agent', category: 'Agents', definition: 'An LLM that can take actions, use tools, observe results, and iterate toward a goal over multiple steps — rather than just answering a single question in one pass.', example: 'An agent that searches the web, writes code, executes it, and fixes bugs autonomously.', seeIn: [{ label: 'Agents & Tools', path: '/agents-tools' }] },
  { id: 29, term: 'Tool Use / Function Calling', category: 'Agents', definition: "The ability for an LLM to invoke external functions or APIs (search, calculator, database, code interpreter) and incorporate the returned results into its response.", example: null, seeIn: [{ label: 'Agents & Tools', path: '/agents-tools' }] },
  { id: 30, term: 'ReAct Pattern', category: 'Agents', definition: 'A prompting pattern where the model alternates Reasoning steps ("Thought:") and Action steps ("Action:"), making its planning process explicit and observable before each tool call.', example: null, seeIn: [{ label: 'Agents & Tools', path: '/agents-tools' }] },
  { id: 31, term: 'Orchestration', category: 'Agents', definition: 'Managing the sequence of LLM calls, tool uses, and data retrievals in an agentic pipeline. The orchestrator decides what happens next based on intermediate results.', example: null, seeIn: [{ label: 'Agents & Tools', path: '/agents-tools' }] },
  { id: 32, term: 'Multi-agent System', category: 'Agents', definition: 'Multiple AI agents collaborating on a task, each specializing in a subtask (researcher, coder, reviewer), coordinated by an orchestrator agent.', example: null, seeIn: [{ label: 'Agents & Tools', path: '/agents-tools' }] },
  { id: 33, term: 'Agentic Loop', category: 'Agents', definition: 'The iterative cycle an AI agent runs: observe state → reason → select action → execute tool → observe result → repeat until goal is reached or limit hit.', example: null, seeIn: [{ label: 'Agents & Tools', path: '/agents-tools' }] },

  // Embeddings
  { id: 34, term: 'Embedding', category: 'Embeddings', definition: 'A dense numerical vector that represents the meaning of a piece of text. Semantically similar texts have vectors that are geometrically close together in the embedding space.', example: '"cat" and "kitten" have embeddings closer together than "cat" and "democracy".', seeIn: [{ label: 'Vector Embeddings', path: '/vector-embeddings' }] },
  { id: 35, term: 'Vector', category: 'Embeddings', definition: 'An ordered list of numbers representing a point in high-dimensional space. Text embeddings are typically 768–3072 dimensions. Each dimension loosely captures some semantic feature.', example: '[0.82, -0.14, 0.67, 0.31, ...]', seeIn: [{ label: 'Vector Embeddings', path: '/vector-embeddings' }, { label: 'RAG', path: '/rag' }] },
  { id: 36, term: 'Cosine Similarity', category: 'Embeddings', definition: 'A measure of similarity between two vectors based on the cosine of the angle between them. Values range from -1 (opposite) to 1 (identical direction). Used to rank retrieval results.', example: null, seeIn: [{ label: 'Vector Embeddings', path: '/vector-embeddings' }, { label: 'RAG', path: '/rag' }] },
  { id: 37, term: 'Semantic Search', category: 'Embeddings', definition: 'Search based on meaning rather than exact keyword matching. A query is embedded and compared against document embeddings; results are ranked by similarity.', example: '"running shoes" matches "athletic footwear" even without shared keywords.', seeIn: [{ label: 'Vector Embeddings', path: '/vector-embeddings' }, { label: 'RAG', path: '/rag' }] },
  { id: 38, term: 'Vector Database', category: 'Embeddings', definition: 'A database optimized for storing and searching high-dimensional embedding vectors at scale. Supports approximate nearest-neighbor search and metadata filtering.', example: 'Pinecone, Weaviate, Qdrant, pgvector.', seeIn: [{ label: 'Vector Embeddings', path: '/vector-embeddings' }, { label: 'RAG', path: '/rag' }] },
  { id: 39, term: 'Nearest Neighbor Search', category: 'Embeddings', definition: 'Finding the vectors in a database that are geometrically closest to a query vector. Exact search is O(n); approximate methods (HNSW, IVF) trade small accuracy loss for large speed gains.', example: null, seeIn: [{ label: 'Vector Embeddings', path: '/vector-embeddings' }] },
  { id: 40, term: 'Dimensionality', category: 'Embeddings', definition: 'The number of values in an embedding vector. Higher dimensionality can capture more semantic nuance but requires more storage and compute. Common values: 768, 1536, 3072.', example: null, seeIn: [{ label: 'Vector Embeddings', path: '/vector-embeddings' }] },

  // RAG
  { id: 41, term: 'RAG', category: 'RAG', definition: 'Retrieval-Augmented Generation. A technique that retrieves relevant documents from a knowledge base at query time and injects them into the LLM prompt, grounding the response in real sources.', example: null, seeIn: [{ label: 'RAG', path: '/rag' }] },
  { id: 42, term: 'Knowledge Base', category: 'RAG', definition: 'A collection of indexed text documents that a RAG system searches. Can contain PDFs, emails, notes, web pages, transcripts — any text-based content.', example: null, seeIn: [{ label: 'RAG', path: '/rag' }] },
  { id: 43, term: 'Chunking', category: 'RAG', definition: 'Splitting documents into smaller pieces before embedding, so each chunk can be independently retrieved. Chunk size affects the precision vs. context tradeoff.', example: 'A 50-page manual split into 200 overlapping 256-token chunks.', seeIn: [{ label: 'RAG', path: '/rag' }] },
  { id: 44, term: 'Chunk Overlap', category: 'RAG', definition: 'Copying the tail of each chunk into the head of the next to prevent context from being severed at chunk boundaries. Typically 10–20% of chunk size.', example: null, seeIn: [{ label: 'RAG', path: '/rag' }] },
  { id: 45, term: 'Reranking', category: 'RAG', definition: 'A second retrieval pass where a more accurate cross-encoder model rescores the initially retrieved chunks for relevance to the query, overriding the original similarity order.', example: null, seeIn: [{ label: 'RAG', path: '/rag' }] },
  { id: 46, term: 'Maximal Marginal Relevance (MMR)', category: 'RAG', definition: 'A retrieval technique that balances relevance to the query with diversity among retrieved chunks. Penalizes chunks that are too similar to already-selected results, reducing redundancy.', example: null, seeIn: [{ label: 'RAG', path: '/rag' }] },
  { id: 47, term: 'Metadata Filtering', category: 'RAG', definition: 'Restricting vector search to a pre-filtered subset of documents based on structured fields (date, author, category) before computing similarity scores.', example: 'Only search documents published in the last 30 days.', seeIn: [{ label: 'RAG', path: '/rag' }] },
  { id: 48, term: 'Embedding Drift', category: 'RAG', definition: 'The problem that occurs when switching to a new embedding model without re-indexing all documents. Query and document vectors are in different spaces and comparisons are meaningless.', example: null, seeIn: [{ label: 'RAG', path: '/rag' }] },
  { id: 49, term: 'Hierarchical Indexing', category: 'RAG', definition: 'Indexing both small chunks (for retrieval precision) and their parent section summaries (for context). When a small chunk matches, the retriever fetches the full parent section as context.', example: null, seeIn: [{ label: 'RAG', path: '/rag' }] },
  { id: 50, term: 'Lost in the Middle', category: 'RAG', definition: "The tendency of LLMs to underweight information placed in the middle of a long context window, performing better on content at the beginning or end. Affects RAG quality when many chunks are retrieved.", example: null, seeIn: [{ label: 'RAG', path: '/rag' }] },
  { id: 51, term: 'Grounding', category: 'RAG', definition: 'Anchoring an LLM response in specific retrieved or provided source material, reducing hallucination by constraining the model to answer from verifiable text.', example: null, seeIn: [{ label: 'RAG', path: '/rag' }] },
  { id: 52, term: 'Vector Index', category: 'RAG', definition: 'The data structure that stores embedded document chunks for fast approximate nearest-neighbor search. Common algorithms: HNSW (graph-based), IVF (cluster-based).', example: null, seeIn: [{ label: 'RAG', path: '/rag' }] },
]

export default function Glossary() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const CATEGORIES = ['All', 'Foundations', 'Tokens', 'Sampling', 'Agents', 'Embeddings', 'RAG']

  const filtered = (() => {
    const q = search.toLowerCase()
    const results = TERMS.filter(t => {
      const matchCat = activeCategory === 'All' || t.category === activeCategory
      const matchSearch = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
    if (!q) return results.sort((a, b) => a.term.localeCompare(b.term))
    // Relevance: exact term match → starts with → term contains → definition only
    const score = t => {
      const term = t.term.toLowerCase()
      if (term === q) return 0
      if (term.startsWith(q)) return 1
      if (term.includes(q)) return 2
      return 3
    }
    return results.sort((a, b) => {
      const diff = score(a) - score(b)
      return diff !== 0 ? diff : a.term.localeCompare(b.term)
    })
  })()

  return (
    <div className="gl-root">
      <style>{css}</style>
      <NavBar />
      <div className="gl-hero">
        <div className="gl-eyebrow">Reference</div>
        <h1 className="gl-title">Glossary</h1>
        <p className="gl-subtitle">Key terms and concepts across all AI Visual Lab topics. Search or filter by category.</p>
      </div>
      <div className="gl-controls">
        <input
          className="gl-search"
          type="text"
          placeholder="Search terms or definitions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="gl-cats">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`gl-cat${activeCategory === c ? ' active' : ''}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="gl-count">Showing {filtered.length} of {TERMS.length} terms</div>
      {filtered.length === 0 ? (
        <div className="gl-empty">No terms match "{search}"</div>
      ) : (
        <div className="gl-grid">
          {filtered.map(t => {
            const cc = CAT_COLORS[t.category]
            return (
              <div key={t.id} className="gl-card">
                <div className="gl-card-top">
                  <div className="gl-term-name">{t.term}</div>
                  <span
                    className="gl-cat-badge"
                    style={{ color: cc.color, borderColor: cc.border, background: cc.bg }}
                  >
                    {t.category}
                  </span>
                </div>
                <div className="gl-definition">{t.definition}</div>
                {t.example && <div className="gl-example">e.g. {t.example}</div>}
                {t.seeIn.length > 0 && (
                  <div className="gl-see-in">
                    <span className="gl-see-in-label">→ see in:</span>
                    {t.seeIn.map((s, i) => (
                      <a key={i} href={s.path} className="gl-see-in-link">{s.label}</a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
