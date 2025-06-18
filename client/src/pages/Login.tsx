import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Eye, 
  EyeOff, 
  CreditCard,
  QrCode
} from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    role: "Student",
    email: "student@edvirons.com",
    id: "demo_student_elementary",
    color: "bg-blue-500"
  },
  {
    role: "Teacher",
    email: "teacher@edvirons.com",
    id: "teacher",
    color: "bg-green-500"
  },
  {
    role: "School Administrator",
    email: "admin@edvirons.com",
    id: "school_admin",
    color: "bg-purple-500"
  },
  {
    role: "IT Staff",
    email: "it@edvirons.com",
    id: "it_staff",
    color: "bg-orange-500"
  },
  {
    role: "Security Staff",
    email: "security@edvirons.com",
    id: "security_staff",
    color: "bg-red-500"
  }
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        email,
        password
      });

      if (response.ok) {
        toast({
          title: "Login Successful",
          description: "Welcome back to EdVirons!",
        });
        window.location.reload();
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (account: typeof DEMO_ACCOUNTS[0]) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/demo-login", {
        role: account.id,
        name: `Demo ${account.role}`,
        email: account.email
      });

      if (response.ok) {
        toast({
          title: "Login Successful",
          description: `Logged in as ${account.role}`,
        });
        window.location.reload();
      } else {
        throw new Error("Demo login failed");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Unable to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">EdVirons</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome Back!</h2>
          <p className="text-gray-600 mb-8">
            Been a while! Ready to dive back in? Let's get you signed in and back to Learning!
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full h-12 px-4 text-base border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-12 px-4 pr-10 text-base border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            <div className="text-right mt-2">
              <Link href="/forgot-password">
                <span className="text-sm text-blue-600 hover:text-blue-500 cursor-pointer">
                  Forgot Password?
                </span>
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-12 text-base font-medium rounded-md transition-colors"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* Demo Accounts */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 mb-3 text-sm">Demo Accounts</h3>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${account.color}`}></div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{account.role}</span>
                      <div className="text-gray-500 text-xs">{account.email}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(account)}
                    disabled={isLoading}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50 px-4 py-1 h-8 font-medium"
                  >
                    Use
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alternative Login Methods */}
        <div className="text-center">
          <p className="text-gray-500 mb-4 text-sm">Or continue with</p>
          <div className="flex space-x-4 justify-center">
            <Button
              variant="outline"
              className="flex items-center space-x-2 px-6 py-2 h-10 border-gray-300"
              onClick={() => toast({ title: "Coming Soon", description: "NFC login will be available soon" })}
            >
              <CreditCard className="h-4 w-4" />
              <span>NFC Card</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 px-6 py-2 h-10 border-gray-300"
              onClick={() => toast({ title: "Coming Soon", description: "QR code login will be available soon" })}
            >
              <QrCode className="h-4 w-4" />
              <span>QR Code</span>
            </Button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link href="/signup">
              <span className="text-blue-600 hover:text-blue-500 font-medium cursor-pointer">
                Sign Up
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}