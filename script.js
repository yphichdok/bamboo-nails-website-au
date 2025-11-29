// Hero Slideshow with Random Transitions - Optimized for Performance
const heroSlideshow = () => {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let isTransitioning = false;
    let slideTimeout;
    const transitions = ['fade', 'slide', 'zoom', 'blur'];
    
    // Preload images for better performance
    slides.forEach((slide) => {
        const img = slide.querySelector('img');
        if (img && !img.complete) {
            img.loading = 'eager';
        }
    });
    
    // Randomly assign initial transitions to slides
    slides.forEach((slide, index) => {
        const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
        slide.setAttribute('data-transition', randomTransition);
        // GPU acceleration
        slide.style.transform = 'translateZ(0)';
        slide.style.willChange = 'opacity, transform, filter';
    });
    
    const showSlide = (index) => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Use requestAnimationFrame for smooth transitions
        requestAnimationFrame(() => {
            // Remove active class from all slides
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Use requestAnimationFrame for next frame
            requestAnimationFrame(() => {
                // Randomly assign transition for current slide
                const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
                slides[index].setAttribute('data-transition', randomTransition);
                
                // Add active class to current slide
                slides[index].classList.add('active');
                
                // Update ARIA attributes for accessibility
                slides.forEach((slide, i) => {
                    slide.setAttribute('aria-hidden', i !== index);
                });
                
                // Reset transition flag after animation completes
                setTimeout(() => {
                    isTransitioning = false;
                }, 1000); // Max transition duration
            });
        });
    };
    
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };
    
    // Initialize first slide
    requestAnimationFrame(() => {
        showSlide(0);
    });
    
    // Change slide every 4-6 seconds (random interval for more dynamic feel)
    const changeSlide = () => {
        const interval = 4000 + Math.random() * 2000; // 4-6 seconds
        slideTimeout = setTimeout(() => {
            nextSlide();
            changeSlide();
        }, interval);
    };
    
    // Wait for page load before starting slideshow
    if (document.readyState === 'complete') {
        setTimeout(() => {
            changeSlide();
        }, 1500);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => {
                changeSlide();
            }, 1500);
        });
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (slideTimeout) clearTimeout(slideTimeout);
    });
};

// Initialize slideshow when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', heroSlideshow);
} else {
    heroSlideshow();
}

// Scroll to Top Button Functionality
const initScrollToTop = () => {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (!scrollToTopBtn) return;
    
    // Show/hide button based on scroll position
    const toggleScrollButton = () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollPosition > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    };
    
    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Check scroll position on scroll
    window.addEventListener('scroll', toggleScrollButton);
    
    // Initial check
    toggleScrollButton();
};

// Initialize scroll to top button when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollToTop);
} else {
    initScrollToTop();
}

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenuLeft = document.getElementById('navMenuLeft');
const navMenuRight = document.getElementById('navMenuRight');

if (hamburger && navMenuRight) {
    const toggleMobileMenu = () => {
        // Combine both menus for mobile
        const isActive = navMenuRight.classList.contains('active');
        
        if (navMenuLeft) {
            navMenuLeft.classList.toggle('active');
        }
        navMenuRight.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        const isExpanded = !isActive;
        hamburger.setAttribute('aria-expanded', isExpanded);
        
        // Show navbar when menu is opened (mobile)
        if (isMobileDevice() && navbar) {
            navbar.classList.remove('navbar-hidden');
            navbar.style.removeProperty('transform');
            navbar.style.top = '0';
        }
        
        // Prevent body scroll when menu is open
        if (!isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };
    
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Keyboard support for hamburger menu
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenuRight && navMenuRight.classList.contains('active') && 
            !navMenuRight.contains(e.target) && 
            !hamburger.contains(e.target) &&
            (!navMenuLeft || !navMenuLeft.contains(e.target)) &&
            !document.querySelector('.logo').contains(e.target)) {
            navMenuRight.classList.remove('active');
            if (navMenuLeft) {
                navMenuLeft.classList.remove('active');
            }
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking on a link (but not dropdown toggle or dropdown links)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // Don't close if it's a dropdown toggle - let the dropdown handler manage it
        if (link.classList.contains('dropdown-toggle')) {
            return; // Let the dropdown toggle handler manage this
        }
        
        // Don't close if clicking inside dropdown menu
        if (link.closest('.dropdown-menu')) {
            return;
        }
        
        // Close mobile menu for regular nav links
        if (window.innerWidth <= 767) {
            if (navMenuRight) {
                navMenuRight.classList.remove('active');
            }
            if (navMenuLeft) {
                navMenuLeft.classList.remove('active');
            }
            if (hamburger) {
                hamburger.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    });
});

