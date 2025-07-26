import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/authStore";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-orange-900 mb-8">
          Enterprise Fleet
          <span className="text-orange-600 block">Management System</span>
        </h1>
        <p className="text-xl md:text-2xl text-orange-700 mb-12 max-w-4xl mx-auto leading-relaxed">
          Streamline autonomous drone operations with comprehensive mission planning, 
          real-time fleet monitoring, and advanced analytics for global enterprise facilities.
        </p>
       
        {!(user && isAuthenticated) && (
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-4">
              <Link to="/login">
                Start Free Trial
                <ArrowRight className="h-6 w-6 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-orange-500 text-orange-600 hover:bg-orange-50 text-lg px-8 py-4">
              <Link to="/documentation">
                View Documentation
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
