import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Star, Users, School } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Transform Your School?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of educators across Kenya who are already using EdVirons to enhance their teaching and improve student outcomes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
                Schedule Demo
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Star className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  4.9/5 Rating
                </h3>
                <p className="text-blue-100 text-sm">
                  Trusted by educators nationwide
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Users className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  50,000+ Students
                </h3>
                <p className="text-blue-100 text-sm">
                  Learning with EdVirons daily
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <School className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  200+ Schools
                </h3>
                <p className="text-blue-100 text-sm">
                  Across all 47 counties
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}