// Dropdown functionality for desktop and mobile with keyboard support
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    const toggleDropdown = (e) => {
        const dropdown = toggle.closest('.dropdown');
        if (!dropdown) return;
        
        // On mobile, toggle the dropdown
        if (window.innerWidth <= 767) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown').forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                    const otherToggle = d.querySelector('.dropdown-toggle');
                    if (otherToggle) {
                        otherToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            // Toggle current dropdown
            const isActive = dropdown.classList.contains('active');
            dropdown.classList.toggle('active');
            toggle.setAttribute('aria-expanded', !isActive);
        }
    };
    
    toggle.addEventListener('click', toggleDropdown);
    
    // Keyboard support for dropdown
    toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown(e);
        } else if (e.key === 'Escape') {
            const dropdown = toggle.closest('.dropdown');
            if (dropdown && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const dropdown = toggle.closest('.dropdown');
            if (dropdown) {
                const firstLink = dropdown.querySelector('.dropdown-link');
                if (firstLink) {
                    firstLink.focus();
                }
            }
        }
    });
});

// Handle dropdown link clicks on mobile - close menu after navigation
document.querySelectorAll('.dropdown-link').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 767) {
            // Close mobile menu after clicking dropdown link
            setTimeout(() => {
                if (navMenuRight) {
                    navMenuRight.classList.remove('active');
                }
                if (navMenuLeft) {
                    navMenuLeft.classList.remove('active');
                }
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
                document.body.style.overflow = '';
                
                // Also close dropdown
                const dropdown = link.closest('.dropdown');
                if (dropdown) {
                    dropdown.classList.remove('active');
                }
            }, 100);
        }
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    // Desktop: close dropdown when clicking outside
    if (window.innerWidth > 767) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    } else {
        // Mobile: close dropdown when clicking outside, but not when clicking nav links
        if (!e.target.closest('.dropdown') && !e.target.closest('.nav-link') && !e.target.closest('.hamburger')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced Navbar scroll effect with parallax
let lastScroll = 0;
let lastScrollTop = 0;
let scrollTimeout;
const navbar = document.querySelector('.navbar');

// Ensure navbar exists before adding scroll listener
if (!navbar) {
    console.error('Navbar element not found');
}

// Helper function to check if mobile device
const isMobileDevice = () => window.innerWidth <= 767;

// Optimized scroll handler with throttling and requestAnimationFrame
let ticking = false;
const handleScroll = () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            const currentScrollTop = currentScroll;
            
            // Enhanced navbar shadow on scroll (only update if changed)
            if (currentScroll > 100 && lastScroll <= 100) {
                navbar.style.boxShadow = '0 4px 40px rgba(0, 0, 0, 0.12), 0 1px 0 rgba(102, 187, 106, 0.1)';
                navbar.style.background = 'linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(255, 254, 248, 0.97) 100%)';
            } else if (currentScroll <= 100 && lastScroll > 100) {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                navbar.style.background = 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 254, 248, 0.95) 100%)';
            }
            
            // Hide/show navbar on scroll (both mobile and desktop)
            // Clear any existing timeout
            clearTimeout(scrollTimeout);
            
            // Throttle scroll events for better performance
            scrollTimeout = setTimeout(() => {
                // Calculate scroll direction
                const scrollDifference = currentScrollTop - lastScrollTop;
                const scrollThreshold = 5; // Minimum scroll distance to trigger hide/show
                
                // Determine if we should hide or show
                if (Math.abs(scrollDifference) > scrollThreshold) {
                    if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
                        // Scrolling down - hide navbar
                        if (!navbar.classList.contains('navbar-hidden')) {
                            navbar.classList.add('navbar-hidden');
                        }
                    } else if (currentScrollTop < lastScrollTop || currentScrollTop <= 50) {
                        // Scrolling up or at top - show navbar
                        if (navbar.classList.contains('navbar-hidden')) {
                            navbar.classList.remove('navbar-hidden');
                        }
                    }
                }
                
                // Update lastScrollTop for next comparison
                lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
            }, 16); // ~60fps throttling
            
            // Optimized parallax effect for hero content (only if in viewport)
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && currentScroll < window.innerHeight) {
                const parallaxSpeed = currentScroll * 0.5;
                heroContent.style.transform = `translate3d(0, ${parallaxSpeed}px, 0)`;
                heroContent.style.opacity = Math.max(0.5, 1 - (currentScroll / window.innerHeight) * 0.5);
            }
            
            lastScroll = currentScroll;
            ticking = false;
        });
        ticking = true;
    }
};

