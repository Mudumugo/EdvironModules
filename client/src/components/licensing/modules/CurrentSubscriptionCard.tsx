import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, RefreshCw, CheckCircle } from "lucide-react";
import { CurrentSubscription } from "../types";

interface CurrentSubscriptionCardProps {
  subscription: CurrentSubscription;
}

export function CurrentSubscriptionCard({ subscription }: CurrentSubscriptionCardProps) {
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

  return (
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
                  <h3 className="text-lg font-semibold text-gray-900">{subscription.planName} Plan</h3>
                  <p className="text-sm text-gray-600">
                    ${subscription.amount}/{subscription.currency.toLowerCase()} per month
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(subscription.status)}>
                {subscription.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(subscription.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(subscription.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Auto-renewal: {subscription.autoRenew ? "Enabled" : "Disabled"}
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
                  {subscription.usage.students} / {subscription.limits.students}
                </span>
              </div>
              <Progress 
                value={(subscription.usage.students / parseInt(subscription.limits.students.toString())) * 100} 
                className="h-2" 
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Storage</span>
                <span className="text-sm text-gray-600">
                  {subscription.usage.storage} / {subscription.limits.storage}
                </span>
              </div>
              <Progress value={25} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Modules</span>
                <span className="text-sm text-gray-600">
                  {subscription.usage.modules} / {subscription.limits.modules}
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
  );
}