import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/authStore";
import { ArrowRight } from "lucide-react";

export default function Navigation() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <nav className="bg-orange-100 shadow-sm border-b border-orange-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l3-9 7-4-10-6 3 6z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-orange-900">FleetHQ</span>
          </Link>
         
          <div className="flex items-center gap-4">
            {user && isAuthenticated ? (
              <Button asChild className="bg-orange-500 border border-orange-600 border-b-5 border-r-5 text-white hover:border-2 font-semibold px-8 py-4">
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button asChild className="bg-orange-500 border border-orange-600 border-b-5 border-r-5 text-white hover:border-2 font-semibold px-8 py-4">
                  <Link to="/login">Get Started</Link>
                </Button>
              </div>
            )}
            <div>
              <Button variant="outline" size="lg" asChild className="border-orange-500 text-orange-600 border-b-5 border-r-5 hover:border-2 font-semibold px-8 py-4 rounded-lg">
                <Link to="/documentation">
                  View Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
