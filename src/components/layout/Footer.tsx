import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-fixlab-green text-white pt-16 pb-8 w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/fixlab-icon.png" alt="FixLab Icon" width={40} height={40} className="rounded-xl bg-white/10 p-1" />
            <Image src="/fixlab-logo.png" alt="FixLab Logo" width={100} height={40} className="object-contain brightness-0 invert" />
          </div>
          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
            Device & Appliance Repair, Booked. Premium service at your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/" className="hover:text-fixlab-mint transition-colors">Home</Link></li>
            <li><Link href="/services" className="hover:text-fixlab-mint transition-colors">Services</Link></li>
            <li><Link href="/about" className="hover:text-fixlab-mint transition-colors">About</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-bold mb-4">Categories</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Smartphone Repair</li>
            <li>Laptop & PC</li>
            <li>AC & Refrigerator</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>support@fixlab.com</li>
            <li>+880 1234 567890</li>
            <li>Mirpur, Dhaka</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} FixLab. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white">Facebook</Link>
          <Link href="#" className="hover:text-white">X (Twitter)</Link>
          <Link href="#" className="hover:text-white">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
}