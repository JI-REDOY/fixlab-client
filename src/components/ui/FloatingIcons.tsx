"use client";

import {
  Wrench,
  Settings,
  Smartphone,
  Laptop,
  Wind,
  Tv,
  Zap,
  Hammer,
  ShieldCheck,
  MapPin,
  Camera,
  Music,
  Video,
  MonitorPlay,
  Lightbulb,
  PenTool,
  Cpu,
  HardDrive,
  Radio,
  Printer,
  Speaker,
  Mic,
  MousePointer,
  Battery,
  Bluetooth,
  Wifi,
  Server,
  Clock,
  User,
} from "lucide-react";

export default function FloatingIcons() {
  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* --- উপরের অংশ (Top Area) --- */}
      <Wrench className="floating-icon top-[5%] left-[5%] text-[#ff5722] opacity-20" size={28} style={{ animationDelay: "0s" }} />
      <Smartphone className="floating-icon top-[15%] left-[12%] text-[#ff5722] opacity-15" size={35} style={{ animationDelay: "2s" }} />
      <PenTool className="floating-icon top-[8%] left-[22%] text-[#ff5722] opacity-20" size={24} style={{ animationDelay: "1s" }} />
      <Clock className="floating-icon top-[12%] left-[35%] text-[#ff5722] opacity-15" size={26} style={{ animationDelay: "3s" }} />
      <Printer className="floating-icon top-[6%] left-[48%] text-[#ff5722] opacity-20" size={28} style={{ animationDelay: "4s" }} />
      <Settings className="floating-icon top-[14%] left-[60%] text-[#ff5722] opacity-15" size={32} style={{ animationDelay: "1.5s" }} />
      <Radio className="floating-icon top-[7%] left-[75%] text-[#ff5722] opacity-20" size={24} style={{ animationDelay: "0.5s" }} />
      <Camera className="floating-icon top-[18%] right-[15%] text-[#ff5722] opacity-15" size={26} style={{ animationDelay: "2.5s" }} />
      <Cpu className="floating-icon top-[8%] right-[5%] text-[#ff5722] opacity-20" size={30} style={{ animationDelay: "3.5s" }} />

      {/* --- মাঝখানের ওপরের অংশ (Upper Middle) --- */}
      <Hammer className="floating-icon top-[25%] left-[8%] text-[#ff5722] opacity-20" size={30} style={{ animationDelay: "4s" }} />
      <MapPin className="floating-icon top-[30%] left-[20%] text-[#ff5722] opacity-15" size={24} style={{ animationDelay: "1.5s" }} />
      <Battery className="floating-icon top-[28%] left-[32%] text-[#ff5722] opacity-20" size={26} style={{ animationDelay: "2.5s" }} />
      <ShieldCheck className="floating-icon top-[25%] left-[45%] text-[#ff5722] opacity-15" size={35} style={{ animationDelay: "0.5s" }} />
      <Speaker className="floating-icon top-[32%] left-[58%] text-[#ff5722] opacity-20" size={28} style={{ animationDelay: "3.5s" }} />
      <Laptop className="floating-icon top-[22%] right-[25%] text-[#ff5722] opacity-15" size={35} style={{ animationDelay: "2s" }} />
      <Mic className="floating-icon top-[35%] right-[12%] text-[#ff5722] opacity-20" size={24} style={{ animationDelay: "5s" }} />
      <Wind className="floating-icon top-[28%] right-[3%] text-[#ff5722] opacity-15" size={30} style={{ animationDelay: "1.2s" }} />

      {/* --- ঠিক মাঝখানের অংশ (Center Area - Targeting your empty space) --- */}
      <HardDrive className="floating-icon top-[45%] left-[4%] text-[#ff5722] opacity-20" size={28} style={{ animationDelay: "2.2s" }} />
      <Bluetooth className="floating-icon top-[50%] left-[15%] text-[#ff5722] opacity-15" size={26} style={{ animationDelay: "0.8s" }} />
      <Tv className="floating-icon top-[42%] left-[28%] text-[#ff5722] opacity-20" size={30} style={{ animationDelay: "4.1s" }} />
      <Wifi className="floating-icon top-[48%] left-[38%] text-[#ff5722] opacity-15" size={32} style={{ animationDelay: "1.8s" }} />
      <MousePointer className="floating-icon top-[45%] left-[50%] text-[#ff5722] opacity-20" size={26} style={{ animationDelay: "3.2s" }} />
      <Music className="floating-icon top-[52%] left-[62%] text-[#ff5722] opacity-15" size={28} style={{ animationDelay: "2.7s" }} />
      <Server className="floating-icon top-[42%] right-[30%] text-[#ff5722] opacity-20" size={30} style={{ animationDelay: "5.5s" }} />
      <Zap className="floating-icon top-[50%] right-[18%] text-[#ff5722] opacity-15" size={26} style={{ animationDelay: "1.1s" }} />
      <User className="floating-icon top-[45%] right-[6%] text-[#ff5722] opacity-20" size={28} style={{ animationDelay: "3.8s" }} />

      {/* --- মাঝখানের নিচের অংশ (Lower Middle) --- */}
      <Video className="floating-icon top-[65%] left-[10%] text-[#ff5722] opacity-15" size={28} style={{ animationDelay: "4.5s" }} />
      <MonitorPlay className="floating-icon top-[72%] left-[22%] text-[#ff5722] opacity-20" size={32} style={{ animationDelay: "3s" }} />
      <Settings className="floating-icon top-[68%] left-[35%] text-[#ff5722] opacity-15" size={26} style={{ animationDelay: "2.3s" }} />
      <Wrench className="floating-icon top-[75%] left-[48%] text-[#ff5722] opacity-20" size={28} style={{ animationDelay: "0.2s" }} />
      <Lightbulb className="floating-icon top-[62%] left-[60%] text-[#ff5722] opacity-15" size={26} style={{ animationDelay: "3.6s" }} />
      <Camera className="floating-icon top-[70%] right-[22%] text-[#ff5722] opacity-20" size={30} style={{ animationDelay: "1.7s" }} />
      <Tv className="floating-icon top-[65%] right-[8%] text-[#ff5722] opacity-15" size={28} style={{ animationDelay: "4.8s" }} />

      {/* --- একদম নিচের অংশ (Bottom Area) --- */}
      <Laptop className="floating-icon top-[88%] left-[8%] text-[#ff5722] opacity-20" size={30} style={{ animationDelay: "2.1s" }} />
      <Wifi className="floating-icon top-[85%] left-[25%] text-[#ff5722] opacity-15" size={26} style={{ animationDelay: "4.2s" }} />
      <Smartphone className="floating-icon top-[92%] left-[40%] text-[#ff5722] opacity-20" size={28} style={{ animationDelay: "1.4s" }} />
      <ShieldCheck className="floating-icon top-[86%] left-[55%] text-[#ff5722] opacity-15" size={32} style={{ animationDelay: "3.9s" }} />
      <Hammer className="floating-icon top-[90%] right-[25%] text-[#ff5722] opacity-20" size={28} style={{ animationDelay: "0.6s" }} />
      <Music className="floating-icon top-[84%] right-[10%] text-[#ff5722] opacity-15" size={26} style={{ animationDelay: "2.8s" }} />
      <Cpu className="floating-icon top-[95%] right-[5%] text-[#ff5722] opacity-20" size={30} style={{ animationDelay: "4.7s" }} />
    </div>
  );
}