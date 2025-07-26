import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function DocumentationSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built with Purpose & Precision
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover how we tackled the complex challenges of enterprise drone fleet management 
            with a safety-first, scalable approach.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Problem Approach */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Problem-Driven Approach</h3>
            <p className="text-slate-300 leading-relaxed">
              We identified key pain points in traditional facility monitoring: time-consuming manual inspections, 
              safety risks, and inconsistent coverage. Our solution prioritizes automation, safety, and scalability.
            </p>
          </div>

          {/* Development Strategy */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Strategic Trade-offs</h3>
            <p className="text-slate-300 leading-relaxed">
              We balanced development speed with long-term scalability, choosing modern React architecture with MongoDB 
              for rapid prototyping while maintaining extensibility for enterprise growth.
            </p>
          </div>

          {/* Safety & Adaptability */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Safety & Adaptability</h3>
            <p className="text-slate-300 leading-relaxed">
              Built-in conflict detection, real-time health monitoring, and modular architecture ensure safe operations 
              while adapting to diverse enterprise environments and requirements.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" asChild className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-4">
            <Link to="/documentation">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Complete Technical Documentation
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
          <p className="text-slate-400 mt-4 text-sm">
            Comprehensive guides covering architecture, API reference, user flows, and deployment strategies
          </p>
        </div>
      </div>
    </section>
  );
}
