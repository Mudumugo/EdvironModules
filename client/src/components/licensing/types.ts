export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  limits: {
    students: number | string;
    storage: string;
    modules: number | string;
  };
  popular: boolean;
}

export interface CurrentSubscription {
  id: number;
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  autoRenew: boolean;
  usage: {
    students: number;
    storage: string;
    modules: number;
  };
  limits: {
    students: number | string;
    storage: string;
    modules: number | string;
  };
}

export interface PaymentRecord {
  id: number;
  date: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  invoice: string;
}