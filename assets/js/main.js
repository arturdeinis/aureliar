/* 371AURELIAR interactions. No dependencies, no build step. */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;

  /* ---------------------------------------------- header on scroll --
     A one-pixel sentinel at the top of the document. When it leaves the
     viewport the header is no longer over the hero, so it takes its solid
     state. No scroll listener: this fires twice per page, not per frame. */
  var header = doc.getElementById('header');
  if (header) {
    var sentinel = doc.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:24px;pointer-events:none';
    body.prepend(sentinel);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        header.classList.toggle('is-stuck', !entries[0].isIntersecting);
      }).observe(sentinel);
    } else {
      header.classList.add('is-stuck');
    }
  }

  /* ------------------------------------------------------ mobile menu -- */
  var burger = doc.getElementById('burger');
  var menu = doc.getElementById('menu');

  function closeMenu() {
    if (!body.classList.contains('is-menu')) return;
    body.classList.remove('is-menu', 'is-locked');
    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      burger.focus();
    }
    if (menu) {
      menu.setAttribute('aria-hidden', 'true');
      menu.setAttribute('inert', '');
    }
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = body.classList.toggle('is-menu');
      body.classList.toggle('is-locked', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.setAttribute('aria-hidden', String(!open));

      if (open) {
        menu.removeAttribute('inert');
        var firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      } else {
        menu.setAttribute('inert', '');
      }
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* --------------------------------------------------- reveal on view -- */
  var reveals = doc.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.01 });

    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  }


  /* -------------------------------------------------------- moments rail -- */
  var rail = doc.getElementById('rail');
  if (rail) {
    var railStep = function () {
      var card = rail.firstElementChild;
      return card ? card.getBoundingClientRect().width + 16 : 320;
    };

    Array.prototype.forEach.call(doc.querySelectorAll('[data-rail]'), function (btn) {
      btn.addEventListener('click', function () {
        var dir = btn.dataset.rail === 'prev' ? -1 : 1;
        rail.scrollBy({ left: dir * railStep(), behavior: 'smooth' });
      });
    });

    var syncRail = function () {
      var prev = doc.querySelector('[data-rail="prev"]');
      var next = doc.querySelector('[data-rail="next"]');
      var max = rail.scrollWidth - rail.clientWidth - 4;
      if (prev) prev.disabled = rail.scrollLeft <= 2;
      if (next) next.disabled = rail.scrollLeft >= max;
    };
    syncRail();
    rail.addEventListener('scroll', syncRail, { passive: true });

    if ('ResizeObserver' in window) {
      new ResizeObserver(syncRail).observe(rail);
    } else {
      window.addEventListener('resize', syncRail);
    }
  }

  /* --------------------------------------------- one accordion at a time -- */
  var qas = doc.querySelectorAll('.qa');
  Array.prototype.forEach.call(qas, function (qa) {
    qa.addEventListener('toggle', function () {
      if (!qa.open) return;
      Array.prototype.forEach.call(qas, function (other) {
        if (other !== qa) other.open = false;
      });
    });
  });

  /* ------------------------------------------------------------ year -- */
  Array.prototype.forEach.call(doc.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ============================== membership application ============== */
  var form = doc.getElementById('apply-form');
  if (!form) return;

  var status = doc.getElementById('form-status');
  var submitBtn = doc.getElementById('submit-btn');

  /* --------------------------------------------------------------------
     CRM HOOK
     Set ENDPOINT to the CRM / form endpoint (HubSpot, Attio, Pipedrive,
     Zapier, Make, a serverless function). While it is null the form
     validates, shows the confirmation state and logs the payload, so the
     journey can be demoed end to end before the CRM is wired.
  -------------------------------------------------------------------- */
  var ENDPOINT = null;

  function fieldOf(input) { return input.closest('.field') || input.closest('.consent'); }

  function setError(input, message) {
    var wrap = fieldOf(input);
    if (!wrap) return;
    wrap.classList.toggle('has-error', Boolean(message));
    var slot = wrap.querySelector('[data-error]')
      || (input.name === 'consent' ? doc.querySelector('[data-for="consent"]') : null);
    if (slot) slot.textContent = message || '';
    if (input.name === 'consent') {
      var consentSlot = doc.querySelector('[data-for="consent"]');
      if (consentSlot) consentSlot.textContent = message || '';
    }
  }

  function validate(input) {
    var value = (input.value || '').trim();

    if (input.type === 'checkbox') {
      if (input.required && !input.checked) return 'Please confirm to continue.';
      return '';
    }
    if (input.required && !value) return 'This field is required.';
    if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return 'Please enter a valid email address.';
    }
    if (input.type === 'tel' && value && !/^[+()\d\s-]{6,}$/.test(value)) {
      return 'Please enter a valid phone number.';
    }
    if (input.name === 'birthYear' && value && !/^(19|20)\d{2}$/.test(value)) {
      return 'Please enter a four-digit year.';
    }
    return '';
  }

  var inputs = form.querySelectorAll('input, select, textarea');

  Array.prototype.forEach.call(inputs, function (input) {
    input.addEventListener('blur', function () { setError(input, validate(input)); });
    input.addEventListener('input', function () {
      var wrap = fieldOf(input);
      if (wrap && wrap.classList.contains('has-error')) setError(input, validate(input));
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var firstInvalid = null;

    Array.prototype.forEach.call(inputs, function (input) {
      var message = validate(input);
      setError(input, message);
      if (message && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      status.textContent = 'Please complete the highlighted fields.';
      status.dataset.state = 'error';
      firstInvalid.focus();
      return;
    }

    var payload = {};
    new FormData(form).forEach(function (value, key) {
      payload[key] = key === 'consent' ? true : value;
    });
    payload.source = 'aureliar.com/apply';
    payload.submittedAt = new Date().toISOString();

    submitBtn.disabled = true;
    submitBtn.classList.add('is-busy');
    status.dataset.state = 'sending';
    status.textContent = 'Sending your application…';

    var done = function () {
      body.classList.add('is-submitted');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!ENDPOINT) {
      console.info('[371AURELIAR] application payload (no CRM endpoint set yet)', payload);
      window.setTimeout(done, 500);
      return;
    }

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed: ' + res.status);
        done();
      })
      .catch(function (err) {
        console.error(err);
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-busy');
        status.dataset.state = 'error';
        status.textContent = 'Something went wrong. Please write to members@aureliar.com.';
      });
  });
})();
