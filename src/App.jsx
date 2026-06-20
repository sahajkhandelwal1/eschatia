import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import Destination from './pages/Destination';
import Discoveries from './pages/Discoveries';
import About from './pages/About';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
