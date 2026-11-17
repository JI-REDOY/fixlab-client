export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl md:text-6xl font-bold text-fixlab-green mb-4">
        FixLab
      </h1>
      <p className="text-lg text-fixlab-gray mb-8 text-center max-w-lg">
        Device & Appliance Repair, Booked. Premium service at your doorstep.
      </p>
      <button className="px-6 py-3 bg-fixlab-green text-white rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-lg">
        Book a Repair
      </button>
    </main>
  );
}