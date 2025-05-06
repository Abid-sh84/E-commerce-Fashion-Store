import { useEffect, useRef } from 'react';

const CanvasCursor = () => {
  const canvasRef = useRef(null);
  const cursorRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef([]);
  const lastPointTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
      
      // Add points less frequently for better performance and appearance
      const now = Date.now();
      if (now - lastPointTimeRef.current > 50) { // Add a point every 50ms
        lastPointTimeRef.current = now;
        
        // Add multiple particles with different sizes for more dynamic effect
        for (let i = 0; i < 3; i++) {
          pointsRef.current.push({
            x: e.clientX + (Math.random() * 10 - 5),
            y: e.clientY + (Math.random() * 10 - 5),
            time: now,
            ttl: 1500 + Math.random() * 500, // time to live in ms
            size: Math.random() * 4 + (i === 0 ? 3 : 1), // Varied sizes
            // Using purple hues similar to dialogh site
            color: `hsla(${Math.random() * 30 + 250}, 85%, ${60 + Math.random() * 20}%, ${Math.random() * 0.4 + 0.4})`
          });
        }
      }
    };

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const now = Date.now();
      
      // Update and draw points
      pointsRef.current = pointsRef.current.filter(point => {
        const age = now - point.time;
        const life = 1 - age / point.ttl;
        
        if (life <= 0) return false;
        
        // Draw the point with fading opacity
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size * life * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = point.color.replace(/[\d.]+\)$/g, `${life * 0.6})`);
        ctx.fill();
        
        return life > 0;
      });
      
      // Draw main cursor - using a soft glow effect
      const gradient = ctx.createRadialGradient(
        cursorRef.current.x, cursorRef.current.y, 1,
        cursorRef.current.x, cursorRef.current.y, 20
      );
      gradient.addColorStop(0, 'rgba(180, 120, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(180, 120, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(180, 120, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(cursorRef.current.x, cursorRef.current.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Inner cursor dot
      ctx.beginPath();
      ctx.arc(cursorRef.current.x, cursorRef.current.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
      
      animationFrameId = requestAnimationFrame(render);
    };

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Add a touch event listener for mobile devices
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handleMouseMove({ 
          clientX: e.touches[0].clientX, 
          clientY: e.touches[0].clientY 
        });
      }
    });
    
    // Initialize cursor position to center of screen
    cursorRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'normal', opacity: 0.85 }}
    />
  );
};

export default CanvasCursor;
