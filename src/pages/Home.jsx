import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import ProcessSection from '../components/sections/ProcessSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-background-900">
      <HeroSection />
      <ProcessSection />
    </div>
  );
};

export default Home;