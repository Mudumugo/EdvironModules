import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SystemStatus() {
  const systemServices = [
    {
      name: "Learning Management System",
      status: "operational",
      color: "bg-green-500"
    },
    {
      name: "Student Information System", 
      status: "operational",
      color: "bg-green-500"
    },
    {
      name: "Parent Portal",
      status: "maintenance",
      color: "bg-yellow-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systemServices.map((service, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-3 h-3 ${service.color} rounded-full`}></div>
              <div>
                <p className="text-sm font-medium">{service.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {service.status === 'operational' ? 'Operational' : 'Maintenance Mode'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}