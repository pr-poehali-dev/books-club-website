import { useState } from "react";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import MainSections from "@/components/MainSections";
import BookRandomizer from "@/components/BookRandomizer";
import TailSections from "@/components/TailSections";

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <NavBar
        activeSection={activeSection}
        mobileOpen={mobileOpen}
        onNav={scrollTo}
        onToggleMobile={() => setMobileOpen(!mobileOpen)}
      />
      <HeroSection onScrollTo={scrollTo} />
      <MainSections />
      <BookRandomizer />
      <TailSections />
    </div>
  );
}