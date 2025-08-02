export function TestLanding() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-slate-900 text-white p-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <img 
              src="/attached_assets/edv-main-logo_1754150677721.png" 
              alt="EdVirons Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-semibold">EdVirons</span>
        </div>
      </nav>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          EdVirons Learning Ecosystem
        </h1>
        <p className="text-lg text-gray-600">
          Logo replacement test page
        </p>
      </div>
    </div>
  );
}