import { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useCinematicTransition() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [transition, setTransition] = useState(null);
  const [blackOverlay, setBlackOverlay] = useState(false);
  const cardRefs = useRef({});

  // Call with (id, image, extraState?) — extraState is merged into router state
  const handleEnter = useCallback((id, image, extraState = {}) => {
    const cardEl = cardRefs.current[id];
    const state = { from: pathname, ...extraState };
    if (!cardEl) {
      navigate(`/destination/${id}`, { state });
      return;
    }
    const rect = cardEl.getBoundingClientRect();
    setTransition({ id, rect, image });
    setTimeout(() => setBlackOverlay(true), 620);
    setTimeout(() => navigate(`/destination/${id}`, { state }), 900);
  }, [navigate, pathname]);

  return { cardRefs, transition, blackOverlay, handleEnter };
}
