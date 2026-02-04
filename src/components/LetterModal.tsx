import { motion } from 'framer-motion';

interface LetterModalProps {
  isOpen: boolean;
}

const LetterModal = ({ isOpen }: LetterModalProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="bg-white/90 backdrop-blur-md rounded-lg shadow-2xl max-w-lg w-full p-8 md:p-12 relative overflow-hidden border border-white/50"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-100/30 to-transparent pointer-events-none" />
        
        <div className="relative z-10 text-gray-800 space-y-6 text-center md:text-left">
            <p className="font-serif text-lg leading-relaxed text-gray-700 italic">
            "Distance is just a test to see how far love can travel, and honestly? Ours has already gone the distance. Even though we met through a screen and there are miles between us today, you feel closer to me than anything else in my world.
            </p>
            <p className="font-serif text-lg leading-relaxed text-gray-700 italic">
            I hate that I can’t reach out and hold your hand today, or see that specific look in your eyes when you laugh in person. But even across the distance, you’ve managed to become my favorite person, my safest space, and the best part of my day.
            </p>
            <p className="font-serif text-lg leading-relaxed text-gray-700 italic">
            Every pixel of you is worth the wait. Every late-night call and every "I miss you" text is just a countdown to the moment we finally don't have to say goodbye to a screen anymore.
            </p>
            <p className="font-serif text-lg leading-relaxed text-gray-700 italic">
            Thank you for choosing me, even from far away. You are my Valentine today, tomorrow, and every day until I’m finally standing right in front of you.
            </p>
            <p className="font-serif text-lg leading-relaxed text-gray-700 font-semibold mt-8">
            I love you, Felicity.
            </p>
            <p className="font-serif text-lg leading-relaxed text-gray-700 mt-2 text-right">
            Always yours,<br/>Benson
            </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LetterModal;
