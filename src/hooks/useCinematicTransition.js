import { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useCinematicTransition() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [transition, setTransition] = useState(null);
  const [blackOverlay, setBlackOverlay] = useState(false);
  const cardRefs = useRef({});

  // Call with (id, image) — image is the destination's thumbnail src
  const handleEnter = useCallback((id, image) => {
    const cardEl = cardRefs.current[id];
    if (!cardEl) {
      navigate(`/destination/${id}`, { state: { from: pathname } });
      return;
    }
    const rect = cardEl.getBoundingClientRect();
    setTransition({ id, rect, image });
    setTimeout(() => setBlackOverlay(true), 620);
    setTimeout(() => navigate(`/destination/${id}`, { state: { from: pathname } }), 900);
  }, [navigate, pathname]);

  return { cardRefs, transition, blackOverlay, handleEnter };
}
