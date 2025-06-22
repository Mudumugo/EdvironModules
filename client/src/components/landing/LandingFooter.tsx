import { Link } from "wouter";
import { Mail, Phone, MapPin } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-semibold">EdVirons</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Empowering education through innovative technology solutions designed for the 
              Kenyan education system.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/features" className="hover:text-gray-900">Features</Link></li>
              <li><Link href="/digital-library" className="hover:text-gray-900">Digital Library</Link></li>
              <li><Link href="/school-management" className="hover:text-gray-900">School Management</Link></li>
              <li><Link href="/learning-analytics" className="hover:text-gray-900">Learning Analytics</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-gray-900">About</Link></li>
              <li><Link href="/careers" className="hover:text-gray-900">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-gray-900">Blog</Link></li>
              <li><Link href="/press" className="hover:text-gray-900">Press</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/help" className="hover:text-gray-900">Help Center</Link></li>
            </ul>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Contact</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  hello@edvirons.com
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +254 700 000 000
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Nairobi, Kenya
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          © 2024 EdVirons Learning Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}