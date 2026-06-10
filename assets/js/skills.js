(function () {
    var animated = false;
    function animateBars() {
        if (animated) return;
        animated = true;
        document.querySelectorAll('.skill-bar-fill').forEach(function (bar) {
            var target = bar.getAttribute('data-width') || 0;
            bar.style.width = target + '%';
            /* start shimmer after fill completes */
            setTimeout(function () { bar.classList.add('animated'); }, 1500);
        });
    }
    var grid = document.getElementById('skillsGrid');
    if (!grid) return;
    if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) animateBars(); });
        }, { threshold: 0.15 });
        obs.observe(grid);
    } else {
        window.addEventListener('scroll', function () { animateBars(); }, { passive: true });
    }
})();
