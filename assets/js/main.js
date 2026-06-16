(function () {
  var root = document.documentElement;
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  var themeToggle = document.querySelector('.theme-toggle');

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  document.querySelectorAll('a[href^="https://www.linkedin.com"], a[href^="https://linkedin.com"], a[href^="https://t.me"]').forEach(function (link) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  });

  document.querySelectorAll('[data-product-preview-modal]').forEach(function (modal) {
    var openButton = document.querySelector('[data-product-preview-open]');
    var closeButtons = modal.querySelectorAll('[data-product-preview-close]');
    var slides = Array.prototype.slice.call(modal.querySelectorAll('[data-product-preview-slide]'));
    var prevButton = modal.querySelector('[data-product-preview-prev]');
    var nextButton = modal.querySelector('[data-product-preview-next]');
    var counter = modal.querySelector('[data-product-preview-counter]');
    var activeIndex = 0;

    function renderSlide(nextIndex) {
      if (!slides.length) return;
      activeIndex = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, index) {
        slide.classList.toggle('is-active', index === activeIndex);
      });
      if (counter) {
        counter.textContent = (activeIndex + 1) + ' / ' + slides.length;
      }
    }

    function openModal() {
      modal.hidden = false;
      document.body.classList.add('modal-open');
      renderSlide(0);
      var closeButton = modal.querySelector('[data-product-preview-close]');
      if (closeButton) closeButton.focus();
    }

    function closeModal() {
      modal.hidden = true;
      document.body.classList.remove('modal-open');
      if (openButton) openButton.focus();
    }

    if (openButton) {
      openButton.addEventListener('click', openModal);
    }

    closeButtons.forEach(function (button) {
      button.addEventListener('click', closeModal);
    });

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        renderSlide(activeIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        renderSlide(activeIndex + 1);
      });
    }

    document.addEventListener('keydown', function (event) {
      if (modal.hidden) return;
      if (event.key === 'Escape') closeModal();
      if (event.key === 'ArrowLeft') renderSlide(activeIndex - 1);
      if (event.key === 'ArrowRight') renderSlide(activeIndex + 1);
    });
  });
})();
