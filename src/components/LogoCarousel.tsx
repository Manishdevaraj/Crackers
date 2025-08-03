// @ts-nocheck
import { motion } from "framer-motion";

const logos =[
  '/public/brandlogos/BHEEMA.png',
  '/public/brandlogos/damo.png',
  '/public/brandlogos/kalis.png',
  '/public/brandlogos/mothers.png',
  '/public/brandlogos/RAMESH SPARKLERS.png',
  '/public/brandlogos/sparkle logo.png',
  '/public/brandlogos/sparkle.jpg',
  '/public/brandlogos/standered logo 2  copy.png',
  '/public/brandlogos/starvell.png'


]

const duplicatedLogos = [...logos, ...logos]; // for infinite scroll

const LogoCarousel = () => {
  return (
    <div className="overflow-hidden py-6 bg-white">
      <motion.div
        className="flex gap-12 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
      >
        {duplicatedLogos.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`logo-${index}`}
            className="h-16 w-auto object-contain"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LogoCarousel;
