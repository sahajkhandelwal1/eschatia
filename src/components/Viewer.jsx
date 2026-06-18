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

    // Use tileSource (Zoomify etc.) if provided, otherwise fall back to plain image
    const resolvedTileSource = tileSource || { type: 'image', url: imageUrl };

    const viewer = OpenSeadragon({
      element: containerRef.current,
      prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@5/build/openseadragon/images/',
      tileSources: resolvedTileSource,
      // defaultZoomLevel 0 = fit entire image within viewport (OSD convention)
      defaultZoomLevel: 0,
      // Prevent panning entirely off the image
      visibilityRatio: 1,
      constrainDuringPan: true,
      // Allow slight zoom-out but keep image visible
      minZoomLevel: 0.8,
      // Smooth pan/zoom feel
      animationTime: 0.5,
      showNavigationControl: false,
    });
    viewerRef.current = viewer;

    viewer.addHandler('open', () => {
      // Snap to fit-to-screen immediately (true = no animation)
      viewer.viewport.goHome(true);

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