window.addEventListener('scroll', handleScroll, { passive: true });

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        alert(`Thank you, ${name}! Your message has been received. We'll get back to you soon at ${email}.`);
        
        // Reset form
        contactForm.reset();
    });
}

// Enhanced Scroll Animations with Transformations
// Wait for page to be fully loaded before initializing animations
const initScrollAnimations = () => {
    // Check if page is fully loaded
    if (document.readyState !== 'complete') {
        window.addEventListener('load', initScrollAnimations);
        return;
    }
    
    // Use requestIdleCallback for better performance, fallback to setTimeout
    const scheduleAnimation = (callback) => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(callback, { timeout: 2000 });
        } else {
            setTimeout(callback, 1);
        }
    };
    
    // Optimized animation options
    const observerOptions = {
        threshold: [0, 0.1, 0.2],
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animation || 'fadeUp';
                
                // Add delay for stagger effect (reduced for faster feel)
                const delay = parseFloat(element.dataset.delay) || 0;
                
                // Use requestAnimationFrame for smoother animations
                requestAnimationFrame(() => {
                    const animate = () => {
                        element.classList.add('animate-in');
                        // Remove will-change after animation to free resources
                        setTimeout(() => {
                            element.style.willChange = 'auto';
                        }, 1000);
                        observer.unobserve(element); // Only animate once
                    };
                    
                    if (delay > 0) {
                        setTimeout(animate, delay * 1000);
                    } else {
                        animate();
                    }
                });
            }
        });
    }, observerOptions);

    // Animate sections (optimized with GPU acceleration)
    document.querySelectorAll('section').forEach((section, index) => {
        if (!section.id || section.id === 'home') return; // Skip hero section
        
        section.style.opacity = '0';
        section.style.transform = 'translate3d(0, 50px, 0)';
        section.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        section.style.willChange = 'opacity, transform';
        section.style.backfaceVisibility = 'hidden';
        section.dataset.animation = 'fadeUp';
        section.dataset.delay = index * 0.05;
        observer.observe(section);
    });

    // Animate service cards with stagger (optimized with GPU acceleration)
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translate3d(0, 40px, 0) scale(0.95)';
        card.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.willChange = 'opacity, transform';
        card.style.backfaceVisibility = 'hidden';
        card.dataset.animation = 'fadeUpScale';
        card.dataset.delay = index * 0.1;
        observer.observe(card);
    });

    // Animate gallery items with stagger (optimized with GPU acceleration)
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translate3d(0, 30px, 0) rotateY(10deg)';
        item.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.willChange = 'opacity, transform';
        item.style.backfaceVisibility = 'hidden';
        item.dataset.animation = 'fadeUpRotate';
        item.dataset.delay = index * 0.08;
        observer.observe(item);
    });

    // Animate section titles (GPU accelerated)
    document.querySelectorAll('.section-title').forEach((title, index) => {
        title.style.opacity = '0';
        title.style.transform = 'translate3d(0, -20px, 0)';
        title.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        title.style.willChange = 'opacity, transform';
        title.style.backfaceVisibility = 'hidden';
        title.dataset.animation = 'fadeDown';
        title.dataset.delay = 0.2;
        observer.observe(title);
    });

    // Animate info items (GPU accelerated)
    document.querySelectorAll('.info-item, .feature-card').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translate3d(-30px, 0, 0)';
        item.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.willChange = 'opacity, transform';
        item.style.backfaceVisibility = 'hidden';
        item.dataset.animation = 'slideRight';
        item.dataset.delay = index * 0.1;
        observer.observe(item);
    });

    // Animate buttons (GPU accelerated)
    document.querySelectorAll('.btn-primary, .btn-service').forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'scale3d(0.9, 0.9, 1)';
        btn.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        btn.style.willChange = 'opacity, transform';
        btn.style.backfaceVisibility = 'hidden';
        btn.dataset.animation = 'scale';
        btn.dataset.delay = 0.3;
        observer.observe(btn);
    });

    // Animate contact form (GPU accelerated)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.style.opacity = '0';
        contactForm.style.transform = 'translate3d(30px, 0, 0)';
        contactForm.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        contactForm.style.willChange = 'opacity, transform';
        contactForm.style.backfaceVisibility = 'hidden';
        contactForm.dataset.animation = 'slideLeft';
        contactForm.dataset.delay = 0.2;
        observer.observe(contactForm);
    }

    // Animate about content (GPU accelerated)
    document.querySelectorAll('.about-text, .about-image').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = index % 2 === 0 ? 'translate3d(-40px, 0, 0)' : 'translate3d(40px, 0, 0)';
        item.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.willChange = 'opacity, transform';
        item.style.backfaceVisibility = 'hidden';
        item.dataset.animation = index % 2 === 0 ? 'slideRight' : 'slideLeft';
        item.dataset.delay = index * 0.15;
        observer.observe(item);
    });
};

