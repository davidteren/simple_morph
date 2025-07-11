/**
 * Nebula CSS Framework - JavaScript Module
 * Version 1.0.0
 *
 * Provides interactive functionality for the Nebula CSS framework
 * including mobile menu, animations, and component behaviors.
 */

(function() {
  'use strict';

  // Framework initialization
  const Nebula = {
    // Configuration
    config: {
      mobileBreakpoint: 768,
      animationDuration: 300,
      scrollOffset: 80
    },

    // Initialize the framework
    init() {
      this.setupMobileMenu();
      this.setupSmoothScrolling();
      this.setupAnimations();
      this.setupInteractiveElements();
      this.setupBackgroundEffects();
      this.setupTiltEffects();
      this.setupHoverGlow();
      console.log('🚀 Nebula CSS Framework initialized');
    },

    // Mobile menu functionality
    setupMobileMenu() {
      const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
      const mobileMenu = document.querySelector('.mobile-menu');
      const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

      if (!mobileMenuToggle || !mobileMenu) return;

      // Toggle mobile menu
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });

      // Close menu when clicking links
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        }
      });

      // Close menu when clicking outside
      mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    },

    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#') return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();

            // Update active link highlighting
            document.querySelectorAll('.navbar-nav a').forEach(a => a.classList.remove('current'));
            const navbarLink = document.querySelector(`.navbar-nav a[href="${href}"]`) || anchor;
            navbarLink.classList.add('current');

            const offsetTop = target.offsetTop - this.config.scrollOffset;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        });
      });
    },

    // Setup scroll-triggered animations
    setupAnimations() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, observerOptions);

      document.querySelectorAll('.fade-in, .card, .alert').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });
    },

    // Setup interactive elements
    setupInteractiveElements() {
      this.setupDropdowns();
      this.setupTabs();
      this.setupTooltips();
      this.setupProgressBars();
      this.setupModals();
      this.setupPagination();
      this.setupAlerts();
    },

    // Dropdown functionality
    setupDropdowns() {
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');

        if (!trigger || !menu) return;

        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          menu.classList.toggle('show');
        });

        document.addEventListener('click', () => {
          menu.classList.remove('show');
        });
      });
    },

    // Tab functionality
    setupTabs() {
      document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
          const tabId = button.getAttribute('data-tab');
          const tabGroup = button.closest('.tabs');

          if (!tabGroup || !tabId) return;

          tabGroup.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
          tabGroup.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

          button.classList.add('active');
          const targetContent = tabGroup.querySelector(`[data-tab-content="${tabId}"]`);
          if (targetContent) {
            targetContent.classList.add('active');
          }
        });
      });
    },

    // Tooltip functionality
    setupTooltips() {
      document.querySelectorAll('[data-tooltip]').forEach(element => {
        const tooltipText = element.getAttribute('data-tooltip');

        element.addEventListener('mouseenter', (e) => {
          const tooltip = document.createElement('div');
          tooltip.className = 'tooltip';
          tooltip.textContent = tooltipText;
          tooltip.style.position = 'absolute';
          tooltip.style.background = 'var(--glass-bg)';
          tooltip.style.backdropFilter = 'blur(60px)';
          tooltip.style.border = '1px solid var(--glass-border)';
          tooltip.style.borderRadius = 'var(--border-radius)';
          tooltip.style.padding = '0.5rem 0.75rem';
          tooltip.style.fontSize = '0.875rem';
          tooltip.style.color = 'var(--text-primary)';
          tooltip.style.zIndex = '1000';
          tooltip.style.pointerEvents = 'none';
          tooltip.style.opacity = '0';
          tooltip.style.transform = 'translateY(-10px)';
          tooltip.style.transition = 'all 0.3s ease';

          document.body.appendChild(tooltip);

          const rect = element.getBoundingClientRect();
          tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
          tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

          setTimeout(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
          }, 10);

          element._tooltip = tooltip;
        });

        element.addEventListener('mouseleave', () => {
          if (element._tooltip) {
            element._tooltip.remove();
            element._tooltip = null;
          }
        });
      });
    },

    // Animated progress bars
    setupProgressBars() {
      const progressBars = document.querySelectorAll('.progress-bar[data-progress]');

      const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const progressBar = entry.target;
            const targetWidth = progressBar.getAttribute('data-progress');

            setTimeout(() => {
              progressBar.style.width = targetWidth + '%';
            }, 200);

            progressObserver.unobserve(progressBar);
          }
        });
      }, { threshold: 0.5 });

      progressBars.forEach(bar => {
        bar.style.width = '0%';
        progressObserver.observe(bar);
      });
    },

    // Modal functionality
    setupModals() {
      document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const modalId = trigger.getAttribute('data-modal-target');
          const modal = document.querySelector(modalId);
          if (modal) {
            this.openModal(modal);
          }
        });
      });

      document.querySelectorAll('.modal-close, [data-modal-close]').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const modal = closeBtn.closest('.modal');
          if (modal) {
            this.closeModal(modal);
          }
        });
      });

      document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.closeModal(modal);
          }
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const openModal = document.querySelector('.modal.open');
          if (openModal) {
            this.closeModal(openModal);
          }
        }
      });
    },

    // Open modal
    openModal(modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    // Close modal
    closeModal(modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    },

    // Pagination functionality
    setupPagination() {
      document.querySelectorAll('.pagination').forEach(pagination => {
        const buttons = pagination.querySelectorAll('button[data-page]');
        const prevBtn = pagination.querySelector('[data-pagination="prev"]');
        const nextBtn = pagination.querySelector('[data-pagination="next"]');

        let currentPage = 1;
        const targetTableId = pagination.dataset.targetTable;
        let rowsPerPage = parseInt((pagination.querySelector('.pagination-rows')?.value) || '5', 10);
        const targetTable = targetTableId ? document.getElementById(targetTableId) : null;
        const tableRows = targetTable ? Array.from(targetTable.querySelectorAll('tbody tr')) : [];
        let totalPages = tableRows.length ? Math.ceil(tableRows.length / rowsPerPage) : buttons.length;

        const rowsSelect = pagination.querySelector('.pagination-rows');
        if (rowsSelect) {
          rowsSelect.addEventListener('change', () => {
            rowsPerPage = parseInt(rowsSelect.value, 10);
            totalPages = tableRows.length ? Math.ceil(tableRows.length / rowsPerPage) : buttons.length;
            updatePagination(1);
          });
        }

        const updatePagination = (page) => {
          currentPage = page;

          buttons.forEach((btn, index) => {
            btn.classList.toggle('active', index + 1 === currentPage);
          });

          if (prevBtn) prevBtn.disabled = currentPage === 1;
          if (nextBtn) nextBtn.disabled = currentPage === totalPages;

          if (tableRows.length) {
            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            tableRows.forEach((row, idx) => {
              row.style.display = (idx >= start && idx < end) ? '' : 'none';
            });
          }

          pagination.dispatchEvent(new CustomEvent('pageChange', {
            detail: { currentPage, totalPages }
          }));
        };

        buttons.forEach((btn, index) => {
          btn.addEventListener('click', () => {
            updatePagination(index + 1);
          });
        });

        if (prevBtn) {
          prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
              updatePagination(currentPage - 1);
            }
          });
        }

        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
              updatePagination(currentPage + 1);
            }
          });
        }

        updatePagination(1);
      });
    },

    // Alert functionality
    setupAlerts() {
      document.querySelectorAll('.alert-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const alert = closeBtn.closest('.alert');
          if (alert) {
            alert.style.opacity = '0';
            alert.style.transform = 'translateX(100%)';
            setTimeout(() => {
              alert.remove();
            }, 300);
          }
        });
      });
    },

    // Background effects
    setupBackgroundEffects() {
      this.createFloatingOrbs();
      this.setupParallaxEffect();
    },

    // Create additional floating orbs
    createFloatingOrbs() {
      const orbCount = 2;
      const colors = [
        'rgba(88, 86, 214, 0.15)',
        'rgba(175, 82, 222, 0.15)'
      ];

      for (let i = 0; i < orbCount; i++) {
        const orb = document.createElement('div');
        orb.style.position = 'fixed';
        orb.style.width = Math.random() * 200 + 150 + 'px';
        orb.style.height = orb.style.width;
        orb.style.background = `radial-gradient(circle, ${colors[i]} 0%, transparent 70%)`;
        orb.style.borderRadius = '50%';
        orb.style.filter = 'blur(80px)';
        orb.style.pointerEvents = 'none';
        orb.style.zIndex = '2';
        orb.style.top = Math.random() * 100 + '%';
        orb.style.right = Math.random() * 30 + 10 + '%';
        orb.style.animation = `float ${12 + i * 3}s ease-in-out infinite ${i * 2}s`;

        document.body.appendChild(orb);
      }
    },

    // Subtle parallax effect for background elements
    setupParallaxEffect() {
      let ticking = false;

      const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach((element, index) => {
          const speed = 0.5 + (index * 0.1);
          const yPos = -(scrolled * speed);
          element.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
      };

      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      };

      window.addEventListener('scroll', requestTick);
    },

    // Tilt effect for mouse movement
    setupTiltEffects() {
      document.querySelectorAll('.tilt').forEach(el => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          const tiltMax = parseFloat(getComputedStyle(el).getPropertyValue('--tilt-max')) || 15;
          el.style.transform = `rotateY(${x * tiltMax}deg) rotateX(${-y * tiltMax}deg)`;
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
      });
    },

    // Hover glow with mouse follow
    setupHoverGlow() {
      document.querySelectorAll('.hover-glow').forEach(el => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          el.style.setProperty('--mouse-x', `${x}px`);
          el.style.setProperty('--mouse-y', `${y}px`);
        });
      });
    },

    // Utility functions
    utils: {
      debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      },

      isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Nebula.init());
  } else {
    Nebula.init();
  }

  // Expose Nebula to global scope
  window.Nebula = Nebula;
  // Helper for demo buttons
  window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
      Nebula.openModal(modal);
    }
  };

  // Glass morphism demo functionality
  window.changeGlassDemo = function(glassClass) {
    const demoCard = document.getElementById('glass-demo-card');
    const demoInfo = document.getElementById('glass-demo-info');

    if (!demoCard || !demoInfo) return;

    demoCard.classList.remove('glass-subtle', 'glass', 'glass-strong', 'glass-intense');

    demoCard.classList.add(glassClass);

    const glassInfo = {
      'glass-subtle': 'Subtle Glass (40px blur)',
      'glass': 'Standard Glass (60px blur)',
      'glass-strong': 'Strong Glass (80px blur)',
      'glass-intense': 'Intense Glass (100px blur)'
    };

    demoInfo.textContent = `Current: ${glassInfo[glassClass] || 'Unknown'}`;

    demoCard.style.transform = 'scale(0.95)';
    setTimeout(() => {
      demoCard.style.transform = 'scale(1)';
    }, 150);
  };

})();