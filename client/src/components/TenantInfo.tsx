import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Crown, Star, Shield } from "lucide-react";

export function TenantInfo() {
  const { tenant, isLoading, hasFeature, getSubscriptionLevel, isEnterprise, isPremium } = useTenant();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tenant) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-gray-500">No tenant information available</p>
        </CardContent>
      </Card>
    );
  }

  const getSubscriptionIcon = () => {
    switch (getSubscriptionLevel()) {
      case 'enterprise':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'premium':
        return <Star className="h-4 w-4 text-purple-600" />;
      default:
        return <Shield className="h-4 w-4 text-blue-600" />;
    }
  };

  const getSubscriptionColor = () => {
    switch (getSubscriptionLevel()) {
      case 'enterprise':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'premium':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-gray-600" />
          {tenant.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Subscription:</span>
          <Badge className={`flex items-center gap-1 ${getSubscriptionColor()}`}>
            {getSubscriptionIcon()}
            {getSubscriptionLevel().charAt(0).toUpperCase() + getSubscriptionLevel().slice(1)}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Tenant ID:</span>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{tenant.id}</code>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Available Features:</h4>
          <div className="flex flex-wrap gap-1">
            {tenant.features.map((feature) => (
              <Badge key={feature} variant="outline" className="text-xs">
                {feature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Feature Checks:</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>School Management:</span>
              <Badge variant={hasFeature('school-management') ? 'default' : 'secondary'} className="text-xs">
                {hasFeature('school-management') ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Digital Library:</span>
              <Badge variant={hasFeature('digital-library') ? 'default' : 'secondary'} className="text-xs">
                {hasFeature('digital-library') ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Analytics:</span>
              <Badge variant={hasFeature('analytics') ? 'default' : 'secondary'} className="text-xs">
                {hasFeature('analytics') ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Virtual Labs:</span>
              <Badge variant={hasFeature('virtual-labs') ? 'default' : 'secondary'} className="text-xs">
                {hasFeature('virtual-labs') ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TenantInfo;