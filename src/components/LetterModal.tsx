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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/20 backdrop-blur-[2px] overflow-y-auto"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="bg-white/90 backdrop-blur-md rounded-lg shadow-2xl max-w-md w-full p-4 sm:p-6 md:p-8 my-4 relative overflow-hidden border border-white/50 max-h-[90vh] overflow-y-auto"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-100/30 to-transparent pointer-events-none" />
        
        <div className="relative z-10 text-gray-800 space-y-3 sm:space-y-4 text-center md:text-left">
            <p className="font-serif text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 italic">
            "They say some connections are just meant to be, and I think ours is proving to be something truly special. Every moment we spend together and every conversation we have has made you one of the people I look forward to seeing most.
            </p>
            <p className="font-serif text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 italic">
            I appreciate every single laugh we share and how you've been there for me. You make my world much brighter, and I cherish the way we've grown so close.
            </p>
            <p className="font-serif text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 italic">
            Thank you for being such an incredible presence in my life, KENDYYY. I'm so lucky to have you, and I can't wait to see where our journey takes us and all the new memories we'll create together.
            </p>
            <p className="font-serif text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 font-semibold mt-4 sm:mt-6">
            You're truly special to me, KENDYYY.
            </p>
            <p className="font-serif text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 mt-2 text-right">
            Always,<br/>Benson
            </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LetterModal;
