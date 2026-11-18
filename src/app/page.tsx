import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* আপনার আইকন */}
      <Image 
        src="/fixlab-icon.png" 
        alt="FixLab Icon" 
        width={100} 
        height={100} 
        className="mb-6 rounded-3xl shadow-xl"
      />
      
      {/* আপনার টেক্সট লোগো */}
      <Image 
        src="/fixlab-logo.png" 
        alt="FixLab Logo" 
        width={250} 
        height={80} 
        className="mb-4"
      />
      
      <button className="mt-8 px-6 py-3 bg-fixlab-green text-white rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-lg">
        Book a Repair
      </button>
    </main>
  );
}