import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function MarketingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold text-gray-900">EdVirons</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex ml-8 space-x-8">
            <Link href="/features">
              <span className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">Features</span>
            </Link>
            <Link href="/solutions">
              <span className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">Solutions</span>
            </Link>
            <Link href="/cbe-overview">
              <span className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">CBE Overview</span>
            </Link>
            <Link href="/about">
              <span className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">About</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/demo">
              <Button variant="outline">Request Demo</Button>
            </Link>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/features">
              <span className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 cursor-pointer">Features</span>
            </Link>
            <Link href="/solutions">
              <span className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 cursor-pointer">Solutions</span>
            </Link>
            <Link href="/cbe-overview">
              <span className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 cursor-pointer">CBE Overview</span>
            </Link>
            <Link href="/about">
              <span className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 cursor-pointer">About</span>
            </Link>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <Link href="/demo">
                <Button variant="outline" className="w-full mb-2">Request Demo</Button>
              </Link>
              <Link href="/login">
                <Button className="w-full">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}