/**
 * Simple Morph Polyfills
 * Provides fallbacks for older browsers to ensure compatibility
 * 
 * Features covered:
 * - backdrop-filter fallback
 * - CSS Custom Properties fallback
 * - Smooth scrolling polyfill
 * - IntersectionObserver polyfill
 * - matchMedia polyfill
 * - classList polyfill
 */

(function() {
  'use strict';

  // Feature detection utilities
  const FeatureDetection = {
    hasBackdropFilter: function() {
      const testEl = document.createElement('div');
      testEl.style.backdropFilter = 'blur(10px)';
      return testEl.style.backdropFilter !== '';
    },

    hasCustomProperties: function() {
      const testEl = document.createElement('div');
      testEl.style.setProperty('--test', 'test');
      return testEl.style.getPropertyValue('--test') === 'test';
    },

    hasSmoothScroll: function() {
      return 'scrollBehavior' in document.documentElement.style;
    },

    hasIntersectionObserver: function() {
      return 'IntersectionObserver' in window;
    },

    hasMatchMedia: function() {
      return 'matchMedia' in window;
    },

    hasClassList: function() {
      return 'classList' in document.createElement('div');
    }
  };

  // Backdrop-filter fallback
  function backdropFilterFallback() {
    if (FeatureDetection.hasBackdropFilter()) return;

    console.log('🔧 Applying backdrop-filter fallback');

    // Add fallback styles
    const fallbackCSS = `
      .glass, .navbar, .mobile-menu {
        background: rgba(255, 255, 255, 0.15) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
      }
      
      .glass-strong {
        background: rgba(255, 255, 255, 0.2) !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
      }
      
      /* Enhanced fallback for better visibility */
      .navbar {
        background: rgba(10, 10, 10, 0.9) !important;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) !important;
      }
    `;

    const style = document.createElement('style');
    style.textContent = fallbackCSS;
    document.head.appendChild(style);
  }

  // CSS Custom Properties fallback
  function customPropertiesFallback() {
    if (FeatureDetection.hasCustomProperties()) return;

    console.log('🔧 Applying CSS Custom Properties fallback');

    // Define fallback values
    const fallbackValues = {
      '--accent-primary': '#4A9EFF',
      '--accent-secondary': '#7B68EE',
      '--accent-success': '#34C759',
      '--accent-warning': '#FF9500',
      '--accent-error': '#FF3B30',
      '--bg-primary': '#0a0a0a',
      '--bg-secondary': '#1a1a2e',
      '--text-primary': '#ffffff',
      '--text-secondary': 'rgba(255, 255, 255, 0.9)',
      '--text-muted': 'rgba(255, 255, 255, 0.7)',
      '--border-radius': '12px',
      '--border-radius-small': '8px',
      '--spacing-xs': '0.25rem',
      '--spacing-sm': '0.5rem',
      '--spacing-md': '1rem',
      '--spacing-lg': '1.5rem',
      '--spacing-xl': '2rem',
      '--transition-fast': '0.15s',
      '--transition-normal': '0.3s',
      '--navbar-height': '3rem'
    };

    // Apply fallback styles
    const fallbackCSS = `
      body {
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0a0a0a 100%) !important;
        color: rgba(255, 255, 255, 0.9) !important;
      }
      
      .button-primary {
        background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%) !important;
        color: #ffffff !important;
      }
      
      .button-secondary {
        background: transparent !important;
        border: 1px solid rgba(255, 255, 255, 0.18) !important;
        color: rgba(255, 255, 255, 0.9) !important;
      }
      
      .alert-success {
        background: rgba(52, 199, 89, 0.1) !important;
        border-left: 4px solid #34C759 !important;
        color: #34C759 !important;
      }
      
      .alert-warning {
        background: rgba(255, 149, 0, 0.1) !important;
        border-left: 4px solid #FF9500 !important;
        color: #FF9500 !important;
      }
      
      .alert-error {
        background: rgba(255, 59, 48, 0.1) !important;
        border-left: 4px solid #FF3B30 !important;
        color: #FF3B30 !important;
      }
    `;

    const style = document.createElement('style');
    style.textContent = fallbackCSS;
    document.head.appendChild(style);
  }

  // Smooth scrolling polyfill
  function smoothScrollPolyfill() {
    if (FeatureDetection.hasSmoothScroll()) return;

    console.log('🔧 Applying smooth scrolling polyfill');

    // Simple smooth scroll implementation
    function smoothScrollTo(targetY, duration) {
      const startY = window.scrollY;
      const distance = targetY - startY;
      const startTime = performance.now();

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-in-out)
        const easeInOut = progress < 0.5 
          ? 2 * progress * progress 
          : -1 + (4 - 2 * progress) * progress;
        
        window.scrollTo(0, startY + distance * easeInOut);
        
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }

    // Override native scrollTo when smooth behavior is requested
    const originalScrollTo = window.scrollTo;
    window.scrollTo = function(options) {
      if (typeof options === 'object' && options.behavior === 'smooth') {
        smoothScrollTo(options.top || 0, 800);
      } else {
        originalScrollTo.apply(window, arguments);
      }
    };
  }

  // matchMedia polyfill
  function matchMediaPolyfill() {
    if (FeatureDetection.hasMatchMedia()) return;

    console.log('🔧 Applying matchMedia polyfill');

    window.matchMedia = function(query) {
      return {
        matches: false,
        media: query,
        addListener: function() {},
        removeListener: function() {}
      };
    };
  }

  // classList polyfill
  function classListPolyfill() {
    if (FeatureDetection.hasClassList()) return;

    console.log('🔧 Applying classList polyfill');

    if (!Element.prototype.classList) {
      Object.defineProperty(Element.prototype, 'classList', {
        get: function() {
          const self = this;
          
          function update(fn) {
            return function(value) {
              const classes = self.className.split(/\s+/);
              const index = classes.indexOf(value);
              
              fn(classes, index, value);
              self.className = classes.join(' ');
            };
          }
          
          return {
            add: update(function(classes, index, value) {
              if (index < 0) classes.push(value);
            }),
            
            remove: update(function(classes, index) {
              if (index >= 0) classes.splice(index, 1);
            }),
            
            toggle: update(function(classes, index, value) {
              if (index >= 0) {
                classes.splice(index, 1);
              } else {
                classes.push(value);
              }
            }),
            
            contains: function(value) {
              return self.className.split(/\s+/).indexOf(value) >= 0;
            }
          };
        }
      });
    }
  }

  // IntersectionObserver polyfill (simplified)
  function intersectionObserverPolyfill() {
    if (FeatureDetection.hasIntersectionObserver()) return;

    console.log('🔧 Applying IntersectionObserver polyfill');

    window.IntersectionObserver = function(callback, options) {
      this.callback = callback;
      this.options = options || {};
      this.elements = [];
    };

    IntersectionObserver.prototype.observe = function(element) {
      this.elements.push(element);
      
      // Simple visibility check
      const checkVisibility = () => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        this.callback([{
          target: element,
          isIntersecting: isVisible,
          intersectionRatio: isVisible ? 1 : 0
        }]);
      };
      
      // Check on scroll and resize
      window.addEventListener('scroll', checkVisibility);
      window.addEventListener('resize', checkVisibility);
      
      // Initial check
      checkVisibility();
    };

    IntersectionObserver.prototype.unobserve = function(element) {
      const index = this.elements.indexOf(element);
      if (index > -1) {
        this.elements.splice(index, 1);
      }
    };

    IntersectionObserver.prototype.disconnect = function() {
      this.elements = [];
    };
  }

  // Initialize polyfills
  function initPolyfills() {
    console.log('🔍 Checking browser compatibility...');
    
    // Apply polyfills as needed
    backdropFilterFallback();
    customPropertiesFallback();
    smoothScrollPolyfill();
    matchMediaPolyfill();
    classListPolyfill();
    intersectionObserverPolyfill();
    
    console.log('✅ Polyfills initialized');
    
    // Store feature detection results for tests
    window.SimpleMorphPolyfills = {
      features: {
        backdropFilter: FeatureDetection.hasBackdropFilter(),
        customProperties: FeatureDetection.hasCustomProperties(),
        smoothScroll: FeatureDetection.hasSmoothScroll(),
        intersectionObserver: FeatureDetection.hasIntersectionObserver(),
        matchMedia: FeatureDetection.hasMatchMedia(),
        classList: FeatureDetection.hasClassList()
      }
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPolyfills);
  } else {
    initPolyfills();
  }

})();
