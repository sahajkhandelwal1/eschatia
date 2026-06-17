// Fetches and caches the JWST discoveries feed from the edge proxy
export function useJWSTFeed() {
  return { entries: [], loading: true, error: null };
}
