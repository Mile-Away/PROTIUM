'use client';
/* eslint-disable @next/next/no-img-element */
// `app/page.tsx` is the UI for the `/` URL

import FeatureOfAbout from '@/components/homepage/FeatureOfAbout';
import FeatureOfChat from '@/components/homepage/FeatureOfChat';
import Footer from '@/components/homepage/Footer';
import Hero from '@/components/homepage/Hero';
import Sponsor from '@/@brand/Sponsor';
import Navbar from '@/components/navbar/Navbar';

export default function Page() {
  return (
    <div className="flex flex-col">
      {/* <Header /> */}
      <Navbar />
      <Hero />
      <FeatureOfAbout />

      {/* <FeatureOfChat /> */}
      {/* <FeatureOfServer /> */}
      {/* <FeatureOfBlog /> */}
      <Sponsor />
      <Footer />
    </div>
  );
}
