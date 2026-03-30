// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
    
    // Form validation and AJAX submission (for contact page)
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#c9302c';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            // Validate email format
            const emailField = form.querySelector('#email, [type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.style.borderColor = '#c9302c';
                    alert('Please enter a valid email address');
                    return;
                }
            }
            
            // Validate date is not in the past
            const dateField = form.querySelector('#eventDate');
            if (dateField && dateField.value) {
                const selectedDate = new Date(dateField.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                    isValid = false;
                    dateField.style.borderColor = '#c9302c';
                    alert('Please select a future date');
                    return;
                }
            }
            
            if (isValid) {
                // Check if this is the contact form (has action="contact.php")
                if (form.getAttribute('action') === 'contact.php') {
                    // Submit via AJAX to PHP
                    const formData = new FormData(form);
                    const submitBtn = form.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;
                    
                    fetch('contact.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert(data.message);
                            form.reset();
                        } else {
                            let errorMsg = data.message || 'An error occurred';
                            if (data.errors && data.errors.length > 0) {
                                errorMsg += '\n' + data.errors.join('\n');
                            }
                            alert(errorMsg);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Sorry, there was an error sending your message. Please try again or contact us directly.');
                    })
                    .finally(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    });
                } else {
                    // Show success message for other forms (newsletter, etc)
                    alert('Thank you for your booking request! We will get back to you within 24 hours to confirm your reservation.');
                    form.reset();
                }
            }
        });
        
        // Remove error styling on input
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        });
    });
    
    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (lightbox && galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                const caption = this.querySelector('.gallery-overlay p');
                
                if (img) {
                    lightbox.style.display = 'block';
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightboxCaption.textContent = caption ? caption.textContent : '';
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // Close lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', function() {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        // Close on background click
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    console.log('Kaboma Dancers website loaded successfully!');
});

// Scroll to Top Button
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Newsletter Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMessage = document.getElementById('newsletterMessage');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletterEmail').value;
            const form = this;
            
            // Add loading state
            form.classList.add('loading');
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            
            // Simulate API call (replace with actual email service integration)
            // Example integrations: Mailchimp, SendGrid, Netlify Forms, Formspree
            setTimeout(function() {
                // Simulate success
                if (email && email.includes('@')) {
                    newsletterMessage.className = 'newsletter-message success';
                    newsletterMessage.textContent = '✓ Thank you for subscribing! Check your email for confirmation.';
                    form.reset();
                    
                    // Store subscriber in localStorage (demo purpose)
                    let subscribers = JSON.parse(localStorage.getItem('kabomaSubscribers') || '[]');
                    subscribers.push({ email: email, date: new Date().toISOString() });
                    localStorage.setItem('kabomaSubscribers', JSON.stringify(subscribers));
                } else {
                    newsletterMessage.className = 'newsletter-message error';
                    newsletterMessage.textContent = '✗ Please enter a valid email address.';
                }
                
                // Remove loading state
                form.classList.remove('loading');
                submitBtn.textContent = originalText;
                
                // Hide message after 5 seconds
                setTimeout(function() {
                    newsletterMessage.className = 'newsletter-message';
                }, 5000);
            }, 1500);
        });
    }
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(function(item) {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                // Toggle current item
                item.classList.toggle('active');
                
                // Close other items (optional - remove if you want multiple open)
                faqItems.forEach(function(otherItem) {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        });
    }
});

// Gallery Filter
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
});

