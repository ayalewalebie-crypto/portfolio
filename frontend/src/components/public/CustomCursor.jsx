import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button'
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-purple-500 pointer-events-none z-[9999] transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isPointer ? 1.5 : 1})`,
          backgroundColor: isPointer ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
          opacity: position.x === 0 && position.y === 0 ? 0 : 1,
        }}
      >
        <div className={`w-1.5 h-1.5 bg-purple-500 rounded-full transition-opacity duration-300 ${isPointer ? 'opacity-0' : 'opacity-100'}`} />
      </div>
    </>
  );
};

export default CustomCursor;
