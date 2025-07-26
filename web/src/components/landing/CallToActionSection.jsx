import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/authStore";
import { ArrowRight } from "lucide-react";

export default function CallToActionSection() {
  const { user, isAuthenticated } = useAuthStore();

  if (user && isAuthenticated) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-orange-200 shadow-lg">
          <h2 className="text-3xl font-bold text-orange-900 mb-4">
            Ready to revolutionize your fleet operations?
          </h2>
          <p className="text-xl text-orange-700 mb-8">
            Start your free trial today and experience the future of enterprise fleet management.
          </p>
          
          <Button size="lg" asChild className="bg-orange-500 text-white hover:bg-orange-600 text-lg px-8 py-4">
            <Link to="/login">
              Get Started Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
