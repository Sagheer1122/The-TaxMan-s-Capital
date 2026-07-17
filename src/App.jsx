import { useState, useEffect } from 'react';
import Home from './pages/ios/Home/Home';
const getCurrentSession = async () => null;
const onAuthChange = (callback) => { if (callback) { /* no-op */ } return { unsubscribe: () => {} }; };
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 4500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Intercept all global window.alert calls to convert them to custom toasts
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message) => {
      if (!message) return;
      let type = 'success';
      const lower = message.toString().toLowerCase();
      if (lower.includes('error') || lower.includes('denied') || lower.includes('failed') || lower.includes('invalid') || lower.includes('not have') || lower.includes('denies') || lower.includes('denied')) {
        type = 'error';
      } else if (lower.includes('warning') || lower.includes('attention') || lower.includes('alert') || lower.includes('limit')) {
        type = 'warning';
      } else if (lower.includes('soon') || lower.includes('development') || lower.includes('redirecting') || lower.includes('composer') || lower.includes('dialing') || lower.includes('starting') || lower.includes('opening')) {
        type = 'info';
      }
      addToast(message.toString(), type);
    };
    return () => {
      window.alert = originalAlert;
    };
  }, []);

  useEffect(() => {
    // Get current session
    getCurrentSession().then(session => {
      setSession(session);
      setSessionLoading(false);
    });

    // Listen for auth state changes
    const subscription = onAuthChange((_event, session) => {
      setSession(session);
      setSessionLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onMouseDown = () => {
      setClicked(true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Update outer trail position with a smooth delay (inertia follow)
  useEffect(() => {
    let animationFrameId;
    
    const updateTrail = () => {
      setTrailPosition(prev => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15
        };
      });
      animationFrameId = requestAnimationFrame(updateTrail);
    };
    
    animationFrameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  // Hook hover states for buttons/links dynamically
  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        (target.classList && target.classList.contains('cursor-pointer'));
        
      setLinkHovered(!!isInteractive);
    };

    document.addEventListener("mouseover", handleMouseOver);
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Custom Cursor Dot */}
      <div
        className={`fixed pointer-events-none z-50 w-2 h-2 bg-brandGreen rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(0,200,83,0.8)] transition-transform duration-100 ease-out hidden md:block ${
          hidden ? 'opacity-0' : 'opacity-100'
        } ${clicked ? 'scale-75' : ''} ${linkHovered ? 'scale-150 bg-emerald-400' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      />

      {/* Custom Cursor Ring Glow Tracker */}
      <div
        className={`fixed pointer-events-none z-50 w-8 h-8 border border-dashed border-brandGreen/60 rounded-full -translate-x-1/2 -translate-y-1/2 hidden md:block transition-[transform,opacity,border-color,background-color] duration-300 ease-out ${
          hidden ? 'opacity-0 scale-50' : 'opacity-100'
        } ${
          clicked 
            ? 'scale-75 border-solid border-brandGreen-dark bg-brandGreen/10 shadow-[0_0_15px_rgba(0,200,83,0.4)]' 
            : ''
        } ${
          linkHovered 
            ? 'scale-150 border-solid border-emerald-400 bg-brandGreen/5 shadow-[0_0_20px_rgba(0,200,83,0.5)]' 
            : ''
        }`}
        style={{
          left: `${trailPosition.x}px`,
          top: `${trailPosition.y}px`
        }}
      />
      
      {/* Global Toast Notifications Overlay */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col space-y-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map(toast => {
          let borderClass = 'border-brandGreen/30 shadow-[0_0_15px_rgba(0,200,83,0.12)] text-emerald-400';
          let icon = <CheckCircle className="w-5 h-5 text-brandGreen flex-shrink-0" />;
          
          if (toast.type === 'error') {
            borderClass = 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.12)] text-red-400';
            icon = <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
          } else if (toast.type === 'warning') {
            borderClass = 'border-[#F3C132]/30 shadow-[0_0_15px_rgba(243,193,50,0.12)] text-[#F3C132]';
            icon = <AlertTriangle className="w-5 h-5 text-[#F3C132] flex-shrink-0" />;
          } else if (toast.type === 'info') {
            borderClass = 'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.12)] text-blue-400';
            icon = <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />;
          }
          
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-2xl border bg-[#011126]/95 backdrop-blur-md animate-toastSlideIn transition-all ${borderClass}`}
            >
              {icon}
              <div className="flex-1 text-xs font-semibold leading-relaxed whitespace-pre-line text-white/95">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer p-0.5 rounded-lg hover:bg-white/5 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <Home session={session} sessionLoading={sessionLoading} />
    </>
  );
}
