// Demo-specific helpers for the Simple Morph docs site
// Keeps demo logic out of the core library (simple-morph.js)
(function () {
  'use strict';

  function ensureCopyButtonA11y() {
    document.querySelectorAll('.copy-button').forEach(function (btn) {
      btn.setAttribute('type', 'button');
      if (!btn.getAttribute('aria-label')) {
        btn.setAttribute('aria-label', 'Copy code to clipboard');
      }
      if (!btn.getAttribute('title')) {
        btn.setAttribute('title', 'Copy code');
      } 
    });
  }

  function fallbackCopyText(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  // Expose copyCode for onclick="copyCode(this)" in markup
  window.copyCode = function (button) {
    const codeBlock = button.parentElement && button.parentElement.parentElement;
    const preElement = codeBlock ? codeBlock.querySelector('pre code') : null;
    const liveRegion = document.getElementById('live-region');

    let codeText = '';
    if (preElement) {
      codeText = preElement.textContent || '';
    } else if (codeBlock) {
      codeText = (codeBlock.textContent || '').trim();
    }

    button.setAttribute('aria-busy', 'true');

    function successFeedback() {
      const svg = button.querySelector('svg');
      const originalSvg = svg ? svg.innerHTML : '';
      button.classList.add('copied');
      if (svg) {
        svg.innerHTML = '<polyline points="20,6 9,17 4,12"></polyline>';
      }
      setTimeout(function () {
        button.classList.remove('copied');
        if (svg) svg.innerHTML = originalSvg;
      }, 1200);
      if (liveRegion) liveRegion.textContent = 'Code copied to clipboard.';
      button.setAttribute('aria-busy', 'false');
    }

    function errorFeedback() {
      if (liveRegion) liveRegion.textContent = 'Failed to copy code.';
      button.setAttribute('aria-busy', 'false');
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codeText).then(successFeedback).catch(function () {
        // Fallback
        if (fallbackCopyText(codeText)) successFeedback(); else errorFeedback();
      });
    } else {
      if (fallbackCopyText(codeText)) successFeedback(); else errorFeedback();
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    // Add ripple effect to all buttons
    if (window.SimpleMorph && SimpleMorph.addRippleEffect) {
      SimpleMorph.addRippleEffect('button, .button');
    }

    // Prepare parallax targets in the hero
    document.querySelectorAll('.hero-section').forEach(function (el) {
      el.setAttribute('data-parallax', '0.3');
    });

    // Opt-in demo effects (kept out of core init)
    if (window.SimpleMorph) {
      if (SimpleMorph.enableParallaxEffects) SimpleMorph.enableParallaxEffects();
      if (SimpleMorph.enableScrollAnimations) SimpleMorph.enableScrollAnimations();
    }

    // Animate cards on page load
    setTimeout(function () {
      if (window.SimpleMorph && SimpleMorph.animateElements) {
        SimpleMorph.animateElements('.card', 'slideUp', 100);
      }
    }, 500);

    // Ensure accessible copy buttons
    ensureCopyButtonA11y();
  });
})();
