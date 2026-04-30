import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

const extremeQuestions = [
  "If we were locked in a completely soundproof room for 24 hours with no rules, what's the very first thing you'd do to me?",
  "What is the most explicit, nasty fantasy you've ever had about me when you were all alone?",
  "Tell me exactly how you want me to touch you right now. Don't leave out any dirty details.",
  "If I let you take 100% control over my body tonight, what's the most degrading thing you'd make me do?",
  "What's a filthy secret about your body's reaction to me that you've been too shy to admit?",
  "Describe the exact moment you realized you wanted me in the most desperate, primal way possible.",
  "If you had to choose between being teased mercilessly for an hour or taken completely rough right now, which is it?",
  "What part of my body do you want to mark up the most, and exactly how would you do it?",
  "Tell me a dirty command you've always wanted to give me but haven't said out loud yet.",
  "If I was tied up and completely at your mercy, what's the first boundary you would cross?"
];

type PlayerRole = 'Benson' | 'Kendy' | null;

interface QuizState {
  id: number;
  question_index: number;
  benson_answer: string | null;
  kendy_answer: string | null;
}

const RealtimeQuiz = () => {
  const [role, setRole] = useState<PlayerRole>(localStorage.getItem('user_role') as PlayerRole);
  const [gameState, setGameState] = useState<QuizState>({
    id: 1,
    question_index: 0,
    benson_answer: null,
    kendy_answer: null
  });
  const [localAnswer, setLocalAnswer] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial state
    const fetchState = async () => {
      const { data, error } = await supabase
        .from('quiz_state')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.error("Supabase error:", error);
        setError("Failed to connect to Supabase. Check your .env setup!");
      } else if (data) {
        setGameState(data);
      }
    };
    fetchState();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quiz_state',
          filter: 'id=eq.1'
        },
        (payload) => {
          setGameState(payload.new as QuizState);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // When both answers are submitted, we reveal
  const bothLocked = Boolean(gameState.benson_answer && gameState.kendy_answer);

  // Sync local answer state to unlock if question index changes
  useEffect(() => {
    setIsLocked(false);
    setLocalAnswer('');
  }, [gameState.question_index]);

  const handleLockIn = async () => {
    if (!localAnswer.trim() || !role) return;
    setIsLocked(true);
    
    const updatePayload = role === 'Benson' 
      ? { benson_answer: localAnswer } 
      : { kendy_answer: localAnswer };

    const { error } = await supabase
      .from('quiz_state')
      .update(updatePayload)
      .eq('id', 1);

    if (error) {
      console.error(error);
      setError("Failed to lock in answer.");
      setIsLocked(false);
    }
  };

  const nextQuestion = async () => {
    const nextIndex = (gameState.question_index + 1) % extremeQuestions.length;
    await supabase
      .from('quiz_state')
      .update({
        question_index: nextIndex,
        benson_answer: null,
        kendy_answer: null
      })
      .eq('id', 1);
  };

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center space-y-10 w-full min-h-[80vh]">
        <h2 className="text-5xl font-black text-red-600 uppercase tracking-tighter italic">Who is playing?</h2>
        <div className="flex gap-8">
          <button 
            onClick={() => setRole('Benson')}
            className="bg-red-900/40 border-2 border-red-500 hover:bg-red-600 px-12 py-6 rounded-3xl text-3xl font-bold uppercase transition-all shadow-xl"
          >
            I am Benson
          </button>
          <button 
            onClick={() => setRole('Kendy')}
            className="bg-red-900/40 border-2 border-red-500 hover:bg-red-600 px-12 py-6 rounded-3xl text-3xl font-bold uppercase transition-all shadow-xl"
          >
            I am KENDYYY
          </button>
        </div>
        {error && <p className="text-red-400 font-bold mt-4">{error}</p>}
      </div>
    );
  }

  const currentQ = extremeQuestions[gameState.question_index];
  const partnerRole = role === 'Benson' ? 'Kendy' : 'Benson';

  const partnerAnswerState = role === 'Benson' ? gameState.kendy_answer : gameState.benson_answer;

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-8 relative z-10 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-xs font-black text-red-500 uppercase tracking-[0.3em]">Extreme Real-Time Confession</h2>
        <p className="text-gray-400 font-medium italic text-sm">
          You are playing as <span className="text-white font-bold">{role}</span>. Both must answer to reveal.
        </p>
      </div>

      <motion.div 
        key={gameState.question_index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="red-glass p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden w-full max-w-2xl"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/10 blur-3xl -mr-20 -mt-20 rounded-full" />
        <h3 className="text-3xl md:text-4xl font-black italic text-white leading-tight mb-8 drop-shadow-md text-center relative z-10">
          "{currentQ}"
        </h3>

        {!bothLocked ? (
          <div className="space-y-6">
            <textarea
              value={localAnswer}
              onChange={(e) => setLocalAnswer(e.target.value)}
              disabled={isLocked}
              placeholder="Type your dirtiest truth..."
              className="w-full bg-black/50 p-6 rounded-2xl border-2 border-dashed border-red-500/30 outline-none h-32 text-white text-xl font-bold placeholder:text-white/20 focus:border-red-500 transition-all resize-none disabled:opacity-50"
            />
            <div className="flex justify-between items-center px-2">
              <p className="text-sm font-bold text-gray-400">
                {partnerAnswerState ? `🔥 ${partnerRole} has locked in.` : `⏳ Waiting for ${partnerRole}...`}
              </p>
              <button
                onClick={handleLockIn}
                disabled={isLocked || !localAnswer.trim()}
                className="bg-red-600 disabled:bg-gray-700 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:shadow-none transition-all"
              >
                {isLocked ? 'Locked 🔒' : 'Lock In 😈'}
              </button>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="space-y-8"
            >
              <div className="space-y-2 border-b border-red-500/20 pb-6">
                <p className="text-red-500 text-xs font-black uppercase tracking-widest">Benson's Answer</p>
                <p className="text-2xl font-black text-white italic">"{gameState.benson_answer}"</p>
              </div>
              <div className="space-y-2">
                <p className="text-red-500 text-xs font-black uppercase tracking-widest">KENDYYY's Answer</p>
                <p className="text-2xl font-black text-white italic">"{gameState.kendy_answer}"</p>
              </div>

              <div className="pt-8 flex justify-center">
                <button 
                  onClick={nextQuestion}
                  className="bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-tighter shadow-xl hover:scale-105 transition-transform"
                >
                  Next Nasty Question
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
      {error && <p className="text-red-400 font-bold">{error}</p>}
    </div>
  );
};

export default RealtimeQuiz;
