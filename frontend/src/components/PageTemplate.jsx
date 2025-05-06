import { useEffect } from "react";

const PageTemplate = ({ title, subtitle, children }) => {
  useEffect(() => {
    // Create stars for background
    const createStars = () => {
      const starsContainer = document.getElementById('page-stars-container');
      if (!starsContainer) return;
      
      starsContainer.innerHTML = '';
      
      // Create stars with variety
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
          
        if (i % 5 === 0) {
          star.className = 'star glow';
          star.style.width = `${Math.random() * 4 + 2}px`;
          star.style.height = star.style.width;
          star.style.boxShadow = '0 0 4px 1px rgba(255, 255, 255, 0.6)';
        } else if (i % 7 === 0) {
          star.className = 'star colored';
          star.style.width = `${Math.random() * 3 + 1}px`;
          star.style.height = star.style.width;
          star.style.backgroundColor = ['#f0e8ff', '#fff6e0', '#d4e8ff'][Math.floor(Math.random() * 3)];
          star.style.animationDuration = `${Math.random() * 4 + 2}s`;
        } else {
          star.className = 'star';
          star.style.width = `${Math.random() * 2 + 1}px`;
          star.style.height = star.style.width;
          star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        }
        
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        starsContainer.appendChild(star);
      }
      
      // Add occasional shooting stars
      setInterval(() => {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        shootingStar.style.top = `${Math.random() * 70}%`;
        shootingStar.style.left = `${Math.random() * 100}%`;
        shootingStar.style.width = `${Math.random() * 150 + 50}px`;
        shootingStar.style.animationDuration = `${Math.random() * 2 + 0.5}s`;
        
        starsContainer.appendChild(shootingStar);
        
        setTimeout(() => {
          shootingStar.remove();
        }, 1000);
      }, 4000);
    }
    
    createStars();
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 relative">
      {/* Stars container */}
      <div id="page-stars-container" className="fixed inset-0 pointer-events-none overflow-hidden"></div>
      
      {/* Cosmic rays */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-px h-screen bg-blue-400 opacity-20" style={{boxShadow: '0 0 20px 5px rgba(96, 165, 250, 0.5)'}}></div>
        <div className="absolute top-0 left-2/4 w-px h-screen bg-purple-400 opacity-20" style={{boxShadow: '0 0 20px 5px rgba(192, 132, 252, 0.5)'}}></div>
        <div className="absolute top-0 left-3/4 w-px h-screen bg-yellow-400 opacity-20" style={{boxShadow: '0 0 20px 5px rgba(250, 204, 21, 0.5)'}}></div>
      </div>

      {/* Page Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/60 to-indigo-900/60 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/cosmic-bg.jpg')] bg-cover bg-center opacity-30"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-purple-400 to-blue-400 mb-4">
            {title}
          </h1>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative z-10 py-12 mb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main content card with glow effect */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-yellow-600/30 rounded-2xl blur-lg"></div>
            
            <div className="relative bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-md p-8 rounded-2xl border border-indigo-700/50 shadow-lg shadow-purple-900/30">
              {children}
            </div>
          </div>
        </div>
      </section>

      {/* CSS for stars animation */}
      <style jsx global>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        
        @keyframes colored-twinkle {
          0% { opacity: 0.1; }
          50% { opacity: 0.8; }
          100% { opacity: 0.1; }
        }
        
        @keyframes glow {
          0% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.4; transform: scale(1); }
        }
        
        @keyframes shooting {
          0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 1; }
          100% { transform: translateX(-100px) translateY(100px) rotate(-45deg); opacity: 0; }
        }
        
        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          animation: twinkle linear infinite;
        }
        
        .star.colored {
          animation: colored-twinkle linear infinite;
        }
        
        .star.glow {
          animation: glow linear infinite;
        }
        
        .shooting-star {
          position: absolute;
          height: 1px;
          background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1));
          transform: rotate(-45deg);
          animation: shooting linear forwards;
        }
      `}</style>
    </div>
  );
};

export default PageTemplate;
