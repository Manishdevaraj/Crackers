// @ts-nocheck
import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useFirebase } from "@/Services/context";
import { MdOutlineDownloadForOffline } from "react-icons/md";

const SwipeCards = () => {
  const [cards, setCards] = useState([]);
  const [stack1, setStack1] = useState([]);
  const [stack2, setStack2] = useState([]);
  const [stack3, setStack3] = useState([]);

  const { getSparklerProducts, toggleCart } = useFirebase();

  const getRandomStack = (arr, count = 3, avoidIds = []) => {
    const filtered = arr.filter(item => !avoidIds.includes(item.id));
    const base = filtered.length >= count ? filtered : arr;
    const shuffled = [...base].sort(() => Math.random() - 0.5);
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(shuffled[i % shuffled.length]);
    }
    return result;
  };

  const normalizeCards = (arr) => {
    if (arr.length === 0) return [];
    if (arr.length === 1) return [arr[0], arr[0], arr[0]];
    if (arr.length === 2) return [arr[0], arr[1], arr[0]];
    return [...arr];
  };

  useEffect(() => {
    const fetchData = async () => {
      const products = await getSparklerProducts();
      const safeCards = normalizeCards(products);
      setCards(safeCards);
      setStack1(getRandomStack(safeCards));
      setStack2(getRandomStack(safeCards));
      setStack3(getRandomStack(safeCards));
    };
    fetchData();
  }, []);

  // Independent stack reset handlers
  const resetStack = async (setter) => {
    const products = await getSparklerProducts();
    const safeCards = normalizeCards(products);
    setter(getRandomStack(safeCards));
  };

  // Stack 1 reset
  useEffect(() => {
    if (stack1.length === 0) {
      const timeout = setTimeout(() => resetStack(setStack1), 500);
      return () => clearTimeout(timeout);
    }
  }, [stack1]);

  // Stack 2 reset
  useEffect(() => {
    if (stack2.length === 0) {
      const timeout = setTimeout(() => resetStack(setStack2), 1000);
      return () => clearTimeout(timeout);
    }
  }, [stack2]);

  // Stack 3 reset
  useEffect(() => {
    if (stack3.length === 0) {
      const timeout = setTimeout(() => resetStack(setStack3), 1500);
      return () => clearTimeout(timeout);
    }
  }, [stack3]);

  return (<>
          <h1 className="font-bold text-2xl ml-10 mt-2 ">✨ Combo Box</h1>
    <div className="hidden md:flex flex-wrap justify-center gap-4 mt-5">

      {[stack1, stack2, stack3].map((stack, idx) => (
        <div key={idx} className="relative w-[300px] h-[500px] mx-auto">
          {stack.map((card, i) => (
            <Card
              key={card.id + "-" + i}
              index={i}
              cards={stack}
              setCards={[setStack1, setStack2, setStack3][idx]}
              product={card}
              toggleCart={toggleCart}
              autoSwipeDelay={3000 + idx * 1000} // Different delay per stack
            />
          ))}
        </div>
      ))}
    </div>
    <div className="md:hidden flex flex-wrap justify-center gap-4 mt-5">

      {[stack1].map((stack, idx) => (
        <div key={idx} className="relative w-[300px] h-[500px] mx-auto">
          {stack.map((card, i) => (
            <Card
              key={card.id + "-" + i}
              index={i}
              cards={stack}
              setCards={setStack1}
              product={card}
              toggleCart={toggleCart}
              autoSwipeDelay={3000 + idx * 1000} // Different delay per stack
            />
          ))}
        </div>
      ))}
    </div>
    </>
  );
};

const Card = ({ product, cards, setCards, index, toggleCart, autoSwipeDelay }) => {
  const { productImageURL } = product;
  const x = useMotionValue(0);
  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = index === cards.length - 1;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : index % 2 ? 6 : -6;
    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    setCards((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    if (!isFront) return;

    const timeout = setTimeout(() => {
      animate(x, 200, {
        duration: 0.4,
        onComplete: () => handleDragEnd(),
      });
    }, autoSwipeDelay || 3000);

    return () => clearTimeout(timeout);
  }, [isFront]);

  const zIndex = 10 + index;
  const scale = isFront ? 1 : index === cards.length - 2 ? 0.95 : 0.9;
  const translateY =
    index === cards.length - 2
      ? "-translate-y-2"
      : index === cards.length - 3
      ? "-translate-y-4"
      : "";

  return (
    <motion.div
      className={`absolute top-0 left-0 right-0 mx-auto h-96 w-72 origin-bottom rounded-lg bg-white shadow-md overflow-hidden transition-transform ${translateY}`}
      style={{
        x,
        opacity,
        rotate,
        scale,
        zIndex,
      }}
      animate={{
        scale: isFront ? 1 : scale,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={() => {
        if (Math.abs(x.get()) > 100) {
          handleDragEnd();
        }
      }}
    >
      <img
        src={productImageURL}
        alt="Card"
        className="h-full w-full object-contain"
      />

      <a
        href={productImageURL}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-red-500 text-white p-2 rounded-full hover:bg-black transition"
        title="Download"
      >
        <MdOutlineDownloadForOffline />
      </a>

      <button
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-yellow-400 to-red-500 text-white rounded shadow hover:bg-blue-700 transition"
        onClick={() => toggleCart(product)}
      >
        Add to Cart
      </button>
    </motion.div>
  );
};

export default SwipeCards;
