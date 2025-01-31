import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import BeatPlaylist from "@/components/BeatPlaylist";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <BeatPlaylist />
      <Blog />
      <Footer />
    </div>
  );
};

export default Index;