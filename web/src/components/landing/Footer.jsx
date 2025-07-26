export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-200 shadow-lgpy-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l3-9 7-4-10-6 3 6z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-orange-900">FleetHQ</span>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* GitHub */}
            <a
              href="https://github.com/KartikLabhshetwar/FleetHQ"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-100 hover:bg-orange-100 rounded-lg flex items-center justify-center transition-colors duration-200 group"
            >
              <svg className="h-5 w-5 text-gray-600 group-hover:text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/kartikcode/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-100 hover:bg-orange-100 rounded-lg flex items-center justify-center transition-colors duration-200 group"
            >
              <svg className="h-5 w-5 text-gray-600 group-hover:text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            
            {/* Twitter/X */}
            <a
              href="https://x.com/code_kartik"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-100 hover:bg-orange-100 rounded-lg flex items-center justify-center transition-colors duration-200 group"
            >
              <svg className="h-5 w-5 text-gray-600 group-hover:text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
              </svg>
            </a>
            
            {/* Email */}
            <a
              href="mailto:kartik.labhshetwar@gmail.com"
              className="w-10 h-10 bg-gray-100 hover:bg-orange-100 rounded-lg flex items-center justify-center transition-colors duration-200 group"
            >
              <svg className="h-5 w-5 text-gray-600 group-hover:text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
          
          <p className="text-orange-700">
            © 2024 FleetHQ. All rights reserved. Enterprise drone management made simple.
          </p>

      </div>
    </footer>
  );
}
