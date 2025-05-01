import VrBeisMedrash from "./components/VrBeisMedrash";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <header className="w-full py-8 text-center">
        <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Welcome to VR Beis Medrash
        </h1>
        <p className="text-xl text-blue-200">Experience Torah learning in virtual reality</p>
      </header>
      
      <main className="flex-1 w-full max-w-6xl px-4 py-8">
        <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg shadow-2xl mb-10 border border-blue-500/30">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">Enter the Virtual Beis Medrash</h2>
          <p className="mb-6">
            Immerse yourself in a virtual learning environment where you can study 
            sacred texts, connect with others, and experience Torah learning in a whole new dimension.
          </p>
          
          <div className="h-[500px] w-full rounded-lg overflow-hidden border-2 border-blue-500/50">
            <VrBeisMedrash />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-6 justify-center mt-8">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-all shadow-lg hover:shadow-blue-500/30">
            Enter VR Mode
          </button>
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-medium transition-all shadow-lg hover:shadow-purple-500/30">
            Browse Library
          </button>
        </div>
      </main>
      
      <footer className="w-full py-6 text-center text-blue-300/70 text-sm">
        <p>© {new Date().getFullYear()} VR Beis Medrash • A Revolutionary Torah Learning Experience</p>
      </footer>
    </div>
  );
}
