import { Routes, Route, useNavigate } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import Home from './pages/Home.jsx'
import IntroLLMs from './pages/IntroLLMs.jsx'
import TokenOptimization from './pages/TokenOptimization.jsx'
import AgentsTools from './pages/AgentsTools.jsx'
import VectorEmbeddings from './pages/VectorEmbeddings.jsx'
import TemperatureSampling from './pages/TemperatureSampling.jsx'
import RAG from './pages/RAG.jsx'
import Glossary from './pages/Glossary.jsx'
import NeuralNetworks from './pages/NeuralNetworks.jsx'
import ImageGeneration from './pages/ImageGeneration.jsx'
import TypesOfLLMs from './pages/TypesOfLLMs.jsx'
import WorkflowCanvas from './pages/WorkflowCanvas.jsx'
import AgentSimulation from './pages/AgentSimulation.jsx'
import BoardBriefing from './pages/BoardBriefing.jsx'
import UseCaseBuilder from './pages/UseCaseBuilder.jsx'
import SignInPage from './pages/SignInPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/intro-llms" element={<IntroLLMs />} />
      <Route path="/types-of-llms" element={<TypesOfLLMs />} />
      <Route path="/token-optimization" element={<TokenOptimization />} />
      <Route path="/agents-tools" element={<AgentsTools />} />
      <Route path="/vector-embeddings" element={<VectorEmbeddings />} />
      <Route path="/temperature-sampling" element={<TemperatureSampling />} />
      <Route path="/rag" element={<RAG />} />
      <Route path="/glossary" element={<Glossary />} />
      <Route path="/neural-networks" element={<NeuralNetworks />} />
      <Route path="/image-generation" element={<ImageGeneration />} />
      <Route path="/workflow-canvas" element={<WorkflowCanvas />} />
      <Route path="/agent-simulation" element={<AgentSimulation />} />
      <Route path="/board-briefing" element={<BoardBriefing />} />
      <Route path="/use-case-builder" element={<UseCaseBuilder />} />
      {CLERK_PUBLISHABLE_KEY && (
        <>
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
        </>
      )}
    </Routes>
  )
}

export default function App() {
  const navigate = useNavigate()

  if (!CLERK_PUBLISHABLE_KEY) {
    if (typeof window !== 'undefined' && !window.__clerkWarned) {
      window.__clerkWarned = true
      console.info('[auth] VITE_CLERK_PUBLISHABLE_KEY not set — Clerk is disabled.')
    }
    return <AppRoutes />
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      <AppRoutes />
    </ClerkProvider>
  )
}
