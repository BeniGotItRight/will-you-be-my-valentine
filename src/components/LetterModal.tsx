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
        className="glass p-10 sm:p-12 md:p-16 rounded-[4rem] shadow-2xl max-w-2xl w-full relative overflow-hidden border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
        
        <div className="relative z-10 text-white space-y-6 text-center leading-relaxed">
            <h2 className="text-4xl font-black italic text-red-500 mb-8 uppercase tracking-tighter">My Confession 💌</h2>
            <p className="text-lg md:text-xl font-medium text-gray-300 italic">
            "They say some connections are just meant to be, and I think ours is proving to be something truly special. Every moment we spend together and every conversation we have has made you one of the people I look forward to seeing most.
            </p>
            <p className="text-lg md:text-xl font-medium text-gray-300 italic">
            I appreciate every single laugh we share and how you've been there for me. You make my world much brighter, and I cherish the way we've grown so close.
            </p>
            <p className="text-lg md:text-xl font-medium text-gray-300 italic">
            Thank you for being such an incredible presence in my life, KENDYYY. I'm so lucky to have you, and I can't wait to see where our journey takes us and all the new memories we'll create together.
            </p>
            <p className="text-2xl font-black text-white mt-12">
            You're truly special to me, KENDYYY.
            </p>
            <div className="pt-10 flex justify-end">
              <div className="text-right">
                <p className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-1">Always Yours,</p>
                <p className="text-4xl font-black italic text-red-500 tracking-tighter">Benson</p>
              </div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LetterModal;
