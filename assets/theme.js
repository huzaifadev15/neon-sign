/* =============================================
   NEON SIGN THEME — MAIN JS
   ============================================= */

(function () {
  'use strict';

  /* ---- Mobile sidebar ---- */
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.getElementById('MobileSidebar');
  const overlay = document.getElementById('MobileSidebarOverlay');
  const closeBtn = document.querySelector('.mobile-sidebar-close');

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('is-open');
    sidebar.setAttribute('aria-hidden', 'false');
    overlay && overlay.classList.add('is-visible');
    toggleBtn && toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('is-open');
    sidebar.setAttribute('aria-hidden', 'true');
    overlay && overlay.classList.remove('is-visible');
    toggleBtn && toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn && toggleBtn.addEventListener('click', openSidebar);
  closeBtn && closeBtn.addEventListener('click', closeSidebar);
  overlay && overlay.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSidebar();
  });

  /* ---- Mobile sign types accordion ---- */
  const signTypesToggle = document.querySelector('.mobile-sign-types-toggle');
  const signTypesPanel = document.getElementById('MobileSignTypes');
  const signTypesChevron = document.querySelector('.sign-types-chevron');

  signTypesToggle && signTypesToggle.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    signTypesPanel && signTypesPanel.classList.toggle('hidden');
    signTypesChevron && signTypesChevron.classList.toggle('rotate-180');
  });

  /* ---- Search drawer ---- */
  const searchToggle = document.querySelector('.search-toggle');
  const searchDrawer = document.getElementById('SearchDrawer');
  const searchClose = document.querySelector('.search-close');

  function openSearch() {
    if (!searchDrawer) return;
    searchDrawer.classList.add('is-open');
    searchDrawer.setAttribute('aria-hidden', 'false');
    searchToggle && searchToggle.setAttribute('aria-expanded', 'true');
    const input = searchDrawer.querySelector('input[type="search"]');
    input && setTimeout(() => input.focus(), 50);
  }

  function closeSearch() {
    if (!searchDrawer) return;
    searchDrawer.classList.remove('is-open');
    searchDrawer.setAttribute('aria-hidden', 'true');
    searchToggle && searchToggle.setAttribute('aria-expanded', 'false');
  }

  searchToggle && searchToggle.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    expanded ? closeSearch() : openSearch();
  });
  searchClose && searchClose.addEventListener('click', closeSearch);

  /* ---- Capsule tabs scroll ---- */
  const capsuleScrollBtn = document.querySelector('.capsule-scroll-btn');
  const capsuleScroll = document.querySelector('.capsule-tabs-scroll');

  capsuleScrollBtn && capsuleScrollBtn.addEventListener('click', function () {
    if (!capsuleScroll) return;
    capsuleScroll.scrollBy({ left: 120, behavior: 'smooth' });
  });

  /* ---- Capsule tab active state ---- */
  const capsuleTabs = document.querySelectorAll('.capsule-tab');
  capsuleTabs.forEach(function (tab) {
    if (tab.getAttribute('href') === window.location.pathname) {
      tab.classList.add('is-active');
    }
  });

  /* ---- Header scroll hide/show ---- */
  let lastScrollY = 0;
  const header = document.getElementById('SiteHeader');

  window.addEventListener('scroll', function () {
    const currentScrollY = window.scrollY;
    if (header) {
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  /* ---- Product page: thumbnail gallery ---- */
  const featuredImg = document.getElementById('ProductFeaturedImage');
  const thumbBtns = document.querySelectorAll('.thumbnail-btn');

  thumbBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const src = this.dataset.src;
      if (featuredImg && src) {
        featuredImg.src = src;
      }
      thumbBtns.forEach(function (b) { b.classList.remove('is-active'); });
      this.classList.add('is-active');
    });
  });

  /* ---- Product page: qty stepper ---- */
  function initQtyStepper(container) {
    const minus = container.querySelector('.qty-minus');
    const plus = container.querySelector('.qty-plus');
    const input = container.querySelector('.qty-input, input[type="number"]');

    minus && minus.addEventListener('click', function () {
      if (!input) return;
      const val = parseInt(input.value, 10) || 1;
      input.value = Math.max(1, val - 1);
    });

    plus && plus.addEventListener('click', function () {
      if (!input) return;
      const val = parseInt(input.value, 10) || 1;
      input.value = val + 1;
    });
  }

  document.querySelectorAll('.qty-selector').forEach(initQtyStepper);

  /* ---- Add to cart: AJAX (optional fallback) ---- */
  const productForm = document.getElementById('ProductForm');
  const addToCartBtn = productForm && productForm.querySelector('.add-to-cart-btn');

  if (productForm && addToCartBtn) {
    productForm.addEventListener('submit', function (e) {
      e.preventDefault();
      addToCartBtn.textContent = 'Adding...';
      addToCartBtn.disabled = true;

      const formData = new FormData(productForm);
      const data = {};
      formData.forEach(function (val, key) { data[key] = val; });

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) { return res.json(); })
        .then(function () {
          addToCartBtn.textContent = 'Added!';
          updateCartCount();
          setTimeout(function () {
            addToCartBtn.textContent = 'Add to Cart';
            addToCartBtn.disabled = false;
          }, 1500);
        })
        .catch(function () {
          addToCartBtn.textContent = 'Add to Cart';
          addToCartBtn.disabled = false;
        });
    });
  }

  function updateCartCount() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        document.querySelectorAll('.cart-count').forEach(function (el) {
          el.textContent = cart.item_count;
          el.style.display = cart.item_count > 0 ? 'flex' : 'none';
        });
      });
  }

  /* ---- Variant selection ---- */
  const variantInputs = document.querySelectorAll('[name^="options"]');
  const variantIdInput = document.getElementById('ProductVariantId');
  const priceEl = document.getElementById('ProductPrice');

  if (variantInputs.length && variantIdInput) {
    variantInputs.forEach(function (input) {
      input.addEventListener('change', updateVariant);
    });
  }

  function updateVariant() {
    const selected = {};
    variantInputs.forEach(function (i) {
      if (i.checked || i.type !== 'radio') {
        const name = i.name.replace('options[', '').replace(']', '');
        selected[name] = i.value;
      }
    });

    fetch(window.location.pathname + '.js')
      .then(function (r) { return r.json(); })
      .then(function (product) {
        const match = product.variants.find(function (v) {
          return v.options.every(function (opt, i) {
            return opt === selected[product.options[i]];
          });
        });
        if (match) {
          variantIdInput.value = match.id;
          if (priceEl) {
            priceEl.textContent = formatMoney(match.price);
          }
          if (addToCartBtn) {
            addToCartBtn.disabled = !match.available;
            addToCartBtn.textContent = match.available ? 'Add to Cart' : 'Sold Out';
          }
        }
      });
  }

  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

})();
