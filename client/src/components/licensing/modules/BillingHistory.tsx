import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { PaymentRecord } from "../types";
import { formatKSH } from "@shared/utils/currency";

interface BillingHistoryProps {
  paymentHistory: PaymentRecord[];
}

export function BillingHistory({ paymentHistory }: BillingHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-600';
      case 'pending':
        return 'bg-yellow-50 text-yellow-600';
      case 'failed':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
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
                    {formatKSH(payment.amount)}
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
  );
}