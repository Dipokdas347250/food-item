"use client";

import Hero from "@/components/home/Hero";
import CuisineCards from "@/components/home/CuisineCards";
import PopularDishes from "@/components/home/PopularDishes";
import OfferBanner from "@/components/home/OfferBanner";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function HomeView() {
  return (
    <>
      <Hero />
      <CuisineCards />
      <PopularDishes />
      <OfferBanner />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
    </>
  );
}
