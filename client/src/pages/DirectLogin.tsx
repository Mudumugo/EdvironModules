import { useEffect } from 'react';

export default function DirectLogin() {
  useEffect(() => {
    // Direct server-side login approach
    const loginAsAdmin = async () => {
      try {
        const response = await fetch('/api/auth/demo-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: 'demo.admin@edvirons.com' })
        });
        
        if (response.ok) {
          // Instead of relying on frontend state, redirect to a server-rendered page
          window.location.href = '/dashboard-admin';
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    };
    
    loginAsAdmin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600">
      <div className="text-white text-center">
        <h1 className="text-2xl font-bold mb-4">Logging you in as Admin...</h1>
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  );
}