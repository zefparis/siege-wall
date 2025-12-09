import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SecurityLayers from "@/components/SecurityLayers";
import HallOfShame from "@/components/HallOfShame";
import LiveTerminal from "@/components/LiveTerminal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <SecurityLayers />
      <HallOfShame />
      <LiveTerminal />
      <Footer />
    </main>
  );
}
