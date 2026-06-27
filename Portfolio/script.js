document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME TOGGLE FUNCTIONALITY
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme in localStorage, default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        showToast(`<i class="fa-solid fa-circle-half-stroke"></i> Switched to ${newTheme} mode!`, 'success');
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
            themeIcon.style.color = '#eab308'; // Warm yellow for sun
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            themeIcon.style.color = '#7c3aed'; // Purple for moon
        }
    }

    // ==========================================================================
    // STICKY HEADER & ACTIVE SECTION NAV HIGHLIGHTING
    // ==========================================================================
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        // Sticky nav
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Scrollspy navigation highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - parseInt(getComputedStyle(document.documentElement).scrollPaddingTop || 0) - 20;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Back to top button click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================================================
    // MOBILE NAVIGATION MENU
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Toggle menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });

    // Close menu when clicking nav links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileNav.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });

    // ==========================================================================
    // INTERSECTION OBSERVER - SCROLL REVEAL ANIMATIONS
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it is revealed, we can unobserve if we only want it to run once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before coming fully into view
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // PROJECTS FILTERING GALLERY
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from other filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const techCategory = card.getAttribute('data-tech');
                
                // Add class to animate card exit
                card.style.opacity = '0';
                card.style.transform = 'scale(0.85) translateY(15px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || techCategory === filterValue) {
                        card.style.display = 'flex';
                        // Trigger reflow to apply transition
                        card.offsetHeight; 
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0)';
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // ==========================================================================
    // CONTACT FORM VALIDATION & SIMULATED SUBMIT
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        // Simple validation
        if (nameInput.value.trim() === '' || emailInput.value.trim() === '' || messageInput.value.trim() === '') {
            showToast('<i class="fa-solid fa-triangle-exclamation"></i> Please fill out all fields.', 'error');
            return;
        }

        if (!validateEmail(emailInput.value)) {
            showToast('<i class="fa-solid fa-triangle-exclamation"></i> Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form processing state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

        // Validate configuration first
        if (typeof EMAILJS_PUBLIC_KEY === 'undefined' || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY" || EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID") {
            showToast('<i class="fa-solid fa-triangle-exclamation"></i> Action Required: Open email.js and add your EmailJS Public Key & Template ID.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            return;
        }

        // Send form using EmailJS
        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm, {
            publicKey: EMAILJS_PUBLIC_KEY
        })
            .then(() => {
                showToast('<i class="fa-solid fa-circle-check"></i> Thank you! Your message was sent successfully.', 'success');
                contactForm.reset();
            })
            .catch((error) => {
                console.error('EmailJS Error:', error);
                const errorMsg = error.text || error.message || 'Unknown error';
                showToast(`<i class="fa-solid fa-circle-exclamation"></i> Failed: ${errorMsg}`, 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // ==========================================================================
    // CV DOWNLOAD INTERACTIVE TOAST
    // ==========================================================================
    const downloadCvBtn = document.getElementById('download-cv-btn');
    downloadCvBtn.addEventListener('click', () => {
        showToast('<i class="fa-solid fa-file-arrow-down"></i> Downloading Achala Karunarathna\'s CV...', 'success');
    });

    // ==========================================================================
    // CUSTOM TOAST NOTIFICATION SYSTEM
    // ==========================================================================
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconHtml = '';
        if (type === 'success') {
            iconHtml = '<span class="toast-icon"><i class="fa-solid fa-circle-check"></i></span>';
        } else if (type === 'error') {
            iconHtml = '<span class="toast-icon"><i class="fa-solid fa-circle-exclamation"></i></span>';
        }

        toast.innerHTML = `
            ${iconHtml}
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger show animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 50);

        // Hide and remove after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            // Remove from DOM after transition finishes
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }
});
