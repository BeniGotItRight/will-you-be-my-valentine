import { useState } from 'react';
import { motion } from 'framer-motion';

export const SpicyScratch = () => {
  const [scratched, setScratched] = useState(false);
  const secret = "Tonight, you belong to me completely. 🫦";

  return (
    <div className="relative w-64 h-32 bg-gray-800 rounded-2xl overflow-hidden cursor-pointer" onClick={() => setScratched(true)}>
      {!scratched ? (
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white font-bold text-xl uppercase tracking-widest">
          Scratch to reveal...
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center p-4 text-center text-red-500 font-bold italic">
          {secret}
        </motion.div>
      )}
    </div>
  );
};

export const NastySlot = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("???");
  const options = ["Bite", "Kiss", "Tease", "Tie", "Blindfold", "Lick"];

  const spin = () => {
    setSpinning(true);
    setTimeout(() => {
      setResult(options[Math.floor(Math.random() * options.length)]);
      setSpinning(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-48 h-24 bg-black border-4 border-red-600 rounded-3xl flex items-center justify-center">
        <motion.span 
          key={result}
          animate={spinning ? { y: [0, -20, 20, 0] } : {}}
          transition={{ repeat: spinning ? Infinity : 0, duration: 0.1 }}
          className="text-4xl text-white font-black uppercase italic tracking-tighter"
        >
          {spinning ? "???" : result}
        </motion.span>
      </div>
      <button onClick={spin} disabled={spinning} className="bg-red-600 text-white px-8 py-2 rounded-full font-bold uppercase shadow-lg shadow-red-600/30">Spin for a Dare</button>
    </div>
  );
};

export const MoodMap = () => {
  const [mood, setMood] = useState<string | null>(null);
  const moods = [
    { name: 'Hungry', color: 'bg-red-900', text: 'I want to devour every inch of you. 👄' },
    { name: 'Teasing', color: 'bg-pink-600', text: 'I am going to make you beg tonight. 🫦' },
    { name: 'Needing', color: 'bg-red-700', text: 'I can\'t breathe without you touching me. 🔥' },
    { name: 'Dominant', color: 'bg-black', text: 'You are doing exactly what I say. 👑' }
  ];

  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-2 gap-2">
        {moods.map(m => (
          <button 
            key={m.name}
            onClick={() => setMood(m.text)}
            className={`${m.color} p-4 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-transform active:scale-95`}
          >
            {m.name}
          </button>
        ))}
      </div>
      {mood && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 p-4 rounded-2xl border border-white/20">
          <p className="text-white italic font-bold">"{mood}"</p>
        </motion.div>
      )}
    </div>
  );
};
