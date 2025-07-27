export default function FeaturesSection() {
  return (
    <section className="min-h-screen flex items-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-orange-900 mb-6">
            Complete Fleet Operations Platform
          </h2>
          <p className="text-xl md:text-2xl text-orange-700 max-w-3xl mx-auto">
            Everything you need to manage enterprise drone operations from planning to analysis
          </p>
        </div>
        
        {/* Bento Grid with Center Circle */}
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-6 grid-rows-3 gap-4 h-[600px]">
            
            {/* Top Left - Mission Planning */}
            <div className="col-span-2 row-span-1 group">
              <div className="h-full bg-orange-100 rounded-2xl p-6 border border-orange-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-orange-900 mb-4 tracking-tight">Mission Planning</h3>
                  <p className="text-base text-orange-700/90 leading-relaxed font-medium">
                    Interactive map-based planning with waypoint optimization
                  </p>
                </div>
              </div>
            </div>

            {/* Top Center - Fleet Status */}
            <div className="col-span-2 row-span-1 group">
              <div className="h-full bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-green-900 mb-4 tracking-tight">Fleet Status</h3>
                  <p className="text-base text-green-700/90 leading-relaxed font-medium">
                    Real-time monitoring of drone fleet health and status
                  </p>
                </div>
              </div>
            </div>

            {/* Top Right - Analytics */}
            <div className="col-span-2 row-span-1 group">
              <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4 tracking-tight">Advanced Analytics</h3>
                  <p className="text-base text-blue-700/90 leading-relaxed font-medium">
                    Comprehensive reporting and performance insights
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Left - Large Card */}
            <div className="col-span-2 row-span-2 group">
              <div className="h-full bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-purple-900 mb-6 tracking-tight leading-tight">Enterprise Security</h3>
                  <p className="text-lg text-purple-700/90 leading-relaxed mb-8 font-medium">
                    Role-based access control with enterprise-grade encryption and compliance management
                  </p>
                  <div className="bg-white/70 rounded-2xl p-6 backdrop-blur-sm border border-white/30">
                    <div className="flex flex-col gap-3 text-base text-purple-700 font-medium">
                      <span className="flex items-center gap-3">
                        <span className="text-purple-500 font-bold">✓</span>
                        Multi-factor authentication
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="text-purple-500 font-bold">✓</span>
                        Encrypted data transmission
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="text-purple-500 font-bold">✓</span>
                        Audit trail logging
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Circle - FleetHQ Logo */}
            <div className="col-span-2 row-span-1 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 group cursor-pointer">
                <svg className="h-16 w-16 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l3-9 7-4-10-6 3 6z" />
                </svg>
              </div>
            </div>

            {/* Middle Right - Large Card */}
            <div className="col-span-2 row-span-2 group">
              <div className="h-full bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 border border-teal-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-teal-900 mb-6 tracking-tight leading-tight">Real-time Monitoring</h3>
                  <p className="text-lg text-teal-700/90 leading-relaxed mb-8 font-medium">
                    Live tracking of mission progress with instant alerts and notifications
                  </p>
                  <div className="bg-white/70 rounded-2xl p-6 backdrop-blur-sm border border-white/30">
                    <div className="flex flex-col gap-3 text-base text-teal-700 font-medium">
                      <span className="flex items-center gap-3">
                        <span className="text-teal-500 font-bold">✓</span>
                        Live mission tracking
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="text-teal-500 font-bold">✓</span>
                        Battery monitoring
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="text-teal-500 font-bold">✓</span>
                        Emergency alerts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Left - Automation */}
            <div className="col-span-2 row-span-1 group">
              <div className="h-full bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-6 border border-yellow-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-yellow-900 mb-3">Multi-facility</h3>
                  <p className="text-sm text-yellow-700 leading-relaxed">
                    Centralized control across multiple locations
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
