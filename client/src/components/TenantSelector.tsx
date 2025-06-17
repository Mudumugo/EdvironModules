import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Crown, Check } from "lucide-react";
import { getCurrentTenant, setDevTenant, getTenantConfig } from "@/lib/tenantUtils";

const DEMO_TENANTS = [
  {
    id: 'demo',
    name: 'Demo University',
    subdomain: 'demo',
    subscription: 'basic',
    features: ['school-management', 'digital-library', 'analytics'],
    description: 'Try our basic educational platform features'
  },
  {
    id: 'harvard',
    name: 'Harvard University',
    subdomain: 'harvard',
    subscription: 'enterprise',
    features: ['school-management', 'digital-library', 'tutor-hub', 'analytics', 'virtual-labs'],
    description: 'Full-featured enterprise educational platform'
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    subdomain: 'stanford',
    subscription: 'premium',
    features: ['school-management', 'digital-library', 'tutor-hub', 'analytics', 'certification'],
    description: 'Premium educational platform with certification'
  },
  {
    id: 'mitschool',
    name: 'MIT School of Engineering',
    subdomain: 'mitschool',
    subscription: 'enterprise',
    features: ['school-management', 'digital-library', 'tutor-hub', 'analytics', 'virtual-labs', 'certification'],
    description: 'Complete enterprise solution with virtual labs'
  }
];

export default function TenantSelector() {
  const currentTenant = getCurrentTenant();
  const [selectedTenant, setSelectedTenant] = useState(currentTenant || 'demo');

  const handleTenantSwitch = (tenantId: string) => {
    setDevTenant(tenantId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Edvirons
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Multi-Tenant Educational Technology Platform
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select an institution to explore tenant-specific features and data isolation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEMO_TENANTS.map((tenant) => {
            const isSelected = selectedTenant === tenant.id;
            const config = getTenantConfig(tenant.id);
            
            return (
              <Card 
                key={tenant.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedTenant(tenant.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-8 w-8 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{tenant.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {tenant.subdomain}.edvirons.com
                        </CardDescription>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant={tenant.subscription === 'enterprise' ? 'default' : 
                               tenant.subscription === 'premium' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {tenant.subscription === 'enterprise' && <Crown className="h-3 w-3 mr-1" />}
                      {tenant.subscription.charAt(0).toUpperCase() + tenant.subscription.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {tenant.features.length} modules
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {tenant.description}
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Available Features:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {tenant.features.slice(0, 4).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature.replace('-', ' ')}
                        </Badge>
                      ))}
                      {tenant.features.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{tenant.features.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button 
            onClick={() => handleTenantSwitch(selectedTenant)}
            size="lg"
            className="px-8"
          >
            Access {DEMO_TENANTS.find(t => t.id === selectedTenant)?.name}
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Development Mode: Tenant switching simulates subdomain routing
          </p>
        </div>
      </div>
    </div>
  );
}