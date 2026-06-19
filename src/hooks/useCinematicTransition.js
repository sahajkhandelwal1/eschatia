import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useCinematicTransition() {
  const navigate = useNavigate();
  const [transition, setTransition] = useState(null);
  const [blackOverlay, setBlackOverlay] = useState(false);
  const cardRefs = useRef({});

  // Call with (id, image) — image is the destination's thumbnail src
  const handleEnter = useCallback((id, image) => {
    const cardEl = cardRefs.current[id];
    if (!cardEl) {
      navigate(`/destination/${id}`);
      return;
    }
    const rect = cardEl.getBoundingClientRect();
    setTransition({ id, rect, image });
    setTimeout(() => setBlackOverlay(true), 620);
    setTimeout(() => navigate(`/destination/${id}`), 900);
  }, [navigate]);

  return { cardRefs, transition, blackOverlay, handleEnter };
}
