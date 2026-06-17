import OpenSeadragon from 'openseadragon';
import { useEffect, useRef } from 'react';

export default function Viewer({ imageUrl, tileSource, onViewerReady }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (viewerRef.current) {
      viewerRef.current.destroy();
      viewerRef.current = null;
    }

    const viewer = OpenSeadragon({
      element: containerRef.current,
      prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@5/build/openseadragon/images/',
      tileSources: tileSource || { type: 'image', url: imageUrl, buildPyramid: false },
      defaultZoomLevel: 0,
      showNavigationControl: false,
    });
    viewerRef.current = viewer;

    viewer.addHandler('open', () => {
      if (onViewerReady) {
        onViewerReady(viewer);
      }
    });

    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [imageUrl]);

  return (
    <div
      ref={containerRef}
      className="bg-space-950"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
