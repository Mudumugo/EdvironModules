// Ultra-minimal test to isolate the React hook conflict
function MinimalApp() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "green" }}>✅ EdVirons Platform Test</h1>
      <p>This is the simplest possible React component to test Replit webview compatibility.</p>
      <p>If you see this message, React is working correctly!</p>
    </div>
  );
}

export default MinimalApp;