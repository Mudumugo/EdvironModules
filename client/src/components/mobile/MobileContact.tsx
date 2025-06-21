import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin } from "lucide-react";

export function MobileContact() {
  return (
    <div className="px-6 py-8 bg-gray-50">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Get in Touch
        </h2>
        <p className="text-gray-600">
          Ready to transform your school's education experience?
        </p>
      </div>

      <div className="space-y-6">
        {/* Contact Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-600">contact@edvirons.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
            <div className="p-2 bg-green-100 rounded-lg">
              <Phone className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Phone</p>
              <p className="text-sm text-gray-600">+254 (0) 700 123 456</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Location</p>
              <p className="text-sm text-gray-600">Nairobi, Kenya</p>
            </div>
          </div>
        </div>

        {/* Quick Contact Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Your Name" />
            <Input placeholder="School/Organization" />
            <Input placeholder="Email Address" type="email" />
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows={3}
              placeholder="Tell us about your needs..."
            />
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}