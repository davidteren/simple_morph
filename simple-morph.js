/* Simple Morph JavaScript - Essential Features Only */
/* Version 0.0.1-beta - Released 2025-07-30 */
/* Repository: https://github.com/davidteren/simple_morph */

(function() {
  'use strict';

  const SimpleMorph = {
    config: {
      mobileBreakpoint: 768,
      transitionDuration: 300
    },

    // Initialize the framework
    init: function() {
      this.setupMobileMenu();
      this.setupSmoothScroll();
      this.setupFormValidation();
      this.setupTocClose();
      this.setupGlassMorphing();
      this.setupIntersectionObserver();
      this.setupParallaxEffects();
      
      // Expose public API
      this.exposeAPI();
      
      console.log('🚀 Simple Morph initialized');
    },

    // Mobile menu functionality
    setupMobileMenu: function() {
      const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
      const mobileMenu = document.querySelector('.mobile-menu');
      
      if (!mobileMenuToggle || !mobileMenu) return;

      // Toggle mobile menu
      mobileMenuToggle.addEventListener('click', function() {
        const isOpen = mobileMenu.classList.contains('show');
        
        if (isOpen) {
          mobileMenu.classList.remove('show');
          document.body.style.overflow = '';
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        } else {
          mobileMenu.classList.add('show');
          document.body.style.overflow = 'hidden';
          mobileMenuToggle.setAttribute('aria-expanded', 'true');
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', function(e) {
        if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
          mobileMenu.classList.remove('show');
          document.body.style.overflow = '';
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
      });

      // Close menu on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('show')) {
          mobileMenu.classList.remove('show');
          document.body.style.overflow = '';
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
          mobileMenuToggle.focus();
        }
      });

      // Close menu when window is resized above mobile breakpoint
      window.addEventListener('resize', function() {
        if (window.innerWidth > SimpleMorph.config.mobileBreakpoint) {
          mobileMenu.classList.remove('show');
          document.body.style.overflow = '';
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    },

    // Smooth scrolling for anchor links
    setupSmoothScroll: function() {
      document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href === '#') return;
          
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80; // Account for navbar
            
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        });
      });
    },

    // Basic form validation and enhancement
    setupFormValidation: function() {
      const forms = document.querySelectorAll('form');
      
      forms.forEach(function(form) {
        // Add validation classes on input
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(function(input) {
          input.addEventListener('blur', function() {
            if (this.checkValidity()) {
              this.classList.remove('invalid');
              this.classList.add('valid');
            } else {
              this.classList.remove('valid');
              this.classList.add('invalid');
            }
          });

          // Clear validation state on focus
          input.addEventListener('focus', function() {
            this.classList.remove('valid', 'invalid');
          });
        });

        // Form submission handling
        form.addEventListener('submit', function(e) {
          let isValid = true;
          
          inputs.forEach(function(input) {
            if (!input.checkValidity()) {
              input.classList.add('invalid');
              isValid = false;
            }
          });

          if (!isValid) {
            e.preventDefault();
            const firstInvalid = form.querySelector('.invalid');
            if (firstInvalid) {
              firstInvalid.focus();
            }
          }
        });
      });
    },

    // Table of Contents close functionality
    setupTocClose: function() {
      const tocCloseButtons = document.querySelectorAll('.toc-close');
      
      tocCloseButtons.forEach(function(button) {
        button.addEventListener('click', function() {
          const toc = this.closest('nav.toc');
          if (toc) {
            toc.classList.add('hidden');
          }
        });
      });
    },

    // Glass morphing effects
    setupGlassMorphing: function() {
      // Auto-apply glass effects based on scroll position
      const glassElements = document.querySelectorAll('.glass, .glass-strong, .glass-frosted');
      
      const updateGlassIntensity = this.utils.throttle(function() {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        glassElements.forEach(function(element) {
          const intensity = Math.min(1, scrollPercent * 2);
          element.style.setProperty('--dynamic-blur', (10 + intensity * 20) + 'px');
          element.style.setProperty('--dynamic-opacity', (0.05 + intensity * 0.1));
        });
      }, 16);

      window.addEventListener('scroll', updateGlassIntensity);
      updateGlassIntensity(); // Initial call
    },

    // Intersection Observer for animations
    setupIntersectionObserver: function() {
      if (!window.IntersectionObserver) return;

      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            
            // Add staggered animation for child elements
            const children = entry.target.querySelectorAll('.card, .glass, button');
            children.forEach(function(child, index) {
              setTimeout(function() {
                child.classList.add('animate-slide-up');
              }, index * 100);
            });
          }
        });
      }, observerOptions);

      // Observe elements that should animate on scroll
      document.querySelectorAll('.demo-section, .feature-grid, .card').forEach(function(element) {
        observer.observe(element);
      });
    },

    // Parallax effects for enhanced depth
    setupParallaxEffects: function() {
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      
      if (parallaxElements.length === 0) return;

      const updateParallax = this.utils.throttle(function() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(function(element) {
          const speed = parseFloat(element.dataset.parallax) || 0.5;
          const yPos = -(scrollTop * speed);
          element.style.transform = `translateY(${yPos}px)`;
        });
      }, 16);

      window.addEventListener('scroll', updateParallax);
    },

    // Utility functions
    utils: {
      // Debounce function for performance
      debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
          const later = function() {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      },

      // Throttle function for scroll events
      throttle: function(func, limit) {
        let inThrottle;
        return function() {
          const args = arguments;
          const context = this;
          if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
          }
        };
      },

      // Check if element is in viewport
      isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      },

      // Get scroll percentage
      getScrollPercent: function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return scrollTop / docHeight;
      },

      // Apply glass effect dynamically
      applyGlassEffect: function(element, intensity = 1) {
        if (!element) return;
        
        const blur = Math.max(10, intensity * 25);
        const opacity = Math.max(0.05, intensity * 0.15);
        
        element.style.backdropFilter = `blur(${blur}px)`;
        element.style.background = `rgba(255, 255, 255, ${opacity})`;
        element.style.border = `1px solid rgba(255, 255, 255, ${opacity * 2})`;
      },

      // Create ripple effect
      createRipple: function(event, element) {
        const circle = document.createElement('span');
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - element.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - element.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = element.getElementsByClassName('ripple')[0];
        if (ripple) {
          ripple.remove();
        }

        element.appendChild(circle);
      },

      // Generate random glass pattern
      generateGlassPattern: function() {
        const patterns = [
          'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
          'radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
          'radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)',
          'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
        ];
        return patterns[Math.floor(Math.random() * patterns.length)];
      },

      // Animate element entrance
      animateIn: function(element, animation = 'fadeIn', delay = 0) {
        if (!element) return;
        
        setTimeout(function() {
          element.classList.add(`animate-${animation}`);
        }, delay);
      }
    },

    // Expose public API
    exposeAPI: function() {
      window.SimpleMorph = {
        // Public methods
        toggleMobileMenu: function() {
          const toggle = document.querySelector('.mobile-menu-toggle');
          if (toggle) toggle.click();
        },

        // Glass morphing methods
        applyGlass: function(selector, type = 'standard') {
          const elements = document.querySelectorAll(selector);
          const glassClasses = {
            standard: 'glass',
            strong: 'glass-strong',
            frosted: 'glass-frosted',
            minimal: 'glass-minimal',
            vibrant: 'glass-vibrant',
            dark: 'glass-dark',
            tinted: 'glass-tinted'
          };
          
          elements.forEach(function(element) {
            element.classList.add(glassClasses[type] || glassClasses.standard);
          });
        },

        // Animation methods
        animateElements: function(selector, animation = 'fadeIn', stagger = 100) {
          const elements = document.querySelectorAll(selector);
          elements.forEach(function(element, index) {
            SimpleMorph.utils.animateIn(element, animation, index * stagger);
          });
        },

        // Dynamic glass intensity
        setGlassIntensity: function(selector, intensity) {
          const elements = document.querySelectorAll(selector);
          elements.forEach(function(element) {
            SimpleMorph.utils.applyGlassEffect(element, intensity);
          });
        },

        // Add ripple effect to buttons
        addRippleEffect: function(selector) {
          const elements = document.querySelectorAll(selector);
          elements.forEach(function(element) {
            element.addEventListener('click', function(e) {
              SimpleMorph.utils.createRipple(e, this);
            });
          });
        },

        // Utility access
        utils: SimpleMorph.utils,

        // Configuration access
        config: SimpleMorph.config
      };
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      SimpleMorph.init();
    });
  } else {
    SimpleMorph.init();
  }

})();