// Initialize scroll animations when page is fully loaded for better performance
if (document.readyState === 'complete') {
    // Use requestIdleCallback to initialize animations when browser is idle
    if ('requestIdleCallback' in window) {
        requestIdleCallback(initScrollAnimations, { timeout: 2000 });
    } else {
        setTimeout(initScrollAnimations, 100);
    }
} else {
    window.addEventListener('load', () => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(initScrollAnimations, { timeout: 2000 });
        } else {
            setTimeout(initScrollAnimations, 100);
        }
    });
}

// Location Modal Functionality
const locationModal = document.getElementById('locationModal');
const modalClose = document.querySelector('.modal-close');

// Modal accessibility functions
const openModal = () => {
    if (locationModal) {
        locationModal.style.display = 'flex';
        locationModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus on close button for keyboard users
        const closeBtn = locationModal.querySelector('.modal-close');
        if (closeBtn) {
            setTimeout(() => closeBtn.focus(), 100);
        }
        
        // Trap focus within modal
        trapFocus(locationModal);
    }
};

const closeModal = () => {
    if (locationModal) {
        locationModal.style.display = 'none';
        locationModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Return focus to the element that opened the modal
        const lastFocusedElement = document.activeElement;
        if (lastFocusedElement && lastFocusedElement.classList.contains('btn-service')) {
            lastFocusedElement.focus();
        }
    }
};

// Focus trap for modal (WCAG requirement)
const trapFocus = (modal) => {
    const focusableElements = modal.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', function trapHandler(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
};

// Open modal when clicking Book Now/Book Appointment buttons
document.querySelectorAll('a.btn-primary, .btn-primary[href*="contact"], button.btn-service').forEach(button => {
    const buttonText = button.textContent.toLowerCase().trim();
    // Only trigger for Book buttons, not Send Message
    if (buttonText.includes('book') && !buttonText.includes('send')) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }
});

// Close modal
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
    
    // Keyboard support for close button
    modalClose.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeModal();
        }
    });
}

