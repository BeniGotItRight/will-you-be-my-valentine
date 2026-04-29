import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingHearts from './components/FloatingHearts';
import LetterModal from './components/LetterModal';
import Gallery from './components/Gallery';
import ReasonList from './components/ReasonList';
import AccessPage from './components/AccessPage';
import TogetherGame from './components/TogetherGame';
import BensonsChoice from './components/BensonsChoice';
import { SpicyScratch, NastySlot, MoodMap } from './components/SpicyInteractive';

// 113 STAGES: 10% Sweet, 70% Nasty, 20% Extreme
type Stage = 
  | 'intro' | 'timeline' | 'reasons' | 'pics' | 'garden' | 'playlist' | 'hug' 
  | 'destination' | 'compliment' | 'promise' | 'together' | 'touchmap' | 'blindfold' 
  | 'whisper' | 'temperature' | 'challenge' | 'confession' | 'outfit' | 'sensory' 
  | 'countdown' | 'fantasy' | 'pleasurepath' | 'command' | 'redroom' | 'pulsesync' 
  | 'bensonschoice' | 'spicyslot' | 'spicyscratch' | 'moodmap'
  | `alphabet_${string}` | `order_${number}` | `fact_${number}` | `memory_${number}` | `question_${number}`
  | 'contract' | 'breathless' | 'blind2' | 'whisperwall' | 'radar' 
  | 'wheel' | 'secretfolder' | 'finaltest' | 'ascend1' | 'ascend2' | 'ascend3' 
  | 'ascend4' | 'ascend5' | 'ascend6' | 'ascend7' | 'obsession' | 'labyrinth' 
  | 'deep1' | 'deep2' | 'deep3' | 'deep4' | 'deep5' | 'deep6' | 'deep7' | 'deep8' | 'deep9' | 'deep10'
  | 'todolist' | 'diary' | 'overload' | 'timer' | 'moodring' 
  | `descent${number}`
  | 'finalsecret' | 'quiz' | 'future' | 'ask' | 'celebrate' | 'letter' 
  | 'outro1' | 'outro2' | 'outro3' | 'outro4';

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const stages: Stage[] = [
  'intro', 'timeline', 'reasons', 'pics', 'garden', 'playlist', 'hug', 'destination', 'compliment', 'promise', // 1-10 (Sweet)
  'together', 'touchmap', 'blindfold', 'whisper', 'temperature', 'challenge', 'confession', 'outfit', 'sensory', 'countdown', // 11-20
  'fantasy', 'pleasurepath', 'command', 'redroom', 'pulsesync', 'bensonschoice', 'spicyslot', 'spicyscratch', 'moodmap', // 21-29
  ...alphabet.map(l => `alphabet_${l}` as Stage), // 30-55 (26 pages)
  ...[1,2,3,4,5,6,7,8,9,10].map(n => `order_${n}` as Stage), // 56-65
  ...[1,2,3,4,5].map(n => `fact_${n}` as Stage), // 66-70
  ...[1,2,3,4,5].map(n => `memory_${n}` as Stage), // 71-75
  ...[1,2,3,4,5].map(n => `question_${n}` as Stage), // 76-80 (Total Nasty: 70 pages)
  'contract', 'breathless', 'blind2', 'whisperwall', 'radar', 'wheel', 'secretfolder', 'finaltest', // 81-88
  'ascend1', 'ascend2', 'ascend3', 'ascend4', 'ascend5', 'ascend6', 'ascend7', 'obsession', 'labyrinth', // 89-97
  'deep1', 'deep2', 'deep3', 'deep4', 'deep5', 'deep6', 'deep7', 'deep8', 'deep9', 'deep10', // 98-107
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map(n => `descent${n}` as Stage), // 108-125
  'finalsecret', 'ask', 'celebrate', 'letter', 'outro1', 'outro2', 'outro3', 'outro4'
];

