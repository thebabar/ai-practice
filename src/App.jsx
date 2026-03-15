import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import TokenOptimization from './pages/TokenOptimization.jsx'
import AgentsTools from './pages/AgentsTools.jsx'
import VectorEmbeddings from './pages/VectorEmbeddings.jsx'
import TemperatureSampling from './pages/TemperatureSampling.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/token-optimization" element={<TokenOptimization />} />
      <Route path="/agents-tools" element={<AgentsTools />} />
      <Route path="/vector-embeddings" element={<VectorEmbeddings />} />
      <Route path="/temperature-sampling" element={<TemperatureSampling />} />
    </Routes>
  )
}
