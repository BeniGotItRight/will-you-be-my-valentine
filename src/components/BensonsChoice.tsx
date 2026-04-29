import { useState } from 'react';
import { motion } from 'framer-motion';

const choices = [
  { category: "Mood", options: ["Playful", "Obsessed", "Surrendered", "Wild"] },
  { category: "Dress Code", options: ["Silk", "Lace", "His Shirt", "Nothing"] },
  { category: "Activity", options: ["Whispering", "Slow Dancing", "Total Control", "Midnight Drive"] }
];

const BensonsChoice = () => {
  const [selections, setSelections] = useState<Record<string, string>>({});

  const pickForHer = (category: string) => {
    const options = choices.find(c => c.category === category)?.options || [];
    const random = options[Math.floor(Math.random() * options.length)];
    setSelections(prev => ({ ...prev, [category]: random }));
  };

  return (
    <div className="space-y-8 w-full max-w-sm">
      <h2 className="text-3xl font-black uppercase italic text-red-500">Benson's Choice 👑</h2>
      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">"I've decided how tonight goes, KENDYYY..."</p>
      
      <div className="space-y-4">
        {choices.map(c => (
          <div key={c.category} className="flex flex-col gap-2">
            <button 
              onClick={() => pickForHer(c.category)}
              className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between group hover:border-red-600 transition-all"
            >
              <span className="font-bold text-gray-400 uppercase text-xs">{c.category}</span>
              <span className="text-red-500 font-black group-hover:scale-110 transition-transform">
                {selections[c.category] || "TAP TO REVEAL"}
              </span>
            </button>
          </div>
        ))}
      </div>

      {Object.keys(selections).length === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 bg-red-600/10 rounded-3xl border border-red-600/30">
          <p className="text-white italic font-bold">"Now you know exactly what I'm thinking. See you soon. 🫦"</p>
        </motion.div>
      )}
    </div>
  );
};

export default BensonsChoice;
