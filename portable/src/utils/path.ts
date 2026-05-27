export function useForwarded() {
  const path = window.location.pathname;
  const forwarded = path.split('/').filter(Boolean);
  return forwarded;
}

