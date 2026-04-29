import { useState } from 'react';
import { motion } from 'framer-motion';

const questions = {
  truth: [
    "What was your very first impression of me?",
    "When did you first realize you had feelings for me?",
    "What's one thing you've never told me before?",
    "What's the 'nastiest' thought you've ever had about us?",
    "Which part of me do you find the most irresistible?",
    "What's your favorite memory of us being alone together?"
  ],
  dare: [
    "Send a voice note of you saying something sweet.",
    "Send a selfie of your best 'I miss you' face.",
    "Whisper a secret into the microphone.",
    "Describe what you'd do to me right now if there were no rules.",
    "Show me exactly where you want me to touch you next.",
    "Send me a text of your 'nasty' outfit idea."
  ],
  wyr: [
    "Would you rather always hold my hand or always get my hugs?",
    "Would you rather have a cozy night in or a wild adventure out?",
    "Would you rather see me every day for an hour or once a week for a full day?",
    "Would you rather have a slow passionate night or something fast and 'nasty'?",
    "Would you rather let me take total control or you take control?",
    "Would you rather I whisper in your ear or kiss your neck?"
  ],
  spicy: [
    "What's the one thing I could do right now that would make you lose control?",
    "Describe your perfect 'nasty' night with me in detail.",
    "If we were alone in a locked room for 1 hour, what's the first thing you'd do to me?",
    "What's your wildest, most 'nasty' fantasy involving just the two of us?",
    "What's the most provocative thing you've ever thought about doing with me?",
    "Would you rather have a slow, romantic night or something much more intense and 'nasty'?",
    "What part of my body are you most 'obsessed' with right now?",
    "Describe the feeling you get when I'm being 'nasty' with you.",
    "If you had to pick one 'nasty' order for me to follow right now, what would it be?",
    "What's the 'dirtiest' thing you've ever imagined us doing in public?"
  ]
};

const TogetherGame = () => {
  const [category, setCategory] = useState<keyof typeof questions | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [p1Answer, setP1Answer] = useState('');
  const [p2Answer, setP2Answer] = useState('');
  const [showAnswers, setShowAnswers] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Answer copied! Send it to your partner. 💋");
  };

  const handleNext = () => {
    if (category) {
      if (qIndex < questions[category].length - 1) {
        setQIndex(prev => prev + 1);
        setP1Answer('');
        setP2Answer('');
        setShowAnswers(false);
      } else {
        setCategory(null);
        setQIndex(0);
      }
    }
  };

  if (!category) {
    return (
      <div className="space-y-6">
        <h2 className="text-4xl text-[#FF4D6D] font-display font-bold">Together Corner 🥂</h2>
        <p className="text-gray-600 italic">Pick a category to play together...</p>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(questions).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat as any)}
              className="bg-white/60 p-6 rounded-2xl border-2 border-[#FF4D6D]/10 hover:border-[#FF4D6D] capitalize font-bold text-[#FF4D6D] shadow-sm hover:shadow-md transition-all"
            >
              {cat === 'wyr' ? 'Would You Rather' : cat}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentQ = questions[category][qIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col h-[100dvh] w-screen overflow-hidden">
      {/* Top Half - Benson */}
      <div className="flex-1 border-b-4 border-[#FF4D6D]/20 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-4 left-4 bg-[#FF4D6D] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Benson's Side</div>
        <div className="w-full max-w-md">
           {showAnswers ? (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-body font-bold text-[#FF4D6D]">"{p1Answer}"</motion.div>
           ) : (
             <div className="space-y-2">
                <textarea 
                  value={p1Answer}
                  onChange={(e) => setP1Answer(e.target.value)}
                  placeholder="Benson, type your answer here..."
                  className="w-full bg-white/10 p-4 rounded-2xl border-2 border-dashed border-[#FF4D6D]/20 outline-none h-24 text-white text-lg font-bold placeholder:text-white/20"
                />
                <button onClick={() => copyToClipboard(p1Answer)} className="text-xs text-[#FF4D6D]/60 hover:text-[#FF4D6D]">Copy to send online ↗️</button>
             </div>
           )}
        </div>
      </div>

      {/* Question Bar */}
      <div className="bg-[#FF4D6D] text-white p-4 shadow-xl z-10 text-center flex flex-col items-center gap-2">
        <p className="text-xs font-bold opacity-80 uppercase tracking-widest">{category === 'wyr' ? 'Would You Rather' : category}</p>
        <h3 className="text-xl font-bold">{currentQ}</h3>
        <div className="flex gap-4 mt-2">
           {!showAnswers ? (
             <button 
               onClick={() => setShowAnswers(true)}
               disabled={!p1Answer && !p2Answer}
               className="bg-white text-[#FF4D6D] px-6 py-2 rounded-full font-bold shadow-lg disabled:opacity-50"
             >
               Reveal Both
             </button>
           ) : (
             <button onClick={handleNext} className="bg-white text-[#FF4D6D] px-6 py-2 rounded-full font-bold shadow-lg">Next Question</button>
           )}
           <button onClick={() => setCategory(null)} className="text-white underline text-sm">Exit Game</button>
        </div>
      </div>

      {/* Bottom Half - KENDYYY */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute bottom-4 right-4 bg-[#FF4D6D] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">KENDYYY's Side</div>
        <div className="w-full max-w-md">
           {showAnswers ? (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-body font-bold text-[#FF4D6D]">"{p2Answer}"</motion.div>
           ) : (
             <div className="space-y-2 text-right">
                <textarea 
                  value={p2Answer}
                  onChange={(e) => setP2Answer(e.target.value)}
                  placeholder="KENDYYY, type your answer here..."
                  className="w-full bg-white/10 p-4 rounded-2xl border-2 border-dashed border-[#FF4D6D]/20 outline-none h-24 text-white text-lg font-bold placeholder:text-white/20"
                />
                <button onClick={() => copyToClipboard(p2Answer)} className="text-xs text-[#FF4D6D]/60 hover:text-[#FF4D6D]">Copy to send online ↗️</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default TogetherGame;
