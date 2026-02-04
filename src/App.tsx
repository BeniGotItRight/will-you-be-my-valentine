import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import FloatingHearts from './components/FloatingHearts';
import LetterModal from './components/LetterModal';

function App() {
  const [stage, setStage] = useState<'ask' | 'celebrate' | 'letter'>('ask');
  const [noCount, setNoCount] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ top: 'auto', left: 'auto', position: 'static' as any });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Images
  const bearAsk = '/assets/bear_ask.png';
  const bearCelebrate = '/assets/bear_celebrate.png';

  const moveNoButton = () => {
    // Calculate random position within viewport
    // Use fixed position to move it around relative to screen
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    
    setNoButtonPos({
      position: 'fixed',
      top: `${y}px`,
      left: `${x}px`,
    });
    setNoCount(prev => prev + 1);
  };

  const handleYes = () => {
    setStage('celebrate');
    
    // Enhanced confetti explosion with hearts
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      // Side confetti
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF4D6D', '#FF8FA3', '#FFC2D1', '#FFFFFF'],
        shapes: ['circle', 'square'],
        gravity: 1.2,
        scalar: 1.2
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF4D6D', '#FF8FA3', '#FFC2D1', '#FFFFFF'],
        shapes: ['circle', 'square'],
        gravity: 1.2,
        scalar: 1.2
      });

      // Center burst
      if (Math.random() > 0.8) {
        confetti({
          particleCount: 10,
          angle: 90,
          spread: 360,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#FF4D6D', '#FF8FA3', '#FFC2D1'],
          startVelocity: 25
        });
      }

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Play music with fade-in
    if (audioRef.current) {
        audioRef.current.volume = 0;
        audioRef.current.play().then(() => {
          // Fade in the music
          let vol = 0;
          const fadeIn = setInterval(() => {
            if (vol < 0.5) {
              vol += 0.05;
              if (audioRef.current) audioRef.current.volume = vol;
            } else {
              clearInterval(fadeIn);
            }
          }, 100);
        }).catch(e => console.log('Audio play failed', e));
    }

    // Transition to letter after a delay
    setTimeout(() => {
        setStage('letter');
    }, 4000);
  };

  const getYesButtonSize = () => {
    // Grow by 10% each time
    const scale = 1 + (noCount * 0.1);
    return scale;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overscroll-none touch-manipulation">
      {/* Background Hearts */}
      {(stage === 'celebrate' || stage === 'letter') && <FloatingHearts />}

      <div className="z-10 text-center px-4 w-full max-w-md">
        
        {/* Main Card Content */}
        <motion.div
            layout
            className={`transition-all duration-500 ${stage !== 'ask' ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}
        >
             <motion.img 
                key={stage}
                src={stage === 'ask' ? bearAsk : bearCelebrate} 
                alt="Cute Bear" 
                className="w-48 h-48 mx-auto object-contain mb-8 drop-shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            />

            <h1 className="text-4xl md:text-5xl text-[#FF4D6D] mb-8 font-display font-bold leading-tight drop-shadow-sm">
                Will you be my Valentine, Felicity?
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative h-20">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleYes}
                    style={{ scale: getYesButtonSize() }}
                    className="bg-[#FF4D6D] text-white px-8 py-3 rounded-full text-xl font-bold font-body shadow-lg hover:bg-[#ff3355] transition-colors z-20"
                >
                    Yes
                </motion.button>

                <motion.button
                    onMouseEnter={moveNoButton}
                    onTouchStart={moveNoButton} /* For mobile */
                    style={noButtonPos}
                    className="bg-white text-[#FF4D6D] border-2 border-[#FF4D6D] px-8 py-3 rounded-full text-xl font-bold font-body shadow-lg hover:bg-gray-50 transition-all z-20 whitespace-nowrap"
                >
                    No
                </motion.button>
            </div>
        </motion.div>

        {/* Celebrate View */}
        {stage === 'celebrate' && (
             <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5, ease: "easeOut" }}
             className="fixed inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm z-30"
           >
                <motion.img 
                  src={bearCelebrate} 
                  alt="Happy Bear" 
                  className="w-64 h-64 mx-auto object-contain mb-6"
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, -5, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <motion.h1 
                  className="text-4xl md:text-6xl text-[#FF4D6D] font-display font-bold px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                    Yay! I knew you'd say yes! 🥰
                </motion.h1>
           </motion.div>
        )}

        {/* Letter Modal */}
        <LetterModal isOpen={stage === 'letter'} />

      </div>

      {/* Hidden Audio */}
      {/* Note: User should replace visual-preview.mp3 with their choice */}
      <audio ref={audioRef} src="/assets/music.mp3" loop />
    </div>
  );
}

export default App;
