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
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">IT Dashboard</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Monitor and manage school technology infrastructure</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <Button className="w-full sm:w-auto">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">System Settings</span>
              <span className="sm:hidden">Settings</span>
            </Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {systemStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <Badge 
                      variant={stat.status === 'excellent' || stat.status === 'optimal' ? 'default' : 
                              stat.status === 'warning' ? 'secondary' : 'destructive'}
                      className="mt-2 text-xs"
                    >
                      {stat.status}
                    </Badge>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${stat.color} flex-shrink-0`}>
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Network Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Network className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Network Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {networkPerformance.map((metric) => (
                  <div key={metric.metric} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{metric.metric}</p>
                      <p className="text-sm text-gray-600">{metric.value}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Badge variant="outline" className="text-green-600 border-green-300 text-xs">
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
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Server className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                System Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemServices.map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        service.status === 'running' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm truncate">{service.name}</p>
                        <p className="text-xs text-gray-600">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
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
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Monitor className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Device Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {deviceCategories.map((category) => (
                <div key={category.name} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-full ${category.color} flex-shrink-0`}>
                      <category.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">{category.total} total</Badge>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base truncate">{category.name}</h3>
                  <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{category.online} online</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-red-600">
                        <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{category.offline} offline</span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
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
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center text-base sm:text-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Recent IT Tickets
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                View All Tickets
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{ticket.id}</Badge>
                        <Badge 
                          variant={ticket.priority === 'high' ? 'destructive' : 
                                  ticket.priority === 'medium' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {ticket.priority}
                        </Badge>
                        <Badge 
                          variant={ticket.status === 'completed' ? 'default' : 'outline'}
                          className={`text-xs ${ticket.status === 'in-progress' ? 'bg-blue-500 text-white' : ''}`}
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-1 line-clamp-2">{ticket.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">Submitted by: {ticket.submitter}</p>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs sm:text-sm flex-shrink-0 lg:ml-4">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {ticket.created}
                    </div>
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