import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { recordVisit } from '../api/admin';

const VisitorTracker = () => {
  const location = useLocation();
  const [visitorId, setVisitorId] = useState('');
  
  // Generate a visitor ID based on available browser information
  useEffect(() => {
    const generateVisitorId = () => {
      try {
        // Check if there's a URL parameter for testing
        const urlParams = new URLSearchParams(window.location.search);
        const clearVisitor = urlParams.get('clear_visitor');
        
        // If the clear_visitor parameter is present, clear the stored visitor ID
        if (clearVisitor === 'true') {
          localStorage.removeItem('visitorId');
          sessionStorage.removeItem('sessionStarted');
          console.log('Visitor tracking reset for testing purposes');
        }
        
        // Collect browser information for a simple fingerprint
        const screenInfo = `${window.screen.height}x${window.screen.width}x${window.screen.colorDepth}`;
        const timezoneOffset = new Date().getTimezoneOffset();
        const languages = navigator.languages ? navigator.languages.join(',') : navigator.language;
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const glInfo = gl ? gl.getParameter(gl.VERSION) + gl.getParameter(gl.VENDOR) : 'no-webgl';
        
        // Create a simple fingerprint hash
        const rawFingerprint = `${screenInfo}|${timezoneOffset}|${languages}|${navigator.userAgent}|${glInfo}|${new Date().getTimezoneOffset()}`;
        const hash = simpleHash(rawFingerprint);
        
        // Generate a unique visitor ID
        const fingerprint = `${hash}-${Date.now().toString(36)}`;
        
        // Store the ID in localStorage so it persists for this browser
        const storedId = localStorage.getItem('visitorId');
        if (!storedId) {
          localStorage.setItem('visitorId', fingerprint);
          setVisitorId(fingerprint);
          console.log('New visitor ID generated:', fingerprint.substring(0, 8) + '...');
        } else {
          setVisitorId(storedId);
          console.log('Using existing visitor ID:', storedId.substring(0, 8) + '...');
        }
      } catch (error) {
        console.error('Error generating visitor ID:', error);
        // Generate a fallback random ID
        const fallbackId = `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('visitorId', fallbackId);
        setVisitorId(fallbackId);
        console.log('Using fallback visitor ID:', fallbackId.substring(0, 8) + '...');
      }
    };
    
    // Simple string hash function
    const simpleHash = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(36);
    };
    
    generateVisitorId();
  }, [location.search]); // Re-run when search query changes
  
  // Track visits on page change
  useEffect(() => {
    // Skip if visitor ID hasn't been generated yet
    if (!visitorId) return;
    
    const trackPageVisit = async () => {
      try {
        // Get browser information
        const userAgent = window.navigator.userAgent;
        let browser = 'unknown';
        let device = 'desktop';
        
        // Determine browser
        if (userAgent.indexOf('Chrome') !== -1) browser = 'chrome';
        else if (userAgent.indexOf('Firefox') !== -1) browser = 'firefox';
        else if (userAgent.indexOf('Safari') !== -1) browser = 'safari';
        else if (userAgent.indexOf('Edge') !== -1) browser = 'edge';
        else if (userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident') !== -1) browser = 'ie';
        
        // Determine device type
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
          device = 'mobile';
          if (/iPad|Tablet/i.test(userAgent)) device = 'tablet';
        }
        
        // Determine referrer (simplified)
        const referrer = document.referrer ? new URL(document.referrer).hostname : 'direct';
        
        // Get page path, removing any query parameters
        const page = location.pathname;
        
        // Use sessionStorage to track if this is a unique visit for this session
        const isNewSession = !sessionStorage.getItem('sessionStarted');
        if (isNewSession) {
          sessionStorage.setItem('sessionStarted', 'true');
          console.log('New session started - counting as unique visit');
        }
        
        // Record the visit
        console.log(`Recording visit to page: ${page}`);
        await recordVisit({
          page,
          device,
          browser,
          referrer,
          uniqueVisitor: isNewSession,
          visitorId
        });
      } catch (error) {
        // Silent fail to not disrupt user experience
        console.error('Error tracking visit:', error);
      }
    };
    
    trackPageVisit();
  }, [location.pathname, visitorId]);
  
  // This component doesn't render anything
  return null;
};

export default VisitorTracker;