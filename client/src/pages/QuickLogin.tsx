import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function QuickLogin() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDemoLogin = async (email: string, role: string) => {
    setLoading(role);
    try {
      console.log(`Attempting demo login for ${email}...`);
      const response = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });
      
      console.log('Demo login response status:', response.status);
      const data = await response.json();
      console.log('Demo login response data:', data);
      
      if (response.ok && data.success) {
        console.log(`Demo login successful for ${email}, redirecting...`);
        // Force immediate navigation without delay
        window.location.href = '/';
      } else {
        const errorMessage = data.error || `Login failed with status ${response.status}`;
        console.error('Demo login failed:', errorMessage);
        alert(`Login failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Demo login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Login error: ${errorMessage}`);
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