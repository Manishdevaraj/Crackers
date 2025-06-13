//@ts-nocheck


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";
import { useFirebase } from "@/Services/context";
import { useEffect, useState } from "react";

const HeroCarousel = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [urls, setUrls] = useState<string[]>([]); // Specify the array of strings

  const { getBannerUrls } = useFirebase();

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

  useEffect(() => {
    const getUrls = async () => {
      const data = await getBannerUrls();
      // Assuming bannerImages is in the first element
      if (data && data.length > 0 && data[0].bannerImages) {
        setUrls(data[0].bannerImages); // 👈 Fix here
      }
    };
    getUrls();
  }, []);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }} className="w-full h-[70vh]">
      <CarouselContent>
        {urls?.map((url, index) => (
         <CarouselItem className="w-full h-[90vh]" key={index}>
  <div className="w-full h-full flex justify-center items-center bg-white">
    <img
      src={url}
      alt={`banner-${index}`}
      className="w-full max-h-full object-contain" // <--- This is the likely culprit
    />
  </div>
</CarouselItem>

        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default HeroCarousel;
