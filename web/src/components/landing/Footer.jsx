export default function Footer() {
  return (
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
  );
}
