import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { UserTypesSection } from './UserTypesSection';
import { CtaSection } from './CtaSection';
import { Footer } from './Footer';

export const LandingPage = () => {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <UserTypesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};
