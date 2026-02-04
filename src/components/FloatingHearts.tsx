import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; left: number; delay: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev,
        {
          id: Date.now(),
          left: Math.random() * 100,
          delay: Math.random() * 0.5,
        },
      ]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Clean up old hearts to prevent memory leaks (optional, but good practice)
  useEffect(() => {
    const interval = setInterval(() => {
        setHearts(prev => prev.filter(h => Date.now() - h.id < 6000));
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: '100vh', opacity: 0, scale: 0.5 }}
            animate={{ y: '-10vh', opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5, ease: 'easeOut', delay: heart.delay }}
            style={{
              position: 'absolute',
              left: `${heart.left}%`,
            }}
            className="text-pink-300/40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
              className="w-8 h-8 md:w-12 md:h-12 drop-shadow-sm"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingHearts;
