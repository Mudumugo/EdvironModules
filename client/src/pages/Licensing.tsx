import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard } from "lucide-react";
import {
  CurrentSubscriptionCard,
  SubscriptionPlans,
  BillingHistory,
  UsageAnalytics
} from "@/components/licensing/modules";
import { SubscriptionPlan, CurrentSubscription, PaymentRecord } from "@/components/licensing/types";

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
  const plans: SubscriptionPlan[] = [
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
  const currentSubscription: CurrentSubscription = {
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
  const paymentHistory: PaymentRecord[] = [
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
      <CurrentSubscriptionCard subscription={currentSubscription} />

      {/* Main Content */}
      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plans">Available Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <SubscriptionPlans plans={plans} currentPlanName={currentSubscription.planName} />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <BillingHistory paymentHistory={paymentHistory} />
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <UsageAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
