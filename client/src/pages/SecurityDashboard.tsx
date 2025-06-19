import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Camera, 
  AlertTriangle, 
  Users, 
  Clock, 
  MapPin,
  Eye,
  Phone,
  UserCheck,
  Activity,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Bell
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const securityStats = [
  { title: "Active Cameras", value: "24/24", status: "operational", icon: Camera, color: "bg-green-500" },
  { title: "Active Threats", value: "0", status: "safe", icon: AlertTriangle, color: "bg-blue-500" },
  { title: "Visitors Today", value: "47", status: "normal", icon: Users, color: "bg-purple-500" },
  { title: "Security Events", value: "3", status: "minor", icon: Shield, color: "bg-yellow-500" }
];

const securityZones = [
  { name: "Main Entrance", status: "secure", cameras: 4, alerts: 0, color: "bg-green-500" },
  { name: "Parking Lot", status: "secure", cameras: 6, alerts: 0, color: "bg-green-500" },
  { name: "Playground", status: "secure", cameras: 3, alerts: 0, color: "bg-green-500" },
  { name: "Emergency Exits", status: "secure", cameras: 8, alerts: 0, color: "bg-green-500" },
  { name: "Cafeteria", status: "secure", cameras: 2, alerts: 0, color: "bg-green-500" },
  { name: "Library", status: "secure", cameras: 1, alerts: 0, color: "bg-green-500" }
];

const recentEvents = [
  { 
    time: "09:15 AM", 
    event: "Visitor checked in", 
    details: "John Smith - Parent meeting", 
    zone: "Main Entrance",
    severity: "info"
  },
  { 
    time: "08:45 AM", 
    event: "Door propped open", 
    details: "Emergency exit door held open >3 minutes", 
    zone: "Building B",
    severity: "warning"
  },
  { 
    time: "08:30 AM", 
    event: "Security patrol completed", 
    details: "Morning perimeter check completed", 
    zone: "All Zones",
    severity: "success"
  },
  { 
    time: "07:55 AM", 
    event: "Access card used", 
    details: "Staff member Sarah Johnson", 
    zone: "Faculty Lounge",
    severity: "info"
  }
];

const activeVisitors = [
  { name: "John Smith", purpose: "Parent Meeting", checkIn: "09:15 AM", escort: "Mrs. Johnson", badge: "V001" },
  { name: "Tech Support", purpose: "Equipment Repair", checkIn: "08:30 AM", escort: "IT Staff", badge: "C002" },
  { name: "Maria Garcia", purpose: "Volunteer Activity", checkIn: "08:00 AM", escort: "Ms. Davis", badge: "V003" }
];

const emergencyContacts = [
  { name: "Local Police", number: "911", type: "emergency" },
  { name: "Fire Department", number: "911", type: "emergency" },
  { name: "School Security", number: "(555) 123-4567", type: "internal" },
  { name: "Principal", number: "(555) 123-4568", type: "internal" }
];

export default function SecurityDashboard() {
  const { user } = useAuth();
  const [selectedZone, setSelectedZone] = useState("all");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor campus security and safety systems</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
              <Phone className="h-4 w-4 mr-2" />
              Emergency Call
            </Button>
            <Button>
              <Bell className="h-4 w-4 mr-2" />
              Alert Center
            </Button>
          </div>
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <Badge 
                      variant={stat.status === 'operational' || stat.status === 'safe' ? 'default' : 'secondary'}
                      className="mt-2"
                    >
                      {stat.status}
                    </Badge>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Security Zones */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Security Zones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {securityZones.map((zone) => (
                    <div key={zone.name} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{zone.name}</h3>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${zone.color} mr-2`}></div>
                          <Badge variant="outline" className="text-xs">
                            {zone.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <Camera className="h-4 w-4 mr-1" />
                          {zone.cameras} cameras
                        </span>
                        <span className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {zone.alerts} alerts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Contacts */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emergencyContacts.map((contact) => (
                    <div key={contact.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.number}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={contact.type === 'emergency' ? 'destructive' : 'outline'}
                        onClick={() => window.open(`tel:${contact.number}`)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Security Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className={`p-1 rounded-full ${
                      event.severity === 'warning' ? 'bg-yellow-100' :
                      event.severity === 'success' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {event.severity === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : event.severity === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Shield className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{event.event}</p>
                        <span className="text-sm text-gray-500">{event.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{event.details}</p>
                      <p className="text-xs text-gray-500 mt-1">Zone: {event.zone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Visitors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2" />
                Active Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeVisitors.map((visitor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{visitor.name}</p>
                        <Badge variant="outline">{visitor.badge}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{visitor.purpose}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {visitor.checkIn} • Escort: {visitor.escort}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-3 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Check Out
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}