import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Crown,
  Zap,
  Users,
  Calendar,
  RefreshCw
} from "lucide-react";

export default function Licensing() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['/api/subscriptions'],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  // Mock subscription plans
  const plans = [
    {
      id: 1,
      name: "Basic",
      price: 29,
      currency: "USD",
      interval: "month",
      features: [
        "Up to 100 students",
        "Basic reporting",
        "Email support",
        "Digital library access",
        "5GB storage"
      ],
      limits: {
        students: 100,
        storage: "5GB",
        modules: 3
      },
      popular: false
    },
    {
      id: 2,
      name: "Professional",
      price: 99,
      currency: "USD",
      interval: "month",
      features: [
        "Up to 500 students",
        "Advanced analytics",
        "Priority support",
        "All modules included",
        "50GB storage",
        "Custom branding"
      ],
      limits: {
        students: 500,
        storage: "50GB",
        modules: "All"
      },
      popular: true
    },
    {
      id: 3,
      name: "Enterprise",
      price: 299,
      currency: "USD",
      interval: "month",
      features: [
        "Unlimited students",
        "Custom integrations",
        "24/7 phone support",
        "All modules + premium features",
        "Unlimited storage",
        "Dedicated account manager",
        "SLA guarantee"
      ],
      limits: {
        students: "Unlimited",
        storage: "Unlimited",
        modules: "All + Premium"
      },
      popular: false
    }
  ];

  // Mock current subscription
  const currentSubscription = {
    id: 1,
    planName: "Professional",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    amount: 99,
    currency: "USD",
    paymentMethod: "Stripe",
    autoRenew: true,
    usage: {
      students: 247,
      storage: "12.5GB",
      modules: 8
    },
    limits: {
      students: 500,
      storage: "50GB",
      modules: "All"
    }
  };

  // Mock payment history
  const paymentHistory = [
    {
      id: 1,
      date: "2024-01-01",
      amount: 99,
      currency: "USD",
      status: "paid",
      method: "Credit Card",
      invoice: "INV-2024-001"
    },
    {
      id: 2,
      date: "2023-12-01",
      amount: 99,
      currency: "USD",
      status: "paid",
      method: "Credit Card",
      invoice: "INV-2023-012"
    },
    {
      id: 3,
      date: "2023-11-01",
      amount: 99,
      currency: "USD",
      status: "paid",
      method: "Credit Card",
      invoice: "INV-2023-011"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-600';
      case 'cancelled':
        return 'bg-red-50 text-red-600';
      case 'expired':
        return 'bg-yellow-50 text-yellow-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

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
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">License & Subscriptions</h1>
          <p className="text-gray-600 mt-1">
            Integrated payment gateway, subscription management, and renewal system
          </p>
        </div>
        <Button className="bg-primary-600 hover:bg-primary-700">
          <CreditCard className="h-4 w-4 mr-2" />
          Billing Settings
        </Button>
      </div>

      {/* Current Subscription Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Plan Details */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Star className="text-primary-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{currentSubscription.planName} Plan</h3>
                    <p className="text-sm text-gray-600">
                      ${currentSubscription.amount}/{currentSubscription.currency.toLowerCase()} per month
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(currentSubscription.status)}>
                  {currentSubscription.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(currentSubscription.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(currentSubscription.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Auto-renewal: {currentSubscription.autoRenew ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Change Plan
                  </Button>
                  <Button variant="outline" size="sm">
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Students</span>
                  <span className="text-sm text-gray-600">
                    {currentSubscription.usage.students} / {currentSubscription.limits.students}
                  </span>
                </div>
                <Progress 
                  value={(currentSubscription.usage.students / parseInt(currentSubscription.limits.students)) * 100} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Storage</span>
                  <span className="text-sm text-gray-600">
                    {currentSubscription.usage.storage} / {currentSubscription.limits.storage}
                  </span>
                </div>
                <Progress value={25} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Modules</span>
                  <span className="text-sm text-gray-600">
                    {currentSubscription.usage.modules} / {currentSubscription.limits.modules}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">All modules active</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plans">Available Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
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
                        <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
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
                      disabled={plan.name.toLowerCase() === currentSubscription.planName.toLowerCase()}
                    >
                      {plan.name.toLowerCase() === currentSubscription.planName.toLowerCase() 
                        ? 'Current Plan' 
                        : `Upgrade to ${plan.name}`
                      }
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary-50 p-2 rounded-lg">
                        <CreditCard className="text-primary-600 h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          ${payment.amount} {payment.currency}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString()} • {payment.method}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Usage Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Student Accounts</span>
                      <span className="text-sm text-gray-600">247 / 500</span>
                    </div>
                    <Progress value={49.4} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">49% of limit used</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Storage</span>
                      <span className="text-sm text-gray-600">12.5GB / 50GB</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">25% of storage used</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">API Calls</span>
                      <span className="text-sm text-gray-600">15,420 / 100,000</span>
                    </div>
                    <Progress value={15.4} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">15% of monthly limit</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Monthly Bandwidth</span>
                      <span className="text-sm text-gray-600">2.3TB / 10TB</span>
                    </div>
                    <Progress value={23} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">23% of bandwidth used</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm font-medium text-gray-900">Base Plan</span>
                    <span className="text-sm text-gray-600">$99.00</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm font-medium text-gray-900">Additional Storage</span>
                    <span className="text-sm text-gray-600">$0.00</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm font-medium text-gray-900">Premium Support</span>
                    <span className="text-sm text-gray-600">Included</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm font-medium text-gray-900">Tax</span>
                    <span className="text-sm text-gray-600">$9.90</span>
                  </div>
                  <div className="flex items-center justify-between py-2 font-semibold">
                    <span className="text-base text-gray-900">Total</span>
                    <span className="text-base text-gray-900">$108.90</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Cost Optimization</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    You could save $120/year by switching to annual billing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
