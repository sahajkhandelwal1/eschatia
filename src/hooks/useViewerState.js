import { useState, useCallback } from 'react';

export function useViewerState() {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const clearHotspot = useCallback(() => setActiveHotspot(null), []);
  return { activeHotspot, setActiveHotspot, clearHotspot };
}
