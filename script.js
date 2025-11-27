// Hero Slideshow with Random Transitions
const heroSlideshow = () => {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const transitions = ['fade', 'slide', 'zoom', 'blur'];
    
    // Randomly assign initial transitions to slides
    slides.forEach((slide, index) => {
        const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
        slide.setAttribute('data-transition', randomTransition);
    });
    
    const showSlide = (index) => {
        // Remove active class from all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Small delay to ensure transition works
        setTimeout(() => {
            // Randomly assign transition for current slide
            const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
            slides[index].setAttribute('data-transition', randomTransition);
            
            // Add active class to current slide
            slides[index].classList.add('active');
        }, 50);
    };
    
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };
    
    // Initialize first slide
    showSlide(0);
    
    // Change slide every 4-6 seconds (random interval for more dynamic feel)
    const changeSlide = () => {
        const interval = 4000 + Math.random() * 2000; // 4-6 seconds
        setTimeout(() => {
            nextSlide();
            changeSlide();
        }, interval);
    };
    
    // Start slideshow after initial delay (reduced for faster initial load)
    setTimeout(() => {
        changeSlide();
    }, 1500); // Start after 1.5 seconds for faster initial experience
};

// Initialize slideshow when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', heroSlideshow);
} else {
    heroSlideshow();
}

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenuLeft = document.getElementById('navMenuLeft');
const navMenuRight = document.getElementById('navMenuRight');

if (hamburger && navMenuRight) {
    hamburger.addEventListener('click', () => {
        // Combine both menus for mobile
        const isActive = navMenuRight.classList.contains('active');
        
        if (navMenuLeft) {
            navMenuLeft.classList.toggle('active');
        }
        navMenuRight.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (!isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
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

// Dropdown functionality for desktop and mobile
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        const dropdown = toggle.closest('.dropdown');
        if (!dropdown) return;
        
        // On mobile, toggle the dropdown
        if (window.innerWidth <= 767) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown').forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
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
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Enhanced navbar shadow on scroll
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 40px rgba(0, 0, 0, 0.12), 0 1px 0 rgba(102, 187, 106, 0.1)';
        navbar.style.background = 'linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(255, 254, 248, 0.97) 100%)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        navbar.style.background = 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 254, 248, 0.95) 100%)';
    }
    
    // Parallax effect for hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && currentScroll < window.innerHeight) {
        const parallaxSpeed = currentScroll * 0.5;
        heroContent.style.transform = `translateY(${parallaxSpeed}px)`;
        heroContent.style.opacity = 1 - (currentScroll / window.innerHeight) * 0.5;
    }
    
    lastScroll = currentScroll;
});

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
const initScrollAnimations = () => {
    // Use requestIdleCallback for better performance, fallback to setTimeout
    const scheduleAnimation = (callback) => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(callback, { timeout: 2000 });
        } else {
            setTimeout(callback, 1);
        }
    };
    
    // Animation options with different thresholds (optimized)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animation || 'fadeUp';
                
                // Add delay for stagger effect (reduced for faster feel)
                const delay = element.dataset.delay || index * 0.05;
                
                // Use requestAnimationFrame for smoother animations
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        element.classList.add('animate-in');
                        observer.unobserve(element); // Only animate once
                    }, delay * 1000);
                });
            }
        });
    }, observerOptions);

    // Animate sections (optimized with will-change)
    document.querySelectorAll('section').forEach((section, index) => {
        if (!section.id || section.id === 'home') return; // Skip hero section
        
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        section.style.willChange = 'opacity, transform';
        section.dataset.animation = 'fadeUp';
        section.dataset.delay = index * 0.05;
        observer.observe(section);
    });

    // Animate service cards with stagger (optimized)
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) scale(0.95)';
        card.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.willChange = 'opacity, transform';
        card.dataset.animation = 'fadeUpScale';
        card.dataset.delay = index * 0.1;
        observer.observe(card);
    });

    // Animate gallery items with stagger (optimized)
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px) rotateY(10deg)';
        item.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.willChange = 'opacity, transform';
        item.dataset.animation = 'fadeUpRotate';
        item.dataset.delay = index * 0.08;
        observer.observe(item);
    });

    // Animate section titles
    document.querySelectorAll('.section-title').forEach((title, index) => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(-20px)';
        title.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        title.dataset.animation = 'fadeDown';
        title.dataset.delay = 0.2;
        observer.observe(title);
    });

    // Animate info items
    document.querySelectorAll('.info-item, .feature-card').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        item.dataset.animation = 'slideRight';
        item.dataset.delay = index * 0.1;
        observer.observe(item);
    });

    // Animate buttons
    document.querySelectorAll('.btn-primary, .btn-service').forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'scale(0.9)';
        btn.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        btn.dataset.animation = 'scale';
        btn.dataset.delay = 0.3;
        observer.observe(btn);
    });

    // Animate contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.style.opacity = '0';
        contactForm.style.transform = 'translateX(30px)';
        contactForm.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        contactForm.dataset.animation = 'slideLeft';
        contactForm.dataset.delay = 0.2;
        observer.observe(contactForm);
    }

    // Animate about content
    document.querySelectorAll('.about-text, .about-image').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = index % 2 === 0 ? 'translateX(-40px)' : 'translateX(40px)';
        item.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        item.dataset.animation = index % 2 === 0 ? 'slideRight' : 'slideLeft';
        item.dataset.delay = index * 0.15;
        observer.observe(item);
    });
};

