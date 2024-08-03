import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage/Homepage';
import Broadcaster from './components/Streaming/Broadcast';
import Viewer from './components/Streaming/View';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/broadcast" element={<Broadcaster />} />
      <Route path="/view" element={<Viewer />} />
    </Routes>
  )
}