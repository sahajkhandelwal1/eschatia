import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import Destination from './pages/Destination';
import Discoveries from './pages/Discoveries';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/destination/:id" element={<Destination />} />
        <Route path="/discoveries" element={<Discoveries />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
