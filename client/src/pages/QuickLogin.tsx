import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function QuickLogin() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDemoLogin = async (email: string, role: string) => {
    setLoading(role);
    try {
      console.log(`Attempting login for ${email}...`);
      const response = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (response.ok && data.success) {
        console.log(`Login successful for ${email}, redirecting...`);
        // Force a complete page reload to ensure auth state updates
        window.location.replace('/');
      } else {
        console.error('Login failed:', data);
        alert(`Login failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(`Login error: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
          EdVirons Demo Login
        </h2>
        
        <div className="space-y-4">
          <Button
            onClick={() => handleDemoLogin('demo.teacher@edvirons.com', 'teacher')}
            disabled={loading !== null}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            {loading === 'teacher' ? 'Logging in...' : 'Login as Teacher'}
          </Button>
          
          <Button
            onClick={() => handleDemoLogin('demo.school@edvirons.com', 'admin')}
            disabled={loading !== null}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          >
            {loading === 'admin' ? 'Logging in...' : 'Login as School Admin'}
          </Button>
          
          <Button
            onClick={() => handleDemoLogin('student@edvirons.com', 'student')}
            disabled={loading !== null}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
          >
            {loading === 'student' ? 'Logging in...' : 'Login as Student'}
          </Button>
        </div>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          Select a role to test the EdVirons platform
        </p>
      </div>
    </div>
  );
}