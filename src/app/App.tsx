import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Frame1 from '../imports/Frame1';
import Frame3 from '../imports/Frame3';
import Heart from '../imports/Heart';
import HeartPink from '../imports/HeartPink';
import HeartCoral from '../imports/HeartCoral';

export default function App() {
  const [isDancing, setIsDancing] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [showQuestion, setShowQuestion] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Detect if device is mobile/touch
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Handle mouse/touch movement to make the "Return to sender" button run away
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!noButtonRef.current || isDancing) return;

    const button = noButtonRef.current.getBoundingClientRect();

    const buttonCenterX = button.left + button.width / 2;
    const buttonCenterY = button.top + button.height / 2;

    const distanceX = clientX - buttonCenterX;
    const distanceY = clientY - buttonCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Mobile: larger detection radius and bigger jumps for more playful interaction
    const detectionRadius = isMobile ? 180 : 120;
    const moveDistance = isMobile ? 150 : 100;

    // If pointer is within detection radius, move button away
    if (distance < detectionRadius) {
      const angle = Math.atan2(distanceY, distanceX);
      
      // Calculate new position (move away from pointer)
      let newX = noButtonPosition.x - Math.cos(angle) * moveDistance;
      let newY = noButtonPosition.y - Math.sin(angle) * moveDistance;

      // Calculate where the button will be after the transform
      const futureLeft = button.left - noButtonPosition.x + newX;
      const futureTop = button.top - noButtonPosition.y + newY;
      const futureRight = futureLeft + button.width;
      const futureBottom = futureTop + button.height;

      // Clamp to keep button fully visible within viewport
      const padding = 10;
      if (futureLeft < padding) {
        newX = newX + (padding - futureLeft);
      }
      if (futureRight > window.innerWidth - padding) {
        newX = newX - (futureRight - (window.innerWidth - padding));
      }
      if (futureTop < padding) {
        newY = newY + (padding - futureTop);
      }
      if (futureBottom > window.innerHeight - padding) {
        newY = newY - (futureBottom - (window.innerHeight - padding));
      }

      setNoButtonPosition({ x: newX, y: newY });
    } else {
      // Return to original position when pointer is far away
      setNoButtonPosition({ x: 0, y: 0 });
    }
  };

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  // Handle touch movement for mobile
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    }
  };

  const handleYesClick = () => {
    setShowQuestion(false);
    setIsDancing(true);
    setShowConfetti(true);
  };

  return (
    <div 
      className="size-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-pink-200 overflow-hidden relative"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Floating hearts background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-12 h-12 sm:w-16 sm:h-16"
          animate={{ y: [0, -20, 0], x: [0, 10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
        >
          <Heart />
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 w-10 h-10 sm:w-14 sm:h-14"
          animate={{ y: [0, -15, 0], x: [0, -10, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 1 }}
        >
          <HeartPink />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-16 w-8 h-8 sm:w-12 sm:h-12"
          animate={{ y: [0, -10, 0], x: [0, 15, 0], rotate: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 2 }}
        >
          <HeartCoral />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-32 w-10 h-10 sm:w-14 sm:h-14"
          animate={{ y: [0, -20, 0], x: [0, -5, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 0.5 }}
        >
          <Heart />
        </motion.div>
        <motion.div
          className="absolute top-40 left-1/3 w-6 h-6 sm:w-10 sm:h-10"
          animate={{ y: [0, -25, 0], x: [0, 5, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 1.5 }}
        >
          <HeartCoral />
        </motion.div>
      </div>

      {/* Heart confetti burst on "Yes" click */}
      {showConfetti && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {[...Array(30)].map((_, i) => {
            const randomAngle = (Math.random() * 360);
            const randomDistance = Math.random() * 300 + 100;
            const randomX = Math.cos(randomAngle * Math.PI / 180) * randomDistance;
            const randomY = Math.sin(randomAngle * Math.PI / 180) * randomDistance;
            const HeartComponent = [Heart, HeartPink, HeartCoral][i % 3];
            
            return (
              <motion.div
                key={i}
                className="absolute w-8 h-8 sm:w-12 sm:h-12"
                style={{
                  left: '50%',
                  top: '30%',
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  rotate: 0,
                  opacity: 1 
                }}
                animate={{ 
                  x: randomX,
                  y: randomY + 200,
                  scale: [0, 1, 0.8],
                  rotate: Math.random() * 360,
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random(),
                  ease: 'easeOut',
                  delay: i * 0.02
                }}
              >
                <HeartComponent />
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col items-center gap-8 z-10">
        {/* Snoopy with enhanced jumping and wiggling animation */}
        <motion.div
          className="w-48 h-48 sm:w-64 sm:h-64"
          animate={isDancing ? {
            y: [0, -50, 0, -40, 0, -45, 0],
            rotate: [0, -5, 5, -3, 3, 0, 0],
            scale: [1, 1.05, 0.95, 1.05, 0.95, 1, 1],
          } : {}}
          transition={isDancing ? {
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut'
          } : {}}
        >
          {isDancing ? <Frame3 /> : <Frame1 />}
        </motion.div>

        {showQuestion ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-6 px-4"
          >
            <h1 className="text-3xl sm:text-5xl font-bold text-red-600 text-center">
              Will you be my valentine?
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 relative w-full sm:w-auto">
              {/* Yes button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleYesClick}
                className="px-6 py-3 sm:px-8 bg-red-500 text-white rounded-full font-semibold text-base sm:text-lg shadow-lg hover:bg-red-600 transition-colors"
              >
                Yes, I will!
              </motion.button>

              {/* No button that runs away */}
              <motion.button
                ref={noButtonRef}
                animate={{
                  x: noButtonPosition.x,
                  y: noButtonPosition.y,
                }}
                transition={{
                  type: 'spring',
                  stiffness: isMobile ? 300 : 100,
                  damping: isMobile ? 15 : 20,
                  mass: 0.5,
                  bounce: 0.6
                }}
                className="px-6 py-3 sm:px-8 bg-gray-300 text-gray-700 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:bg-gray-400 transition-colors"
              >
                Return to sender
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-center px-4"
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-red-600 mb-4">
              Yay!
            </h1>
            <p className="text-lg sm:text-2xl text-red-500">
              Text 🥐 or 🍪 to me, and I'll treat you to one!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}