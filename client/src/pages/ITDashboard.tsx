import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Wifi, 
  Server, 
  HardDrive, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Database,
  Network,
  Smartphone,
  Laptop,
  Printer,
  Activity,
  TrendingUp,
  Download,
  Upload,
  Zap,
  Shield
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const systemStats = [
  { title: "Network Uptime", value: "99.8%", status: "excellent", icon: Network, color: "bg-green-500" },
  { title: "Active Devices", value: "1,247", status: "normal", icon: Monitor, color: "bg-blue-500" },
  { title: "Server Load", value: "23%", status: "optimal", icon: Server, color: "bg-emerald-500" },
  { title: "Storage Used", value: "67%", status: "warning", icon: HardDrive, color: "bg-yellow-500" }
];

const networkPerformance = [
  { metric: "Download Speed", value: "950 Mbps", status: "excellent", change: "+5%" },
  { metric: "Upload Speed", value: "480 Mbps", status: "excellent", change: "+2%" },
  { metric: "Latency", value: "12ms", status: "excellent", change: "-3%" },
  { metric: "Packet Loss", value: "0.01%", status: "excellent", change: "0%" }
];

const deviceCategories = [
  { name: "Student Laptops", total: 450, online: 423, offline: 27, icon: Laptop, color: "bg-blue-500" },
  { name: "Teacher Devices", total: 85, online: 81, offline: 4, icon: Monitor, color: "bg-green-500" },
  { name: "Mobile Devices", total: 320, online: 298, offline: 22, icon: Smartphone, color: "bg-purple-500" },
  { name: "Printers", total: 24, online: 22, offline: 2, icon: Printer, color: "bg-orange-500" },
  { name: "Interactive Boards", total: 35, online: 34, offline: 1, icon: Monitor, color: "bg-teal-500" },
  { name: "Network Equipment", total: 48, online: 47, offline: 1, icon: Wifi, color: "bg-indigo-500" }
];

const recentTickets = [
  { 
    id: "IT-001", 
    title: "Projector not working in Room 205", 
    submitter: "Ms. Johnson", 
    priority: "high",
    status: "in-progress",
    created: "30 min ago"
  },
  { 
    id: "IT-002", 
    title: "WiFi connection issues in Library", 
    submitter: "Librarian", 
    priority: "medium",
    status: "investigating",
    created: "1 hour ago"
  },
  { 
    id: "IT-003", 
    title: "Student laptop battery replacement", 
    submitter: "John Smith", 
    priority: "low",
    status: "scheduled",
    created: "2 hours ago"
  },
  { 
    id: "IT-004", 
    title: "Email configuration for new teacher", 
    submitter: "HR Department", 
    priority: "medium",
    status: "completed",
    created: "3 hours ago"
  }
];

const systemServices = [
  { name: "Learning Management System", status: "running", uptime: "99.9%", load: "15%" },
  { name: "Student Information System", status: "running", uptime: "99.8%", load: "22%" },
  { name: "Email Server", status: "running", uptime: "100%", load: "8%" },
  { name: "File Server", status: "running", uptime: "99.7%", load: "45%" },
  { name: "Backup System", status: "running", uptime: "99.5%", load: "12%" },
  { name: "Security System", status: "running", uptime: "100%", load: "6%" }
];

export default function ITDashboard() {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">IT Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor and manage school technology infrastructure</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <Badge 
                      variant={stat.status === 'excellent' || stat.status === 'optimal' ? 'default' : 
                              stat.status === 'warning' ? 'secondary' : 'destructive'}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Network Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="h-5 w-5 mr-2" />
                Network Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {networkPerformance.map((metric) => (
                  <div key={metric.metric} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{metric.metric}</p>
                      <p className="text-sm text-gray-600">{metric.value}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        {metric.status}
                      </Badge>
                      <span className="text-sm text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 mr-2" />
                System Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemServices.map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === 'running' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{service.name}</p>
                        <p className="text-xs text-gray-600">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {service.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">Load: {service.load}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              Device Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deviceCategories.map((category) => (
                <div key={category.name} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-full ${category.color}`}>
                      <category.icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="outline">{category.total} total</Badge>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{category.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {category.online} online
                    </span>
                    <span className="flex items-center text-red-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {category.offline} offline
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(category.online / category.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent IT Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent IT Tickets
              </div>
              <Button variant="outline" size="sm">
                View All Tickets
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant="outline">{ticket.id}</Badge>
                      <Badge 
                        variant={ticket.priority === 'high' ? 'destructive' : 
                                ticket.priority === 'medium' ? 'secondary' : 'outline'}
                      >
                        {ticket.priority}
                      </Badge>
                      <Badge 
                        variant={ticket.status === 'completed' ? 'default' : 'outline'}
                        className={ticket.status === 'in-progress' ? 'bg-blue-500' : ''}
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                    <p className="text-sm text-gray-600">Submitted by: {ticket.submitter}</p>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {ticket.created}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}