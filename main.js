document.addEventListener('DOMContentLoaded', () => {
  // WhatsApp security - hide the number from direct inspection
  const encodedNumber = 'NjI4MjE1MTYxNDMxMw=='; // Base64 encoded '6282151614313'
  
  // Set up the WhatsApp link click event
  const whatsappLink = document.getElementById('whatsapp-link');
  if (whatsappLink) {
    whatsappLink.addEventListener('click', function(e) {
      e.preventDefault();
      // Decode the number and redirect
      const decodedNumber = atob(encodedNumber);
      window.location.href = 'https://wa.me/' + decodedNumber;
    });
  }

  // Fade in hero section on page load
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => {
      hero.classList.add('visible');
    }, 100);
  }

  // Enhanced fade in elements on scroll with better performance
  const faders = document.querySelectorAll('.fade-scroll');
  const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('visible');
        appearOnScroll.unobserve(entry.target);
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // Enhanced hamburger menu toggle with better mobile support
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  const body = document.body;

  window.toggleMenu = function() {
    const isOpen = mobileMenu.classList.contains('open');
    
    if (isOpen) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      menuOverlay.classList.remove('active');
      body.style.overflow = '';
    } else {
      mobileMenu.classList.add('open');
      hamburger.classList.add('open');
      menuOverlay.classList.add('active');
      body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  };

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMenu();
    });
  }

  // Close menu when clicking overlay
  if (menuOverlay) {
    menuOverlay.addEventListener('click', (e) => {
      if (e.target === menuOverlay) {
        toggleMenu();
      }
    });
  }

  // Close menu when clicking outside
  if (mobileMenu) {
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target) && mobileMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  }

  // Handle escape key to close menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggleMenu();
    }
  });

  // Enhanced testimonial slider with touch support
  const testimonialContainer = document.getElementById('testimonial-container');
  if (testimonialContainer) {
    const testimonials = testimonialContainer.children;
    let currentIndex = 0;
    const total = testimonials.length;
    let isTransitioning = false;

    function showTestimonials(index) {
      if (isTransitioning) return;
      isTransitioning = true;
      
      const width = testimonials[0].offsetWidth + 24; // width + margin
      testimonialContainer.style.transform = `translateX(-${width * index}px)`;
      
      setTimeout(() => {
        isTransitioning = false;
      }, 700);
    }

    function nextTestimonial() {
      currentIndex = (currentIndex + 1) % total;
      showTestimonials(currentIndex);
    }

    function prevTestimonial() {
      currentIndex = (currentIndex - 1 + total) % total;
      showTestimonials(currentIndex);
    }

    // Show initial testimonials
    showTestimonials(currentIndex);

    // Auto rotate every 5 seconds
    let autoRotate = setInterval(nextTestimonial, 5000);

    // Touch support for testimonial slider
    let startX = 0;
    let endX = 0;

    testimonialContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      clearInterval(autoRotate); // Stop auto rotation during touch
    });

    testimonialContainer.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          nextTestimonial();
        } else {
          prevTestimonial();
        }
      }
      
      // Restart auto rotation
      autoRotate = setInterval(nextTestimonial, 5000);
    });
  }

  // Close mobile menu when any link inside it is clicked
  if (mobileMenu) {
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Close mobile menu if open
        if (mobileMenu.classList.contains('open')) {
          toggleMenu();
        }
      });
    });
  }

  // Enhanced smooth scroll for anchor links (excluding mobile menu links)
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    // Skip mobile menu links as they have their own onclick handler
    if (link.closest('#mobile-menu')) {
      return;
    }
    
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetID = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetID);
      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        // Remove hash from URL without scrolling
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      // Close mobile menu if open
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Handle window resize for responsive adjustments
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recalculate testimonial positions on resize
      if (testimonialContainer) {
        showTestimonials(currentIndex);
      }
    }, 250);
  });

  // Prevent zoom on double tap for iOS
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
});
