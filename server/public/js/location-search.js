/**
 * Location Search Component — location-search.js
 * ════════════════════════════════════════════════════════════════
 *
 * Initialises every `.ls-wrapper` on the page automatically.
 *
 * Google Places API key is read from:
 *   <meta name="google-places-api-key" content="YOUR_KEY">
 * placed in the <head>.
 *
 * Per-instance config is read from data attributes on .ls-wrapper:
 *   data-ls-id         — unique id (matches component id prop)
 *   data-ls-on-select  — global function name to call with the
 *                        selected place object
 *
 * The onSelect callback receives a plain object:
 * {
 *   placeId      : string,
 *   name         : string,          // primary text (e.g. "Kathmandu")
 *   description  : string,          // full description
 *   secondaryText: string,          // secondary text (e.g. "Nepal")
 *   lat          : number | null,   // after geocoding (optional)
 *   lng          : number | null,
 * }
 *
 * ════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ── Constants ──────────────────────────────────────────────── */
  const DEBOUNCE_MS = 300;
  const MIN_CHARS = 2;
  const MAX_SUGGESTIONS = 5;

  /* ── Utility: debounce ──────────────────────────────────────── */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /* ── Load Google Places script once ─────────────────────────── */
  function loadGooglePlaces(apiKey) {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps && window.google.maps.places) {
        return resolve();
      }

      // Avoid loading twice
      if (document.getElementById('ls-google-places-script')) {
        // Poll until google maps is ready
        const poll = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            clearInterval(poll);
            resolve();
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.id = 'ls-google-places-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load Google Places API'));
      document.head.appendChild(script);
    });
  }

  /* ── Build a single suggestion <li> ─────────────────────────── */
  function buildItem(prediction) {
    const li = document.createElement('li');
    li.className = 'ls-item';
    li.setAttribute('role', 'option');
    li.setAttribute('data-place-id', prediction.place_id);

    const mainText = prediction.structured_formatting?.main_text
      || prediction.description.split(',')[0];
    const subText = prediction.structured_formatting?.secondary_text
      || prediction.description.split(',').slice(1).join(',').trim();

    li.innerHTML = `
      <span class="ls-item-icon" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </span>
      <span class="ls-item-text">
        <span class="ls-item-main">${escapeHtml(mainText)}</span>
        ${subText ? `<span class="ls-item-sub">${escapeHtml(subText)}</span>` : ''}
      </span>
    `;

    return li;
  }

  /* ── Escape HTML ─────────────────────────────────────────────── */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ══════════════════════════════════════════════════════════════
     LocationSearch — per-instance controller
     ══════════════════════════════════════════════════════════════ */
  class LocationSearch {
    constructor(wrapper, autocompleteService) {
      this.id = wrapper.dataset.lsId;
      this.onSelectFn = wrapper.dataset.lsOnSelect || '';
      this.service = autocompleteService;

      this.wrapper = wrapper;
      this.input = document.getElementById(`ls-input-${this.id}`);
      this.dropdown = document.getElementById(`ls-dropdown-${this.id}`);
      this.clearBtn = document.getElementById(`ls-clear-${this.id}`);
      this.statusEl = document.getElementById(`ls-status-${this.id}`);

      this._predictions = [];
      this._activeIndex = -1;
      this._sessionToken = null;
      this._selectedPlace = null;

      this._renewSessionToken();
      this._bindEvents();
    }

    /* ── Session token ──────────────────────────────────────────── */
    _renewSessionToken() {
      this._sessionToken = new google.maps.places.AutocompleteSessionToken();
    }

    /* ── Event binding ──────────────────────────────────────────── */
    _bindEvents() {
      const debouncedSearch = debounce(this._fetchPredictions.bind(this), DEBOUNCE_MS);

      this.input.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        this._selectedPlace = null;
        this._toggleClear(val.length > 0);

        if (val.length < MIN_CHARS) {
          this._closeDropdown();
          return;
        }

        this._showLoading();
        debouncedSearch(val);
      });

      this.input.addEventListener('keydown', this._handleKeydown.bind(this));
      this.input.addEventListener('focus', this._onFocus.bind(this));

      // Clear button
      this.clearBtn.addEventListener('click', () => this._clear());

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.wrapper.contains(e.target)) this._closeDropdown();
      });

      // Dropdown item clicks (delegated)
      this.dropdown.addEventListener('click', (e) => {
        const item = e.target.closest('.ls-item');
        if (item) this._selectByIndex(
          [...this.dropdown.children].indexOf(item)
        );
      });
    }

    /* ── Focus: re-show dropdown if we have predictions ─────────── */
    _onFocus() {
      if (this._predictions.length > 0 && !this._selectedPlace) {
        this._renderDropdown();
      }
    }

    /* ── Fetch predictions from Google Places ────────────────────── */
    _fetchPredictions(query) {
      this.service.getPlacePredictions(
        {
          input: query,
          sessionToken: this._sessionToken,
          types: ['geocode', 'establishment'],
        },
        (predictions, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
            this._predictions = [];
            this._showStatus(
              status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS
                ? 'No locations found.'
                : 'Could not load suggestions.'
            );
            return;
          }

          this._predictions = predictions.slice(0, MAX_SUGGESTIONS);
          this._hideStatus();
          this._renderDropdown();
        }
      );
    }

    /* ── Render dropdown items ───────────────────────────────────── */
    _renderDropdown() {
      this.dropdown.innerHTML = '';
      this._activeIndex = -1;

      this._predictions.forEach((pred) => {
        this.dropdown.appendChild(buildItem(pred));
      });

      this.dropdown.classList.remove('hidden');
      this.input.setAttribute('aria-expanded', 'true');
    }

    /* ── Select a prediction by dropdown index ───────────────────── */
    _selectByIndex(idx) {
      const prediction = this._predictions[idx];
      if (!prediction) return;

      const mainText = prediction.structured_formatting?.main_text
        || prediction.description.split(',')[0];
      const subText = prediction.structured_formatting?.secondary_text || '';

      // Build result object
      const placeObj = {
        placeId: prediction.place_id,
        name: mainText,
        description: prediction.description,
        secondaryText: subText,
        lat: null,
        lng: null,
      };

      this._selectedPlace = placeObj;
      this.input.value = prediction.description;
      this._toggleClear(true);
      this._closeDropdown();
      this._renewSessionToken();

      // Fire the consumer callback
      if (this.onSelectFn && typeof window[this.onSelectFn] === 'function') {
        window[this.onSelectFn](placeObj, this.id);
      }

      // Dispatch a custom DOM event for flexibility
      this.wrapper.dispatchEvent(new CustomEvent('ls:select', {
        bubbles: true,
        detail: placeObj,
      }));
    }

    /* ── Keyboard navigation ─────────────────────────────────────── */
    _handleKeydown(e) {
      const items = [...this.dropdown.querySelectorAll('.ls-item')];
      if (items.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this._activeIndex = Math.min(this._activeIndex + 1, items.length - 1);
          this._highlightItem(items);
          break;

        case 'ArrowUp':
          e.preventDefault();
          this._activeIndex = Math.max(this._activeIndex - 1, 0);
          this._highlightItem(items);
          break;

        case 'Enter':
          e.preventDefault();
          if (this._activeIndex >= 0) {
            this._selectByIndex(this._activeIndex);
          } else if (items.length > 0) {
            this._selectByIndex(0);
          }
          break;

        case 'Escape':
          this._closeDropdown();
          break;
      }
    }

    _highlightItem(items) {
      items.forEach((el, i) => {
        el.classList.toggle('ls-item--active', i === this._activeIndex);
      });
    }

    /* ── Loading state ───────────────────────────────────────────── */
    _showLoading() {
      this.dropdown.classList.add('hidden');
      this.statusEl.innerHTML = `<span class="ls-spinner"></span> Searching…`;
      this.statusEl.classList.remove('hidden');
    }

    _showStatus(msg) {
      this.dropdown.classList.add('hidden');
      this.statusEl.textContent = msg;
      this.statusEl.classList.remove('hidden');
    }

    _hideStatus() {
      this.statusEl.classList.add('hidden');
    }

    /* ── Toggle clear button ─────────────────────────────────────── */
    _toggleClear(show) {
      this.clearBtn.classList.toggle('hidden', !show);
    }

    /* ── Clear input ─────────────────────────────────────────────── */
    _clear() {
      this.input.value = '';
      this._predictions = [];
      this._selectedPlace = null;
      this._toggleClear(false);
      this._closeDropdown();
      this.input.focus();

      // Notify consumer of clear
      this.wrapper.dispatchEvent(new CustomEvent('ls:clear', { bubbles: true, detail: { id: this.id } }));
    }

    /* ── Close dropdown ──────────────────────────────────────────── */
    _closeDropdown() {
      this.dropdown.classList.add('hidden');
      this._hideStatus();
      this.input.setAttribute('aria-expanded', 'false');
      this._activeIndex = -1;
    }
  }

  /* ══════════════════════════════════════════════════════════════
     Bootstrap — run after DOM is ready
     ══════════════════════════════════════════════════════════════ */
  function init() {
    const keyMeta = document.querySelector('meta[name="google-places-api-key"]');
    if (!keyMeta || !keyMeta.content) {
      console.warn('[LocationSearch] No <meta name="google-places-api-key"> found. Component disabled.');
      return;
    }

    const apiKey = keyMeta.content;

    loadGooglePlaces(apiKey)
      .then(() => {
        const service = new google.maps.places.AutocompleteService();

        document.querySelectorAll('.ls-wrapper').forEach((wrapper) => {
          new LocationSearch(wrapper, service);
        });
      })
      .catch((err) => {
        console.error('[LocationSearch]', err.message);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Public API (optional programmatic init) ─────────────────── */
  window.LocationSearch = { init };

})();
