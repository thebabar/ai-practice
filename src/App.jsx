import { Routes, Route } from 'react-router-dom'
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

export default function App() {
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
    </Routes>
  )
}
