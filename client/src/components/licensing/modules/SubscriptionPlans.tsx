import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Star, Crown } from "lucide-react";
import { SubscriptionPlan } from "../types";
import { formatKSH } from "@shared/utils/currency";

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  currentPlanName: string;
}

export function SubscriptionPlans({ plans, currentPlanName }: SubscriptionPlansProps) {
  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic':
        return Shield;
      case 'professional':
        return Star;
      case 'enterprise':
        return Crown;
      default:
        return Shield;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const IconComponent = getPlanIcon(plan.name);
        return (
          <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary-600 text-white">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="bg-primary-50 p-3 rounded-lg w-fit mx-auto mb-4">
                  <IconComponent className="text-primary-600 h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">{formatKSH(plan.price)}</span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-primary-600 hover:bg-primary-700' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
                disabled={plan.name.toLowerCase() === currentPlanName.toLowerCase()}
              >
                {plan.name.toLowerCase() === currentPlanName.toLowerCase() 
                  ? 'Current Plan' 
                  : `Upgrade to ${plan.name}`
                }
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}