/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
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
	if ($nav_li.length % 2 == 0) {
		$nav.addClass('use-middle');
		$nav_li.eq($nav_li.length / 2).addClass('is-middle');
	}

	// Main.
	var delay = 325,
		locked = false;

	// Methods.
	$main._show = function(id, initial) {
		var $article = $main_articles.filter('#' + id);
		if ($article.length == 0) return;

		if (locked || (typeof initial != 'undefined' && initial === true)) {
			$body.addClass('is-switching');
			$body.addClass('is-article-visible');
			$main_articles.removeClass('active');
			$header.hide();
			$footer.hide();
			$main.show();
			$article.show();
			$article.addClass('active');
			locked = false;
			setTimeout(function() {
				$body.removeClass('is-switching');
			}, (initial ? 1000 : 0));
			return;
		}

		locked = true;

		if ($body.hasClass('is-article-visible')) {
			var $currentArticle = $main_articles.filter('.active');
			$currentArticle.removeClass('active');
			setTimeout(function() {
				$currentArticle.hide();
				$article.show();
				setTimeout(function() {
					$article.addClass('active');
					$window.scrollTop(0).triggerHandler('resize.flexbox-fix');
					setTimeout(function() { locked = false; }, delay);
				}, 25);
			}, delay);
		} else {
			$body.addClass('is-article-visible');
			setTimeout(function() {
				$header.hide();
				$footer.hide();
				$main.show();
				$article.show();
				setTimeout(function() {
					$article.addClass('active');
					$window.scrollTop(0).triggerHandler('resize.flexbox-fix');
					setTimeout(function() { locked = false; }, delay);
				}, 25);
			}, delay);
		}
	};

	$main._hide = function(addState) {
		var $article = $main_articles.filter('.active');
		if (!$body.hasClass('is-article-visible')) return;

		if (typeof addState != 'undefined' && addState === true)
			history.pushState(null, null, '#');

		if (locked) {
			$body.addClass('is-switching');
			$article.removeClass('active');
			$article.hide();
			$main.hide();
			$footer.show();
			$header.show();
			$body.removeClass('is-article-visible');
			locked = false;
			$body.removeClass('is-switching');
			$window.scrollTop(0).triggerHandler('resize.flexbox-fix');
			return;
		}

		locked = true;
		$article.removeClass('active');
		setTimeout(function() {
			$article.hide();
			$main.hide();
			$footer.show();
			$header.show();
			setTimeout(function() {
				$body.removeClass('is-article-visible');
				$window.scrollTop(0).triggerHandler('resize.flexbox-fix');
				setTimeout(function() { locked = false; }, delay);
			}, 25);
		}, delay);
	};

	// Articles.
	$main_articles.each(function() {
		var $this = $(this);
		$('<div class="close">Close</div>')
			.appendTo($this)
			.on('click', function() { location.hash = ''; });
		$this.on('click', function(event) { event.stopPropagation(); });
	});

	// Events.
	$body.on('click', function(event) {
		if ($body.hasClass('is-article-visible'))
			$main._hide(true);
	});

	$window.on('keyup', function(event) {
		if (event.keyCode === 27 && $body.hasClass('is-article-visible'))
			$main._hide(true);
	});

	$window.on('hashchange', function(event) {
		if (location.hash == '' || location.hash == '#') {
			event.preventDefault();
			event.stopPropagation();
			$main._hide();
		} else if ($main_articles.filter(location.hash).length > 0) {
			event.preventDefault();
			event.stopPropagation();
			$main._show(location.hash.substr(1));
		}
	});

	// Scroll restoration.
	if ('scrollRestoration' in history)
		history.scrollRestoration = 'manual';
	else {
		var oldScrollPos = 0, scrollPos = 0, $htmlbody = $('html,body');
		$window.on('scroll', function() {
			oldScrollPos = scrollPos;
			scrollPos = $htmlbody.scrollTop();
		}).on('hashchange', function() {
			$window.scrollTop(oldScrollPos);
		});
	}

	// Initialize.
	$main.hide();
	$main_articles.hide();

	if (location.hash != '' && location.hash != '#')
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
// === KEYBOARD SHORTCUT: Ctrl + K → Jump to Projects ===
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    document.querySelector('#work').scrollIntoView({ behavior: 'smooth' });
  }
});