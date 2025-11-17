/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

				});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);

/* ==================== CUSTOM FEATURES (AFTER TEMPLATE) ==================== */

// === 1. MODAL FUNCTIONS + KEYBOARD NAVIGATION ===
let currentModal = null;

function openModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (!modal) return;

  modal.style.display = 'block';
  currentModal = modal;

  // Focus trap setup
  const focusable = modal.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
  const firstFocusable = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];

  // Auto-focus first interactive element
  if (firstFocusable) firstFocusable.focus();

  // Trap Tab inside modal
  const handleTab = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  };

  modal.addEventListener('keydown', handleTab);
  modal._tabHandler = handleTab; // store for cleanup
}

function closeModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (!modal) return;

  modal.style.display = 'none';
  if (currentModal === modal) currentModal = null;

  // Clean up
  if (modal._tabHandler) {
    modal.removeEventListener('keydown', modal._tabHandler);
    delete modal._tabHandler;
  }
}

// Close with Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && currentModal) {
    const id = currentModal.id.replace('modal-', '');
    closeModal(id);
  }
});

// Close when clicking outside
window.addEventListener('click', function(e) {
  if (e.target.classList.contains('custom-modal')) {
    const id = e.target.id.replace('modal-', '');
    closeModal(id);
  }
});

// === 2. HEROICONS (safe init) ===
document.addEventListener('DOMContentLoaded', function() {
	if (typeof heroicons !== 'undefined') {
		heroicons.replace();
	}
});

// === 3. DARK MODE TOGGLE + ANIMATED ICON ===
document.addEventListener('DOMContentLoaded', function() {
	// Create toggle button
	const toggleBtn = document.createElement('button');
	toggleBtn.id = 'theme-toggle';
	toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
	toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
	document.body.appendChild(toggleBtn);

	// Load saved or system preference
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const savedTheme = localStorage.getItem('theme');
	const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

	// Apply theme
	const applyTheme = (dark) => {
		document.documentElement.classList.toggle('dark-mode', dark);
		toggleBtn.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	};

	applyTheme(isDark);

	// Toggle with animation
	toggleBtn.addEventListener('click', function() {
		const willBeDark = !document.documentElement.classList.contains('dark-mode');
		applyTheme(willBeDark);

		// 360° spin + scale animation
		toggleBtn.style.transform = 'scale(0.8) rotate(360deg)';
		toggleBtn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
		setTimeout(() => {
			toggleBtn.style.transform = '';
		}, 500);
	});

	// Sync with system changes
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
		if (!localStorage.getItem('theme')) applyTheme(e.matches);
	});
});

// === 4. SMOOTH SCROLL + REVEAL ANIMATIONS ===
const easeInOutCubic = 'cubic-bezier(0.65, 0, 0.35, 1)';
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('article > *').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.8s ${easeInOutCubic} ${i * 0.1}s, transform 0.8s ${easeInOutCubic} ${i * 0.1}s`;
    revealObserver.observe(el);
  });
});

// === 5. KEYBOARD SHORTCUT: Ctrl + K → Jump to Projects ===
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    document.querySelector('#work').scrollIntoView({ behavior: 'smooth' });
  }
});