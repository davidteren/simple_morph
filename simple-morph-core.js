/* Simple Morph Core JavaScript - Essential Features Only */
/* Version 0.0.1-beta-core - Released 2025-07-30 */
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
      
      // Expose public API
      this.exposeAPI();
      
      console.log('🚀 Simple Morph Core initialized');
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

      // Check if element is in viewport
      isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
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

