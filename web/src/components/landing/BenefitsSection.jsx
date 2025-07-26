import { CheckCircle } from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    "Reduce survey time by up to 75%",
    "Improve data accuracy and consistency",
    "Real-time situational awareness",
    "Comprehensive compliance reporting",
    "Scalable for enterprise operations"
  ];

  return (
    <section className="min-h-screen flex items-center py-20">
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
  );
}
