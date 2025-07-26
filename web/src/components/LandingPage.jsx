import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthStore from "@/stores/authStore";
import { 
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function LandingPage() {
  const { user, isAuthenticated } = useAuthStore();

  const benefits = [
    "Reduce survey time by up to 75%",
    "Improve data accuracy and consistency",
    "Real-time situational awareness",
    "Comprehensive compliance reporting",
    "Scalable for enterprise operations"
  ];

     return (
     <div className="min-h-screen bg-gradient-to-br from-orange-25 to-orange-50">
             {/* Navigation */}
       <nav className="bg-orange-50 shadow-sm border-b border-orange-200 fixed w-full top-0 z-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center h-16">
             <div className="flex items-center gap-2">
               <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                 <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l3-9 7-4-10-6 3 6z" />
                </svg>
               </div>
               <span className="text-xl font-bold text-orange-900">FleetHQ</span>
             </div>
            
            <div className="flex items-center gap-4">
                             {user && isAuthenticated ? (
                 <Button asChild className="bg-orange-500 hover:bg-orange-600">
                   <Link to="/dashboard">
                     Go to Dashboard
                     <ArrowRight className="h-4 w-4 ml-2" />
                   </Link>
                 </Button>
               ) : (
                 <div className="flex gap-2">
                   <Button variant="outline" asChild className="border-orange-500 text-orange-600 hover:bg-orange-50">
                     <Link to="/login">Sign In</Link>
                   </Button>
                   <Button asChild className="bg-orange-500 hover:bg-orange-600">
                     <Link to="/login">Get Started</Link>
                   </Button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </nav>

             {/* Hero Section */}
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
               <Button variant="outline" size="lg" className="border-orange-500 text-orange-600 hover:bg-orange-50 text-lg px-8 py-4">
                 Watch Demo
               </Button>
             </div>
           )}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="min-h-screen flex items-center py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-900 mb-6">
              Complete Fleet Operations Platform
            </h2>
            <p className="text-xl md:text-2xl text-orange-700 max-w-3xl mx-auto">
              Everything you need to manage enterprise drone operations from planning to analysis
            </p>
          </div>
          
          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 h-auto md:h-[600px]">
            
            {/* Mission Planning - Large Card (2x2) */}
            <div className="md:col-span-3 md:row-span-2 group">
              <div className="h-full bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-10 border border-orange-200 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                <div className="flex flex-col h-full relative z-10">
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-orange-900 mb-3">Intuitive Mission Planning</h3>
                    <p className="text-xl text-orange-600">Interactive map-based planning</p>
                  </div>
                  <p className="text-lg text-orange-700 mb-8 flex-grow leading-relaxed">
                    Define survey areas, flight paths, and waypoints with our advanced interactive map tools. 
                    Plan complex missions with drag-and-drop simplicity and real-time optimization.
                  </p>
                  <div className="bg-white/60 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-between text-base text-orange-600 gap-2">
                      <span>✓ Interactive mapping</span>
                      <span>✓ Waypoint planning</span>
                      <span>✓ Route optimization</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Monitoring - Top Right */}
            <div className="md:col-span-3 md:row-span-1 group">
              <div className="h-full bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 border border-green-200 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-green-900 mb-4">Real-time Fleet Monitoring</h3>
                  <p className="text-lg text-green-700 leading-relaxed">
                    Track drone status, battery levels, and live mission progress on interactive maps with comprehensive real-time analytics
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Analytics - Middle Right */}
            <div className="md:col-span-3 md:row-span-1 group">
              <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border border-blue-200 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Advanced Analytics</h3>
                  <p className="text-lg text-blue-700 leading-relaxed">
                    Comprehensive reporting with flight statistics, coverage analytics, and predictive insights for optimal fleet performance
                  </p>
                </div>
              </div>
            </div>

            {/* Enterprise Security - Bottom Left */}
            <div className="md:col-span-2 md:row-span-1 group">
              <div className="h-full bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 border border-purple-200 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-purple-900 mb-4">Enterprise Security</h3>
                  <p className="text-base text-purple-700 leading-relaxed">
                    Role-based access control and secure data management with enterprise-grade encryption
                  </p>
                </div>
              </div>
            </div>

            {/* Automated Operations - Bottom Center */}
            <div className="md:col-span-2 md:row-span-1 group">
              <div className="h-full bg-gradient-to-r from-yellow-50 to-amber-100 rounded-3xl p-8 border border-yellow-200 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-yellow-900 mb-4">Automated Operations</h3>
                  <p className="text-base text-yellow-700 leading-relaxed">
                    Streamlined workflows with intelligent automation and smart scheduling
                  </p>
                </div>
              </div>
            </div>

            {/* Multi-facility Support - Bottom Right */}
            <div className="md:col-span-2 md:row-span-1 group">
              <div className="h-full bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-3xl p-8 border border-indigo-200 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-indigo-900 mb-4">Multi-facility Support</h3>
                  <p className="text-base text-indigo-700 leading-relaxed">
                    Manage operations across multiple locations and facilities with centralized control
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

             {/* Benefits Section */}
       <section className="min-h-screen flex items-center py-20 bg-orange-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div>
               <h2 className="text-4xl md:text-5xl font-bold text-orange-900 mb-8">
                 Transform Your Fleet Operations
               </h2>
               <p className="text-xl md:text-2xl text-orange-700 mb-12 leading-relaxed">
                 Join leading enterprises who trust FleetHQ to manage their autonomous 
                 drone operations across multiple facilities worldwide.
               </p>
              
                             <div className="space-y-6">
                 {benefits.map((benefit, index) => (
                   <div key={index} className="flex items-center gap-4">
                     <CheckCircle className="h-6 w-6 text-orange-500 flex-shrink-0" />
                     <span className="text-lg text-orange-800">{benefit}</span>
                   </div>
                 ))}
              </div>
            </div>
            
                         <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-2xl h-[500px] flex items-center justify-center shadow-2xl">
               <div className="text-center text-orange-800">
                 <svg className="h-16 w-16 mx-auto mb-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l3-9 7-4-10-6 3 6z" />
                </svg>
                 <p className="text-2xl font-semibold">Interactive Demo</p>
                 <p className="text-lg mt-2 opacity-80">Experience FleetHQ in action</p>
               </div>
             </div>
          </div>
        </div>
      </section>

             {/* CTA Section */}
       {!(user && isAuthenticated) && (
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
       )}

             {/* Footer */}
       <footer className="bg-orange-900 text-white py-12">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <div className="flex items-center justify-center gap-2 mb-4">
             <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
               <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l3-9 7-4-10-6 3 6z" />
               </svg>
             </div>
             <span className="text-xl font-bold">FleetHQ</span>
           </div>
           <p className="text-orange-200">
             © 2024 FleetHQ. All rights reserved. Enterprise drone management made simple.
           </p>
         </div>
       </footer>
    </div>
  );
}
