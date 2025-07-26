export default function FeaturesSection() {
  return (
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
  );
}