// Initialize scroll animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}

// Location Modal Functionality
const locationModal = document.getElementById('locationModal');
const modalClose = document.querySelector('.modal-close');

// Open modal when clicking Book Now/Book Appointment buttons
document.querySelectorAll('a.btn-primary, .btn-primary[href*="contact"]').forEach(button => {
    const buttonText = button.textContent.toLowerCase().trim();
    // Only trigger for Book buttons, not Send Message
    if (buttonText.includes('book') && !buttonText.includes('send')) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (locationModal) {
                locationModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }
});

// Close modal
if (modalClose) {
    modalClose.addEventListener('click', () => {
        if (locationModal) {
            locationModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// Close modal when clicking outside
if (locationModal) {
    locationModal.addEventListener('click', (e) => {
        if (e.target === locationModal) {
            locationModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && locationModal && locationModal.style.display === 'flex') {
        locationModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Global function to open location modal (used by service cards)
function openLocationModal() {
    if (locationModal) {
        locationModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
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

// Promotion Bar with Rotating Messages
const promotionMessages = [
    "🎄 Christmas Special: Book now and get 20% off on all services! Limited time offer.",
    "🎉 New Year, New Nails! Start 2024 with beautiful nails. Book your appointment today!",
    "💅 Valentine's Day Special: Treat yourself or your loved one to a luxury nail experience!",
    "🌸 Spring Collection: Fresh nail designs and colors now available!",
    "✨ Special Offer: Refer a friend and both get 15% off your next visit!",
    "🎁 Holiday Packages: Perfect gift for someone special. Gift cards available!",
    "💎 Premium Services: Experience our luxury nail treatments. Book now!",
    "🌟 Follow us on Instagram for daily nail art inspiration and special offers!"
];

let currentPromotionIndex = 0;
const promotionBar = document.getElementById('promotionBar');
const promotionText = document.getElementById('promotionText');
const promotionClose = document.getElementById('promotionClose');

// Function to adjust layout based on promotion bar visibility
const adjustLayout = (promotionVisible) => {
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');
    
    if (navbar) {
        navbar.style.top = promotionVisible ? '40px' : '0';
    }
    if (hero) {
        hero.style.marginTop = promotionVisible ? '110px' : '70px';
    }
};

// Check if promotion bar was closed in this session
const promotionClosed = sessionStorage.getItem('promotionClosed');

if (promotionBar && promotionText && !promotionClosed) {
    // Set initial message
    promotionText.textContent = promotionMessages[currentPromotionIndex];
    
    // Adjust layout for visible promotion bar
    adjustLayout(true);
    
    // Rotate messages every 20 seconds (matches animation duration)
    setInterval(() => {
        currentPromotionIndex = (currentPromotionIndex + 1) % promotionMessages.length;
        promotionText.textContent = promotionMessages[currentPromotionIndex];
    }, 20000);
    
    // Close button functionality
    if (promotionClose) {
        promotionClose.addEventListener('click', () => {
            promotionBar.classList.add('hidden');
            sessionStorage.setItem('promotionClosed', 'true');
            adjustLayout(false);
        });
    }
} else if (promotionBar && promotionClosed) {
    promotionBar.classList.add('hidden');
    adjustLayout(false);
} else {
    // No promotion bar, ensure default layout
    adjustLayout(false);
}