function App() {
  const [hasAccess, setHasAccess] = useState(false);
  const [bensonNickname, setBensonNickname] = useState('');
  const [stageIndex, setStageIndex] = useState(0);
  const stage = stages[stageIndex];
  const [noCount, setNoCount] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ top: 'auto', left: 'auto', position: 'static' as any });
  const [flowers, setFlowers] = useState<{x: number, y: number, id: number}[]>([]);
  const [temp, setTemp] = useState(50);
  const audioRef = useRef<HTMLAudioElement>(null);

  const nextStage = () => { if (stageIndex < stages.length - 1) setStageIndex(prev => prev + 1); };
  const prevStage = () => { if (stageIndex > 0) setStageIndex(prev => prev - 1); };

  const moveNoButton = () => {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    setNoButtonPos({ position: 'fixed', top: `${y}px`, left: `${x}px` });
    setNoCount(prev => prev + 1);
  };

  const addFlower = (e: React.MouseEvent) => {
    const newFlower = { x: e.clientX, y: e.clientY, id: Date.now() };
    setFlowers(prev => [...prev, newFlower]);
  };

  const handleYes = () => {
    setStageIndex(stages.indexOf('celebrate'));
    confetti({ particleCount: 200, spread: 90 });
    if (audioRef.current) audioRef.current.play().catch(e => console.log(e));
    setTimeout(() => setStageIndex(stages.indexOf('letter')), 4000);
  };

  if (!hasAccess) return <AccessPage onAccessGranted={(nick) => { setBensonNickname(nick); setHasAccess(true); }} />;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center relative bg-[#0a0a0a] text-white overflow-hidden selection:bg-red-600 selection:text-white font-sans">
      <div className="noise-bg" />
      <FloatingHearts />
      <div className="z-10 w-full max-w-lg px-6 flex flex-col items-center justify-center min-h-screen text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="w-full flex flex-col items-center justify-center py-10"
          >
            {stage === 'intro' && (
              <div className="space-y-6">
                <h1 className="text-5xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-tighter italic">70% NASTY 🫦</h1>
                <p className="text-gray-400 font-medium italic">"Nickname: {bensonNickname}"</p>
                <p className="text-lg font-bold">The experience has been re-balanced. Sweetness is now only 10%. The rest is for us.</p>
                <button onClick={nextStage} className="bg-red-600 text-white px-10 py-5 rounded-full text-2xl font-black shadow-[0_0_40px_rgba(220,38,38,0.4)]">ENTER THE CORE 😈</button>
              </div>
            )}

            {stage.startsWith('alphabet_') && (
              <div className="space-y-10">
                <h2 className="text-9xl font-black text-red-600 italic tracking-tighter opacity-20 absolute top-20 left-0 right-0">{stage.split('_')[1]}</h2>
                <h3 className="text-4xl font-black uppercase tracking-widest relative z-10">
                  {stage === 'alphabet_A' && 'Adoration & Arousal'}
                  {stage === 'alphabet_B' && 'Biting & Begging'}
                  {stage === 'alphabet_C' && 'Craving & Control'}
                  {stage === 'alphabet_D' && 'Dominance & Desire'}
                  {stage === 'alphabet_E' && 'Extremely Excited'}
                  {stage === 'alphabet_F' && 'Fantasies & Fever'}
                  {stage === 'alphabet_G' && 'Grips & Glances'}
                  {stage === 'alphabet_H' && 'Heat & Heartbeat'}
                  {stage === 'alphabet_I' && 'Intense & Irresistible'}
                  {stage === 'alphabet_J' && 'Just Yours'}
                  {stage === 'alphabet_K' && 'KENDYYY\'s Knees'}
                  {stage === 'alphabet_L' && 'Lust & Lips'}
                  {stage === 'alphabet_M' && 'Moans & Midnight'}
                  {stage === 'alphabet_N' && 'Nasty & Needing'}
                  {stage === 'alphabet_O' && 'Obsession & Orders'}
                  {stage === 'alphabet_P' && 'Pleasure & Power'}
                  {stage === 'alphabet_Q' && 'Quick & Quiet'}
                  {stage === 'alphabet_R' && 'Red Room & Rules'}
                  {stage === 'alphabet_S' && 'Screams & Silk'}
                  {stage === 'alphabet_T' && 'Teasing & Touching'}
                  {stage === 'alphabet_U' && 'Ultimate & Under'}
                  {stage === 'alphabet_V' && 'Very Nasty'}
                  {stage === 'alphabet_W' && 'Wild & Wet'}
                  {stage === 'alphabet_X' && 'X-Rated Thoughts'}
                  {stage === 'alphabet_Y' && 'You Are Mine'}
                  {stage === 'alphabet_Z' && 'Zero Limits'}
                </h3>
                <button onClick={nextStage} className="bg-red-600 px-8 py-2 rounded-full font-bold uppercase">Next Letter</button>
              </div>
            )}

            {stage.startsWith('order_') && (
              <div className="space-y-6">
                <h2 className="text-xs font-black text-red-500 uppercase tracking-widest">Nasty Order #{stage.split('_')[1]}</h2>
                <p className="text-3xl font-black italic text-white leading-tight">
                  {stage === 'order_1' && "You will text me your 'nasty' outfit idea."}
                  {stage === 'order_2' && "You will send a voice note whispering my name."}
                  {stage === 'order_3' && "You will tell me exactly where you want my hands."}
                  {stage === 'order_4' && "You will let me take total control tonight."}
                  {stage === 'order_5' && "You will wear something that makes me lose it."}
                  {stage === 'order_6' && "You will describe your wildest fantasy in detail."}
                  {stage === 'order_7' && "You will look me in the eyes and tell me you're mine."}
                  {stage === 'order_8' && "You will follow every single rule in the Red Room."}
                  {stage === 'order_9' && "You will beg me to stop teasing you."}
                  {stage === 'order_10' && "You will belong to me, and only me. Forever."}
                </p>
                <button onClick={nextStage} className="bg-red-600 px-10 py-3 rounded-full font-bold uppercase tracking-widest">I ACCEPT 🫦</button>
              </div>
            )}

            {(stage === 'timeline' || stage === 'reasons' || stage === 'pics' || stage === 'garden' || stage === 'playlist' || stage === 'hug' || stage === 'destination' || stage === 'compliment' || stage === 'promise' || stage === 'together') && (
               <div className="w-full space-y-6">
                  {stage === 'together' && <TogetherGame />}
                  {stage === 'garden' && (
                    <div className="w-full h-80 bg-red-900/10 rounded-[3rem] border-2 border-red-500/20 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden relative" onClick={addFlower}>
                      {flowers.map(f => <motion.span key={f.id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute text-2xl" style={{ left: f.x % 300, top: f.y % 300 }}>🌸</motion.span>)}
                      <h2 className="text-2xl font-black text-red-500 uppercase">THE GARDEN</h2>
                      <p className="text-xs opacity-60 uppercase tracking-widest">Tap to plant a memory ({flowers.length})</p>
                    </div>
                  )}
                  {stage === 'reasons' && <ReasonList />}
                  {stage === 'pics' && <Gallery />}
                  <div className="flex justify-center gap-4">
                    <button onClick={prevStage} className="text-xs text-gray-500 underline">Back</button>
                    <button onClick={nextStage} className="bg-red-600 px-10 py-3 rounded-full font-black uppercase tracking-tighter">Next Page</button>
                  </div>
               </div>
            )}

            {stage === 'bensonschoice' && <div className="w-full flex flex-col items-center"><BensonsChoice /><button onClick={nextStage} className="bg-red-600 px-10 py-3 rounded-full font-black uppercase tracking-tighter mt-10">ACCEPT CHOICE 🫦</button></div>}
            {stage === 'spicyslot' && <div className="space-y-8"><h2 className="text-3xl font-black uppercase italic">Nasty Slot Machine</h2><NastySlot /><button onClick={nextStage} className="text-red-500 font-bold underline">Next Page</button></div>}
            {stage === 'spicyscratch' && <div className="space-y-8"><h2 className="text-3xl font-black uppercase italic">Secret Scratch Card</h2><SpicyScratch /><button onClick={nextStage} className="text-red-500 font-bold underline">Next Page</button></div>}
            {stage === 'moodmap' && <div className="space-y-8 w-full"><h2 className="text-3xl font-black uppercase italic text-red-600">The Mood Map</h2><MoodMap /><button onClick={nextStage} className="bg-red-600 px-8 py-2 rounded-full font-bold uppercase mt-4">Next Page</button></div>}

            {(['touchmap','blindfold','whisper','temperature','challenge','confession','outfit','sensory','countdown','fantasy','pleasurepath','command','redroom','pulsesync','alphabet','heatmap','ultimatedare','tease','fact1','fact2','fact3','fact4','fact5','contract','breathless','blind2','whisperwall','radar','wheel','secretfolder','finaltest','ascend1','ascend2','ascend3','ascend4','ascend5','ascend6','ascend7'].includes(stage)) && (
              <div className="space-y-8 w-full">
                <h2 className="text-4xl font-black text-red-600 uppercase italic tracking-tighter shadow-red-500/20 drop-shadow-2xl">{stage.toUpperCase()}</h2>
                {stage === 'temperature' && (
                  <div className="bg-red-950/20 p-8 rounded-[3rem] border border-red-500/20 space-y-6">
                    <input type="range" min="0" max="100" value={temp} onChange={(e) => setTemp(parseInt(e.target.value))} className="w-full h-4 bg-red-900/30 rounded-full appearance-none accent-red-600 cursor-pointer" />
                    <p className="text-5xl font-black text-red-500 italic animate-pulse">{temp}%</p>
                    <p className="text-sm font-bold opacity-60 uppercase">{temp > 90 ? "CRITICAL HEAT LEVEL" : "INCREASING PRESSURE"}</p>
                  </div>
                )}
                <p className="text-gray-400 italic font-medium">"The heat is at 70%, KENDYYY..." {noCount > 0 && `(Missed: ${noCount})`}</p>
                <button onClick={nextStage} className="bg-red-600 text-white px-12 py-4 rounded-full font-black shadow-2xl">DEEPER 😈</button>
              </div>
            )}

            {stage.startsWith('deep') && (
              <div className="space-y-8 w-full">
                <h2 className="text-xs font-black text-red-600 uppercase tracking-[0.5em]">Extreme Confession #{stage.slice(4)}</h2>
                <div className="bg-red-950/40 p-12 rounded-[3.5rem] border-l-8 border-red-600 shadow-2xl backdrop-blur-md ring-1 ring-white/10">
                   <p className="text-3xl md:text-4xl font-black italic text-white leading-tight drop-shadow-lg">
                    {stage === 'deep1' && "I want to be the only thing you think about when you're alone. 🫦"}
                    {stage === 'deep2' && "I want to feel your heart pounding against my chest in the dark. 🌑"}
                    {stage === 'deep3' && "I want to leave a trail of kisses from your neck all the way down. 🔥"}
                    {stage === 'deep4' && "I want to explore every inch of you with my tongue. 👅"}
                    {stage === 'deep5' && "I want to hear you beg me not to stop. 👄"}
                    {stage === 'deep6' && "I want to take you in ways you've never been taken before. 😈"}
                    {stage === 'deep7' && "I want to spend 24 hours locked in a room with just you. 🔒"}
                    {stage === 'deep8' && "I want to be the reason you're always a little bit distracted. 🫦"}
                    {stage === 'deep9' && "I want to own every single one of your 'nasty' thoughts. 👙"}
                    {stage === 'deep10' && "I want you to be as obsessed with me as I am with you. ♾️"}
                   </p>
                </div>
                <button onClick={nextStage} className="bg-white text-black px-12 py-3 rounded-full font-black uppercase tracking-tighter">Next Confession</button>
              </div>
            )}

            {stage.startsWith('descent') && (
              <div className="flex flex-col items-center justify-center">
                 <h2 className="text-8xl font-black text-red-600 uppercase italic tracking-tighter animate-bounce drop-shadow-[0_0_30px_rgba(220,38,38,0.6)]">
                    {['CRAVING', 'WANTING', 'NEEDING', 'NASTY', 'EXTREME', 'OBSESSED', 'FOREVER', 'LIMITLESS', 'YOURS', 'NOW', 'FASTER', 'INTENSE', 'DEEPER', 'WILDER', 'SCREAM', 'BEG', 'YES', 'ALWAYS'][parseInt(stage.slice(7))-1]}
                 </h2>
                 <button onClick={nextStage} className="mt-20 bg-red-600 text-white px-10 py-4 rounded-full font-black shadow-2xl uppercase tracking-widest text-xs">Dive Deeper...</button>
              </div>
            )}

            {stage === 'ask' && (
              <div className="space-y-10 w-full">
                <img src="/assets/pic1.jpg" alt="KENDYYY" className="w-56 h-56 mx-auto rounded-full object-cover border-4 border-red-600 shadow-2xl" />
                <h1 className="text-4xl font-black uppercase leading-none tracking-tighter">Will you keep being my 'nasty' special person, KENDYYY?</h1>
                <div className="flex flex-col items-center justify-center gap-6 relative h-40">
                    <button onClick={handleYes} className="bg-red-600 text-white px-16 py-5 rounded-full text-3xl font-black shadow-[0_0_50px_rgba(220,38,38,0.5)] z-20">YES ❤️</button>
                    <motion.button onMouseEnter={moveNoButton} onTouchStart={moveNoButton} style={noButtonPos} className="bg-transparent border-2 border-white/20 text-white/40 px-10 py-3 rounded-full text-xl font-bold z-20">NO</motion.button>
                </div>
              </div>
            )}

            {stage === 'celebrate' && <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl z-[1000] p-10"><img src="/assets/pic2.jpg" className="w-64 h-64 rounded-3xl object-cover mb-8 border-4 border-red-600 shadow-2xl" /><h1 className="text-6xl font-black text-red-500 uppercase italic tracking-tighter">OUR VICTORY 🎉</h1></div>}
            {stage === 'letter' && <div className="w-full"><LetterModal isOpen={true} /></div>}

            {stage.startsWith('outro') && (
              <div className="space-y-10">
                <h2 className="text-7xl font-black text-red-600 italic uppercase tracking-tighter">{['THE END', 'OR IS IT?', 'SEE YOU TONIGHT', 'KENDYYY 🫦'][parseInt(stage.slice(-1))-1]}</h2>
                {stage !== 'outro4' && <button onClick={nextStage} className="bg-white text-black px-12 py-3 rounded-full font-black uppercase tracking-tighter">...</button>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <audio ref={audioRef} src="/assets/music.mp3" loop />
    </div>
  );
}

export default App;
