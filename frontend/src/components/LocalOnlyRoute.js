/**
 * LocalOnlyRoute
 * Renders children ONLY when accessed from localhost / 127.0.0.1.
 * On any other hostname (live domain, friend's browser, etc.) it shows
 * a blank "Not found" screen so the admin UI never loads.
 *
 * NOTE: The real security is the backend IP allowlist middleware.
 * This is a complementary UI layer.
 */
const isLocalhost = () => {
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1' || h === '::1';
};

export default function LocalOnlyRoute({ children }) {
  if (!isLocalhost()) {
    // Render nothing — looks like a standard 404
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#020617',
          color: '#334155',
          fontFamily: 'sans-serif',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 72, lineHeight: 1 }}>404</span>
        <span style={{ fontSize: 14 }}>Page not found</span>
      </div>
    );
  }
  return children;
}
