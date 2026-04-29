import { motion } from 'framer-motion';

const reasons = [
  "The way you make me lose focus just by walking into the room.",
  "That 'nasty' look in your eyes that tells me exactly what you're thinking.",
  "The way your touch sends electricity through my entire body.",
  "How you're the only person who can satisfy my wildest thoughts.",
  "The way you look in your most 'special' outfits.",
  "That irresistible energy you have that keeps me coming back for more.",
  "How you're the perfect mix of sweet and 'nasty'.",
  "The way you know exactly how to drive me crazy without saying a word.",
  "Because you're my favorite addiction, KENDYYY.",
  "Simply because I want you more than anything else in this world."
];

const ReasonList = () => {
  return (
    <div className="space-y-4 max-h-[50vh] overflow-y-auto p-4 custom-scrollbar">
      {reasons.map((reason, index) => (
        <motion.div
          key={index}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.3 }}
          className="bg-white/40 backdrop-blur-md p-4 rounded-xl shadow-sm border-l-4 border-[#FF4D6D] text-left"
        >
          <p className="text-[#FF4D6D] font-bold text-lg inline-block mr-2">{index + 1}.</p>
          <span className="text-gray-800 font-body">{reason}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default ReasonList;