// Close modal when clicking outside
if (locationModal) {
    locationModal.addEventListener('click', (e) => {
        if (e.target === locationModal) {
            closeModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && locationModal && locationModal.style.display === 'flex') {
        closeModal();
    }
});

// Global function to open location modal (used by service cards)
function openLocationModal() {
    openModal();
}

// Make openLocationModal globally accessible
window.openLocationModal = function() {
    openModal();
};

// Toggle collapsible service cards - Enhanced version
window.toggleServiceCard = function(headerElement) {
    if (!headerElement) {
        console.error('toggleServiceCard: headerElement is null');
        return;
    }
    
    const card = headerElement.closest('.collapsible-service-card');
    if (!card) {
        console.error('toggleServiceCard: Could not find .collapsible-service-card');
        return;
    }
    
    const isActive = card.classList.contains('active');
    const cardContent = card.querySelector('.card-content');
    
    // Close all other cards
    document.querySelectorAll('.collapsible-service-card').forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('active');
            const otherContent = otherCard.querySelector('.card-content');
            if (otherContent) {
                otherContent.style.maxHeight = '0';
                otherContent.style.padding = '0';
            }
        }
    });
    
    // Toggle current card
    if (isActive) {
        card.classList.remove('active');
        if (cardContent) {
            cardContent.style.maxHeight = '0';
            setTimeout(() => {
                cardContent.style.padding = '0';
            }, 300);
        }
    } else {
        card.classList.add('active');
        if (cardContent) {
            // Calculate actual height for smooth transition
            cardContent.style.maxHeight = '0';
            cardContent.style.padding = '25px';
            const scrollHeight = cardContent.scrollHeight;
            cardContent.style.maxHeight = scrollHeight + 'px';
            
            // Smooth scroll to card if needed
            setTimeout(() => {
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }
}

// Initialize collapsible cards on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize first card (Regular Nail Lacquer) as open on mobile
    const firstCard = document.querySelector('.collapsible-service-card[data-category="regular-lacquer"]');
    if (firstCard && window.innerWidth <= 768) {
        firstCard.classList.add('active');
        const firstCardContent = firstCard.querySelector('.card-content');
        if (firstCardContent) {
            // Calculate actual height for smooth transition
            firstCardContent.style.maxHeight = '0';
            firstCardContent.style.padding = '20px';
            const scrollHeight = firstCardContent.scrollHeight;
            firstCardContent.style.maxHeight = scrollHeight + 'px';
            firstCardContent.style.opacity = '1';
        }
    }
    
    // Add click event listeners to all card headers as fallback
    const cardHeaders = document.querySelectorAll('.collapsible-service-card .card-header');
    cardHeaders.forEach(header => {
        // Remove existing onclick to avoid duplicates
        header.removeAttribute('onclick');
        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.toggleServiceCard(this);
        });
        
        // Add pointer cursor
        header.style.cursor = 'pointer';
    });
    
    // Also make the entire card clickable as backup
    const cards = document.querySelectorAll('.collapsible-service-card');
    cards.forEach(card => {
        const header = card.querySelector('.card-header');
        if (header) {
            // Prevent double-clicking
            card.addEventListener('click', function(e) {
                if (e.target.closest('.card-header')) {
                    return; // Already handled by header click
                }
            });
        }
    });
});

function openLocationModal() {
    openModal();
}

// Active Navigation Link Indicator
const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-link)');
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    
    // Remove active class from all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Remove active class from dropdown toggles
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.classList.remove('active');
    });
    
    // Check main navigation links
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = href ? href.split('/').pop() : '';
        
        // Check if this link matches the current page
        if (linkPage === currentPage || 
            (currentPage === '' && (linkPage === 'index.html' || linkPage === '')) ||
            (currentPage === 'index.html' && (linkPage === 'index.html' || linkPage === '')) ||
            (currentPage === 'services.html' && linkPage === 'services.html') ||
            (currentPage === 'about.html' && linkPage === 'about.html') ||
            (currentPage === 'gallery.html' && linkPage === 'gallery.html') ||
            (currentPage === 'contact.html' && linkPage === 'contact.html')) {
            link.classList.add('active');
        }
    });
    
    // Check location pages and highlight dropdown
    if (currentPage.includes('location-coomera') || currentPage.includes('location-forest-lake')) {
        const locationDropdown = document.querySelector('.dropdown');
        if (locationDropdown) {
            const dropdownToggle = locationDropdown.querySelector('.dropdown-toggle');
            if (dropdownToggle) {
                dropdownToggle.classList.add('active');
            }
        }
        
        // Also highlight the specific location link in dropdown
        dropdownLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentPage.split('.')[0])) {
                link.classList.add('active');
            }
        });
    }
    
    // Handle home page and hash navigation
    if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
        const hash = window.location.hash;
        if (hash) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === hash || link.getAttribute('href') === hash.substring(1)) {
                    link.classList.add('active');
                }
            });
        } else {
            // Home page - highlight Home link
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === 'index.html' || href === '/' || href === '' || href === '#home') {
                    link.classList.add('active');
                }
            });
        }
    }
};

// Initialize active nav link on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setActiveNavLink);
} else {
    setActiveNavLink();
}

// Update active link when hash changes (for same-page navigation)
window.addEventListener('hashchange', setActiveNavLink);

// Promotion Bar - REMOVED
// Set hero margin to navbar height
const hero = document.querySelector('.hero');
if (hero) {
    const isMobile = window.innerWidth <= 767;
    const navbarHeight = isMobile ? 70 : 80; // Navbar height (larger now)
    hero.style.marginTop = `${navbarHeight}px`;
}

