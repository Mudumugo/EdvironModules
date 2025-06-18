import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

export function UsageAnalytics() {
  return (
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
  );
}