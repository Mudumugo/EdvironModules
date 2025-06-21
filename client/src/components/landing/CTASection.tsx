import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";

interface CTASectionProps {
  onGetStarted: () => void;
}

const benefits = [
  "30-day free trial",
  "No setup fees", 
  "24/7 support",
  "Easy migration"
];

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Card className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600">
          <CardContent className="px-6 py-16 sm:px-16 sm:py-24 lg:px-24">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Transform Your School?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
                Join thousands of schools worldwide who have revolutionized their educational 
                experience with our comprehensive platform.
              </p>
              
              <div className="mt-8 flex justify-center">
                <div className="grid grid-cols-2 gap-4 text-sm text-blue-100">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost"
                  size="lg" 
                  className="text-white hover:bg-white/10 font-semibold"
                >
                  Schedule Demo
                </Button>
              </div>
              
              <p className="mt-6 text-sm text-blue-200">
                No credit card required • Set up in minutes • Cancel anytime
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}