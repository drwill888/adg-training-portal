/**
 * ADG Homepage Scripts — adg-home.js
 *
 * 1. Scroll Reveal — watches .adg .r elements and adds .on class
 * 2. Testimonials — filter tabs + load more button
 * 3. FAQ Accordion — aria-expanded toggle with keyboard navigation
 *
 * Child theme path:
 *   /wp-content/themes/hello-elementor-child/adg-home.js
 */

/* ── SCROLL REVEAL ───────────────────────────────────────────── */
(function () {
	'use strict';

	function init() {
		var targets = document.querySelectorAll('.adg .r');
		if (!targets.length) return;

		if (!('IntersectionObserver' in window)) {
			targets.forEach(function (el) { el.classList.add('on'); });
			return;
		}

		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('on');
					io.unobserve(entry.target);
				}
			});
		}, {
			threshold: 0.12,
			rootMargin: '0px 0px -60px 0px'
		});

		targets.forEach(function (el) { io.observe(el); });
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

/* ── TESTIMONIALS FILTER + LOAD MORE ────────────────────────── */
(function () {
	'use strict';

	var expanded = false;
	var activeFilter = 'all';

	function getCards() {
		return Array.from(document.querySelectorAll('.testi-card'));
	}

	function applyState() {
		var cards = getCards();
		if (!cards.length) return;

		var filtered = cards.filter(function (c) {
			return activeFilter === 'all' || c.dataset.category === activeFilter;
		});

		cards.filter(function (c) {
			return activeFilter !== 'all' && c.dataset.category !== activeFilter;
		}).forEach(function (c) {
			c.classList.add('adg-hidden');
		});

		if (expanded) {
			filtered.forEach(function (c) {
				c.classList.remove('adg-hidden');
			});
			var wrap = document.getElementById('testiMoreWrap');
			if (wrap) wrap.style.display = 'none';
		} else {
			filtered.forEach(function (c, i) {
				c.classList[i < 3 ? 'remove' : 'add']('adg-hidden');
			});
			var moreWrap = document.getElementById('testiMoreWrap');
			if (moreWrap) {
				if (filtered.length > 3) {
					moreWrap.style.display = 'block';
					var cnt = document.getElementById('testiMoreCount');
					if (cnt) cnt.textContent = 'Showing 3 of ' + filtered.length + ' voices';
				} else {
					moreWrap.style.display = 'none';
				}
			}
		}
	}

	function initTestimonials() {
		var moreBtn = document.getElementById('testiMoreBtn');
		if (moreBtn) {
			moreBtn.addEventListener('click', function () {
				expanded = true;
				applyState();
			});
		}

		document.querySelectorAll('.testi-btn').forEach(function (btn) {
			btn.addEventListener('click', function () {
				activeFilter = this.dataset.filter;
				expanded = false;
				document.querySelectorAll('.testi-btn').forEach(function (b) {
					b.classList.remove('adg-on');
				});
				this.classList.add('adg-on');
				applyState();
			});
		});

		applyState();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initTestimonials);
	} else {
		initTestimonials();
	}
})();

/* ── FAQ ACCORDION ───────────────────────────────────────────── */
(function () {
	'use strict';

	function initFAQ() {
		var btns = Array.from(document.querySelectorAll('.adg .faq-q'));
		if (!btns.length) return;

		btns.forEach(function (btn) {
			btn.addEventListener('click', function () {
				var isOpen   = btn.getAttribute('aria-expanded') === 'true';
				var targetId = btn.getAttribute('aria-controls');
				var answer   = targetId ? document.getElementById(targetId) : null;

				// Close all other items
				btns.forEach(function (other) {
					if (other === btn) return;
					other.setAttribute('aria-expanded', 'false');
					var otherId  = other.getAttribute('aria-controls');
					var otherAns = otherId ? document.getElementById(otherId) : null;
					if (otherAns) otherAns.setAttribute('hidden', '');
				});

				// Toggle this item
				btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
				if (answer) {
					if (isOpen) {
						answer.setAttribute('hidden', '');
					} else {
						answer.removeAttribute('hidden');
					}
				}
			});

			// Arrow key navigation between FAQ items
			btn.addEventListener('keydown', function (e) {
				var idx = btns.indexOf(btn);
				if (e.key === 'ArrowDown' && idx < btns.length - 1) {
					e.preventDefault();
					btns[idx + 1].focus();
				}
				if (e.key === 'ArrowUp' && idx > 0) {
					e.preventDefault();
					btns[idx - 1].focus();
				}
				if (e.key === 'Home') { e.preventDefault(); btns[0].focus(); }
				if (e.key === 'End')  { e.preventDefault(); btns[btns.length - 1].focus(); }
			});
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initFAQ);
	} else {
		initFAQ();
	}
})();