// Language Switcher (English/Swahili)
const translations = {
    en: {
        // Navigation
        'Home': 'Home',
        'About': 'About',
        'Services': 'Services',
        'Gallery': 'Gallery',
        'Team': 'Team',
        'Contact': 'Contact',
        // Hero
        'Experience the Rhythm of Kenya': 'Experience the Rhythm of Kenya',
        'Authentic Kenyan dance performances that celebrate our rich cultural heritage for local and international guests': 'Authentic Kenyan dance performances that celebrate our rich cultural heritage for local and international guests',
        'Our Services': 'Our Services',
        'Book Now': 'Book Now',
        // About Preview
        'About Us': 'About Us',
        'Discover the Heart of Kenyan Dance': 'Discover the Heart of Kenyan Dance',
        'Learn More': 'Learn More',
        // Services Preview
        'Our Services': 'Our Services',
        'We offer a variety of dance performances and experiences': 'We offer a variety of dance performances and experiences',
        // Gallery Preview
        'Our Gallery': 'Our Gallery',
        'Capturing Our Performances': 'Capturing Our Performances',
        // Testimonials
        'What Our Clients Say': 'What Our Clients Say',
        // CTA
        'Ready to Book Your Performance?': 'Ready to Book Your Performance?',
        'Contact us today to discuss your requirements and get a customized quote': 'Contact us today to discuss your requirements and get a customized quote',
        'Contact Us': 'Contact Us'
    },
    sw: {
        // Navigation
        'Home': 'Nyumbani',
        'About': 'Kuhusu',
        'Services': 'Huduma',
        'Gallery': 'Picha',
        'Team': 'Timu',
        'Contact': 'Mawasiliano',
        // Hero
        'Experience the Rhythm of Kenya': 'Pata Uzoefu wa Nyimbo za Kenya',
        'Authentic Kenyan dance performances that celebrate our rich cultural heritage for local and international guests': 'Michezo ya dansi ya Kenya halisi inayoadhimisha urithi wetu wa utamaduni kwa wageni wa ndani na kimataifa',
        'Our Services': 'Huduma Zetu',
        'Book Now': 'Panga Sasa',
        // About Preview
        'About Us': 'Kuhusu Sisi',
        'Discover the Heart of Kenyan Dance': 'Gundua Moyo wa Dansi ya Kenya',
        'Learn More': 'Soma Zaidi',
        // Services Preview
        'Our Services': 'Huduma Zetu',
        'We offer a variety of dance performances and experiences': 'Tunatoa aina mbalimbali ya maonyesho ya dansi na uzoefu',
        // Gallery Preview
        'Our Gallery': 'Picha Zetu',
        'Capturing Our Performances': 'Kukamata Maonyesho Yetu',
        // Testimonials
        'What Our Clients Say': 'Wateja Wetu Wanasema Nini',
        // CTA
        'Ready to Book Your Performance?': 'Uko Tayari Kuandaa Mchesho Wako?',
        'Contact us today to discuss your requirements and get a customized quote': 'Wasiliana nasi leo kujadili mahitaji yako na upate nukuu maalum',
        'Contact Us': 'Wasiliana nasi'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const languageSwitcher = document.getElementById('languageSwitcher');
    let currentLang = localStorage.getItem('language') || 'en';
    
    if (languageSwitcher) {
        // Update switcher UI based on current language
        updateLanguageSwitcher(currentLang);
        
        languageSwitcher.addEventListener('click', function() {
            // Toggle language
            currentLang = currentLang === 'en' ? 'sw' : 'en';
            localStorage.setItem('language', currentLang);
            
            // Update UI
            updateLanguageSwitcher(currentLang);
            translatePage(currentLang);
        });
        
        // Apply saved language on page load
        if (currentLang !== 'en') {
            translatePage(currentLang);
        }
    }
    
    function updateLanguageSwitcher(lang) {
        const enBtn = languageSwitcher.querySelector('.lang-en');
        const swBtn = languageSwitcher.querySelector('.lang-sw');
        
        if (lang === 'en') {
            enBtn.classList.add('active');
            swBtn.classList.remove('active');
        } else {
            enBtn.classList.remove('active');
            swBtn.classList.add('active');
        }
    }
    
    function translatePage(lang) {
        const translatableElements = document.querySelectorAll('[data-i18n], h1, h2, h3, h4, p, a, button, li, .section-title, .section-subtitle, .hero-title, .hero-subtitle, .cta-content h2, .cta-content p, .footer-section h3');
        
        translatableElements.forEach(function(element) {
            const key = element.getAttribute('data-i18n') || element.textContent.trim();
            
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        
        // Update html lang attribute
        document.documentElement.lang = lang;
    }
});
