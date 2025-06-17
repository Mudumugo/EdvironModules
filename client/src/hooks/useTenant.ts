import { useQuery } from "@tanstack/react-query";

interface Tenant {
  id: string;
  subdomain: string;
  name: string;
  features: string[];
  subscription: string;
}

export function useTenant() {
  const { data: tenant, isLoading } = useQuery<Tenant>({
    queryKey: ["/api/tenant"],
    retry: false,
  });

  const hasFeature = (featureId: string) => {
    return tenant?.features.includes(featureId) || false;
  };

  const getSubscriptionLevel = () => {
    return tenant?.subscription || 'basic';
  };

  const isEnterprise = () => {
    return tenant?.subscription === 'enterprise';
  };

  const isPremium = () => {
    return tenant?.subscription === 'premium' || tenant?.subscription === 'enterprise';
  };

  return {
    tenant,
    isLoading,
    hasFeature,
    getSubscriptionLevel,
    isEnterprise,
    isPremium,
  };
}