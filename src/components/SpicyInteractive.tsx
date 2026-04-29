import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../hooks/useAppState';

export const SpicyScratch = () => {
  const { appState, updateAppState } = useAppState();
  if (!appState) return <div>Syncing...</div>;
  const scratched = appState.scratch_revealed;
  const secret = "Tonight, you belong to me completely. No safeword. 😈";

  return (
    <div className="relative w-72 h-40 bg-gray-900 rounded-3xl overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.2)] border border-red-900" onClick={() => updateAppState({ scratch_revealed: true })}>
      {!scratched ? (
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-black flex items-center justify-center text-white font-black text-2xl uppercase tracking-widest p-4 text-center leading-tight hover:scale-105 transition-transform">
          Scratch to reveal...
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center p-6 text-center text-red-500 font-black italic text-xl leading-tight bg-black">
          {secret}
        </motion.div>
      )}
    </div>
  );
};

export const NastySlot = () => {
  const { appState, updateAppState } = useAppState();
  const [spinning, setSpinning] = useState(false);
  
  if (!appState) return <div>Syncing...</div>;
  const result = appState.slot_result;
  const options = ["Gag", "Choke", "Beg", "Edge", "Spank", "Worship", "Punish", "Degrade"];

  const spin = () => {
    setSpinning(true);
    // Fake local spin effect
    setTimeout(() => {
      const random = options[Math.floor(Math.random() * options.length)];
      updateAppState({ slot_result: random });
      setSpinning(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-64 h-32 bg-black border-4 border-red-600 rounded-[2rem] shadow-[0_0_40px_rgba(220,38,38,0.5)] flex items-center justify-center overflow-hidden">
        <motion.span 
          key={result + (spinning ? "spin" : "")}
          animate={spinning ? { y: [0, -40, 40, 0], opacity: [1, 0.5, 1] } : {}}
          transition={{ repeat: spinning ? Infinity : 0, duration: 0.15 }}
          className="text-5xl text-red-500 font-black uppercase italic tracking-tighter"
        >
          {spinning ? "😈🔥💦" : result}
        </motion.span>
      </div>
      <button onClick={spin} disabled={spinning} className="bg-red-600 text-white px-10 py-4 rounded-full font-black uppercase shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:scale-105 transition-transform disabled:opacity-50 tracking-widest text-lg">
        Pull Lever
      </button>
    </div>
  );
};

export const MoodMap = () => {
  const { appState, updateAppState } = useAppState();
  if (!appState) return <div>Syncing...</div>;
  
  const mood = appState.mood;
  const moods = [
    { name: 'Predatory', color: 'bg-red-950 border border-red-500/50', text: 'I am hunting you tonight. Run if you want, I will catch you. 🐺' },
    { name: 'Sadistic', color: 'bg-black border border-red-500', text: 'I want to see you cry just a little bit. 😈' },
    { name: 'Possessive', color: 'bg-red-900 border border-black', text: 'You are my property. Do not forget it. 🔒' },
    { name: 'Demanding', color: 'bg-red-800 border border-white/20', text: 'On your knees. Now. 👑' }
  ];

  return (
    <div className="space-y-6 w-full max-w-sm">
      <div className="grid grid-cols-2 gap-3">
        {moods.map(m => (
          <button 
            key={m.name}
            onClick={() => updateAppState({ mood: m.text })}
            className={`${m.color} p-5 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-transform active:scale-95 shadow-xl hover:shadow-red-500/20`}
          >
            {m.name}
          </button>
        ))}
      </div>
      {mood && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-950/40 p-6 rounded-3xl border-2 border-red-500/30 shadow-2xl backdrop-blur-sm">
          <p className="text-white italic font-black text-lg">"{mood}"</p>
        </motion.div>
      )}
    </div>
  );
};
