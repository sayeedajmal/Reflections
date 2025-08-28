import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, PenTool } from "lucide-react";
import heroWorkspace from "@/assets/hero-workspace.jpg";
import heroReading from "@/assets/hero-reading.jpg";
import heroDigital from "@/assets/hero-digital.jpg";

const heroImages = [
  {
    src: heroWorkspace,
    alt: "Modern workspace for writers",
  },
  {
    src: heroReading,
    alt: "Cozy reading environment",
  },
  {
    src: heroDigital,
    alt: "Digital writing interface",
  },
];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scrollToContent = () => {
    const contentSection = document.getElementById("recent-posts");
    contentSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 hero-gradient" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="animate-fade-in">
          <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Reflections
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Where thoughts become timeless stories. Share your reflections with the world.
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 h-auto font-semibold transition-spring hover-glow"
          >
            <PenTool className="mr-2 h-5 w-5" />
            Start Writing
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={scrollToContent}
          className="flex flex-col items-center text-foreground/70 hover:text-foreground transition-smooth group"
          aria-label="Scroll to content"
        >
          <span className="text-sm mb-2 font-medium">Discover</span>
          <ChevronDown className="w-6 h-6 animate-bounce group-hover:text-primary" />
        </button>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 right-8 z-10 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-smooth ${
              index === currentImageIndex
                ? "bg-primary"
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}