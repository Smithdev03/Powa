document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const header = document.getElementById('mainHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

   
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }


    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });


  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 2. MOBILE HAMBURGER & DRAWER MENU ---
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileToggleBtn.classList.add('active');
    mobileToggleBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileToggleBtn.classList.remove('active');
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawerLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      closeDrawer();
    });
  });

  // --- 3. ANIMATED STATISTICS COUNTER ---
  const counterElements = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function runCounters() {
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * target);

        counter.textContent = currentVal.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      }
      requestAnimationFrame(updateCounter);
    });
  }

  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          runCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.getElementById('statistics');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  } else {
    runCounters();
  }

  // --- 4. GALLERY FILTERING ---
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const categories = item.getAttribute('data-category') || '';
        if (filterVal === 'all' || categories.includes(filterVal)) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- 5. LIGHTBOX MODAL ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  let visibleGalleryItems = [];

  function updateVisibleItems() {
    visibleGalleryItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
  }

  function openLightbox(index) {
    updateVisibleItems();
    if (visibleGalleryItems.length === 0) return;

    currentGalleryIndex = index;
    const currentItem = visibleGalleryItems[currentGalleryIndex];
    const imgSrc = currentItem.getAttribute('data-src');
    const caption = currentItem.getAttribute('data-caption') || '';

    lightboxImg.src = imgSrc;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  function nextLightbox() {
    updateVisibleItems();
    currentGalleryIndex = (currentGalleryIndex + 1) % visibleGalleryItems.length;
    const currentItem = visibleGalleryItems[currentGalleryIndex];
    lightboxImg.src = currentItem.getAttribute('data-src');
    lightboxCaption.textContent = currentItem.getAttribute('data-caption') || '';
  }

  function prevLightbox() {
    updateVisibleItems();
    currentGalleryIndex = (currentGalleryIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
    const currentItem = visibleGalleryItems[currentGalleryIndex];
    lightboxImg.src = currentItem.getAttribute('data-src');
    lightboxCaption.textContent = currentItem.getAttribute('data-caption') || '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateVisibleItems();
      const index = visibleGalleryItems.indexOf(item);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextLightbox(); });
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevLightbox(); });

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    }
  });

  // --- 6. FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle clicked
        if (isActive) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // --- 7. CAMPUS TABS SWITCHER ---
  const campusTabs = document.querySelectorAll('.campus-tab-btn');
  const campusCards = document.querySelectorAll('.campus-card');

  campusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      campusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetCampus = tab.getAttribute('data-campus');
      campusCards.forEach(card => {
        if (card.id === `${targetCampus}Card`) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    });
  });

  // --- 8. CONTACT FORM VALIDATION & WHATSAPP ROUTING ---
  const contactForm = document.getElementById('schoolContactForm');
  const formAlert = document.getElementById('formAlert');
  const sendViaWhatsappBtn = document.getElementById('sendViaWhatsappBtn');

  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('contactEmail');
  const phoneInput = document.getElementById('contactPhone');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return cleanPhone.length >= 10;
  }

  function validateForm() {
    let isValid = true;

    // Reset error messages
    nameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';
    subjectError.textContent = '';
    messageError.textContent = '';

    if (!fullNameInput.value.trim()) {
      nameError.textContent = 'Please enter your full name.';
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      emailError.textContent = 'Please provide your email address.';
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!phoneInput.value.trim()) {
      phoneError.textContent = 'Please enter your phone or WhatsApp number.';
      isValid = false;
    } else if (!validatePhone(phoneInput.value.trim())) {
      phoneError.textContent = 'Please enter a valid phone number (at least 10 digits).';
      isValid = false;
    }

    if (!subjectInput.value) {
      subjectError.textContent = 'Please select an area of interest.';
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please write a brief message or question.';
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      messageError.textContent = 'Message should be at least 10 characters long.';
      isValid = false;
    }

    return isValid;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (validateForm()) {
        const submitBtn = document.getElementById('formSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

        setTimeout(() => {
          formAlert.className = 'form-alert success';
          formAlert.innerHTML = `
            <strong><i class="fa-solid fa-circle-check"></i> Thank you, ${fullNameInput.value.trim()}!</strong><br>
            Your inquiry has been received. Our Admissions Officer will contact you within 24 hours. For faster response, you can also reach us directly via WhatsApp at <strong>07032641599</strong>.
          `;
          formAlert.style.display = 'block';

          // Reset Form
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Inquiry';

          // Auto-hide alert after 8s
          setTimeout(() => {
            formAlert.style.display = 'none';
          }, 8000);
        }, 800);
      }
    });
  }

  // Send Instantly via WhatsApp button
  if (sendViaWhatsappBtn) {
    sendViaWhatsappBtn.addEventListener('click', () => {
      const name = fullNameInput.value.trim() || 'Prospective Parent';
      const email = emailInput.value.trim() || 'Not specified';
      const phone = phoneInput.value.trim() || 'Not specified';
      const subject = subjectInput.value || 'General Admission Inquiry';
      const message = messageInput.value.trim() || 'I would like to inquire about admissions and school programs.';

      const formattedText = `Hello Palace of Wisdom Academy,

I would like to submit an inquiry:
*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}
*Subject:* ${subject}
*Message:* ${message}`;

      const encodedUrl = `https://wa.me/2347032641599?text=${encodeURIComponent(formattedText)}`;
      window.open(encodedUrl, '_blank');
    });
  }

  // --- 9. LEGAL MODAL (PRIVACY POLICY & TERMS) ---
  const legalModalOverlay = document.getElementById('legalModalOverlay');
  const legalModalClose = document.getElementById('legalModalClose');
  const legalModalBody = document.getElementById('legalModalBody');
  const openPrivacyBtn = document.getElementById('openPrivacyBtn');
  const openTermsBtn = document.getElementById('openTermsBtn');

  const privacyContent = `
    <h2 style="font-family:'Outfit',sans-serif; color:#A8131D; margin-bottom:14px;">Privacy Policy</h2>
    <p style="margin-bottom:12px; font-size:0.95rem; color:#334155;"><strong>Palace of Wisdom Academy (POWA)</strong> values the privacy and confidentiality of our pupils, parents, and visitors. This policy outlines how information is handled across our academic community.</p>
    <h4 style="margin:16px 0 6px 0; color:#0F172A;">1. Information Collection</h4>
    <p style="margin-bottom:12px; font-size:0.92rem; color:#64748B;">We collect personal details such as parent names, contact phone numbers, email addresses, and pupil academic records strictly for enrollment, communication, and educational development.</p>
    <h4 style="margin:16px 0 6px 0; color:#0F172A;">2. Use of Information</h4>
    <p style="margin-bottom:12px; font-size:0.92rem; color:#64748B;">Data collected is utilized solely to facilitate school admissions, process academic transcripts, coordinate bus logistics, send emergency announcements, and notify parents of school events.</p>
    <h4 style="margin:16px 0 6px 0; color:#0F172A;">3. Data Protection</h4>
    <p style="margin-bottom:12px; font-size:0.92rem; color:#64748B;">We will never sell, lease, or distribute private contact information to unauthorized third-party commercial vendors.</p>
    <p style="font-size:0.85rem; color:#94A3B8; margin-top:20px;">Last revised: 2026 &bull; Palace of Wisdom Academy, Abeokuta, Ogun State.</p>
  `;

  const termsContent = `
    <h2 style="font-family:'Outfit',sans-serif; color:#A8131D; margin-bottom:14px;">Terms & Conditions of Admission</h2>
    <p style="margin-bottom:12px; font-size:0.95rem; color:#334155;">Welcome to <strong>Palace of Wisdom Academy (POWA)</strong>. By submitting an application or enrolling a child, parents agree to our foundational academic and conduct guidelines.</p>
    <h4 style="margin:16px 0 6px 0; color:#0F172A;">1. Code of Conduct & Values</h4>
    <p style="margin-bottom:12px; font-size:0.92rem; color:#64748B;">Every pupil is expected to embody our core values of Wisdom, Integrity, Discipline, Excellence, and Godliness. Parents partner with the school in maintaining moral and behavioral decorum.</p>
    <h4 style="margin:16px 0 6px 0; color:#0F172A;">2. Attendance & Punctuality</h4>
    <p style="margin-bottom:12px; font-size:0.92rem; color:#64748B;">School begins promptly at 7:30 AM. Regular attendance and timely resumption from holidays are mandatory for all learners.</p>
    <h4 style="margin:16px 0 6px 0; color:#0F172A;">3. Fees & School Property</h4>
    <p style="margin-bottom:12px; font-size:0.92rem; color:#64748B;">All tuition and associated levies must be settled according to published school guidelines before the stipulated deadlines. Respect for school facilities, laboratories, and grounds is strictly enforced.</p>
    <p style="font-size:0.85rem; color:#94A3B8; margin-top:20px;">Last revised: 2026 &bull; Palace of Wisdom Academy, Abeokuta, Ogun State.</p>
  `;

  function openLegalModal(content) {
    legalModalBody.innerHTML = content;
    legalModalOverlay.classList.add('active');
    legalModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLegalModal() {
    legalModalOverlay.classList.remove('active');
    legalModalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openPrivacyBtn) {
    openPrivacyBtn.addEventListener('click', () => openLegalModal(privacyContent));
  }

  if (openTermsBtn) {
    openTermsBtn.addEventListener('click', () => openLegalModal(termsContent));
  }

  if (legalModalClose) legalModalClose.addEventListener('click', closeLegalModal);
  if (legalModalOverlay) {
    legalModalOverlay.addEventListener('click', (e) => {
      if (e.target === legalModalOverlay) closeLegalModal();
    });
  }

  // Close modals on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && legalModalOverlay && legalModalOverlay.classList.contains('active')) {
      closeLegalModal();
    }
  });

  console.log('Palace of Wisdom Academy website initialized successfully.');
});
