// Scroll-reveal + count-up animations. Both respect prefers-reduced-motion.
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var revealed = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealed.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealed.forEach(function (el) { io.observe(el); });
  }

  var counters = document.querySelectorAll(".hero-stats dd[data-count]");
  if (reduced || !("IntersectionObserver" in window)) return;

  var animate = function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null;
    var duration = 1100;
    var step = function (ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  var cio = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          cio.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach(function (el) { cio.observe(el); });
})();
