document.addEventListener('DOMContentLoaded', function () {

    /* ================================
       MOBILE MENU TOGGLE
    ================================= */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }


    /* ================================
       FORM VALIDATION + SUBMISSION
    ================================= */
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;

            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#c9302c';
                } else {
                    field.style.borderColor = '';
                }
            });

            // Email validation
            const emailField = form.querySelector('[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.style.borderColor = '#c9302c';
                    alert('Please enter a valid email address');
                    return;
                }
            }

            // Date validation
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

            if (!isValid) return;

            // CONTACT FORM (PHP SUBMISSION)
            if (form.getAttribute('action') === 'contact.php') {

                const formData = new FormData(form);
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;

                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                fetch('contact.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            alert(data.message);
                            form.reset();
                        } else {
                            alert(data.message || 'Error sending message');
                        }
                    })
                    .catch(() => {
                        alert('Network error. Please try again later.');
                    })
                    .finally(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    });

            } else {
                // Other forms
                alert('Thank you! We will get back to you soon.');
                form.reset();
            }
        });

        // Remove error styling on input
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', function () {
                this.style.borderColor = '';
            });
        });
    });


    /* ================================
       LIGHTBOX GALLERY
    ================================= */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (lightbox && galleryItems.length > 0) {

        galleryItems.forEach(item => {
            item.addEventListener('click', function () {
                const img = this.querySelector('img');
                const caption = this.querySelector('.gallery-overlay p');

                lightbox.style.display = 'block';
                lightboxImg.src = img.src;
                lightboxCaption.textContent = caption ? caption.textContent : '';
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeLightbox();
        });
    }


    /* ================================
       SCROLL TO TOP BUTTON
    ================================= */
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    /* ================================
       NEWSLETTER FORM
    ================================= */
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMessage = document.getElementById('newsletterMessage');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('newsletterEmail').value;

            if (!email.includes('@')) {
                newsletterMessage.textContent = 'Please enter a valid email.';
                newsletterMessage.className = 'newsletter-message error';
                return;
            }

            newsletterMessage.textContent = 'Subscribed successfully!';
            newsletterMessage.className = 'newsletter-message success';
            newsletterForm.reset();

            setTimeout(() => {
                newsletterMessage.textContent = '';
            }, 4000);
        });
    }


    /* ================================
       FAQ ACCORDION
    ================================= */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');

                faqItems.forEach(other => {
                    if (other !== item) other.classList.remove('active');
                });
            });
        }
    });


    /* ================================
       GALLERY FILTER
    ================================= */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItemsFilter = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {

            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            galleryItemsFilter.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || filter === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });


    /* ================================
       LANGUAGE SWITCHER
    ================================= */
    const languageSwitcher = document.getElementById('languageSwitcher');

    const translations = {
        en: { Home: "Home", Contact: "Contact" },
        sw: { Home: "Nyumbani", Contact: "Mawasiliano" }
    };

    let lang = localStorage.getItem('lang') || 'en';

    function applyLang(l) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[l][key]) {
                el.textContent = translations[l][key];
            }
        });
    }

    if (languageSwitcher) {
        languageSwitcher.addEventListener('click', () => {
            lang = lang === 'en' ? 'sw' : 'en';
            localStorage.setItem('lang', lang);
            applyLang(lang);
        });

        applyLang(lang);
    }

});
