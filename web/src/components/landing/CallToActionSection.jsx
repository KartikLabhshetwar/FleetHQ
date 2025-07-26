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
    <section className="py-20 bg-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to revolutionize your fleet operations?
        </h2>
        <p className="text-xl text-orange-100 mb-8">
          Start your free trial today and experience the future of enterprise fleet management.
        </p>
        
        <Button size="lg" variant="secondary" asChild className="bg-white text-orange-600 hover:bg-orange-50">
          <Link to="/login">
            Get Started Now
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
