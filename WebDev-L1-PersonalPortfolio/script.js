document.addEventListener("DOMContentLoaded", () => {

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // mobile menu toggle
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        menuToggle.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // highlight the nav link for whichever section is in view
  const sections = document.querySelectorAll("main section[id]");
  const navItems = document.querySelectorAll(".nav-link");

  const setActiveLink = (id) => {
    navItems.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.nav === id);
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  // fade/slide elements in as they scroll into view
  const revealEls = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // typewriter effect for the rotating job title
  const roleText = document.getElementById("roleText");
  const roles = ["Frontend Developer", "Machine Learning Engineer"];

  if (roleText) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const currentRole = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        roleText.textContent = currentRole.slice(0, charIndex);

        if (charIndex === currentRole.length) {
          deleting = true;
          setTimeout(tick, 2000); // pause on the full word before deleting
          return;
        }
      } else {
        charIndex--;
        roleText.textContent = currentRole.slice(0, charIndex);

        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 500); // small pause before typing the next one
          return;
        }
      }

      setTimeout(tick, deleting ? 45 : 75);
    };

    setTimeout(tick, 500);
  }

  // project filter buttons
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const filter = btn.dataset.filter;

      projectCards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !match);
      });
    });
  });

  // back to top button
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("is-visible", window.scrollY > 600);
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  // animated landmark canvas in the hero card, a nod to the
  // MediaPipe hand-tracking used in the Wasla project
  const canvas = document.getElementById("landmarkCanvas");

  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let width, height, points, raf;

    const amber = "rgba(255, 139, 61, 0.9)";
    const teal = "rgba(86, 214, 196, 0.55)";

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    };

    const makePoints = () => {
      const count = 21;
      const arr = [];

      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25
        });
      }

      return arr;
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          const maxDist = width * 0.22;

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = teal;
            ctx.globalAlpha = 1 - dist / maxDist;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;

      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = amber;
        ctx.fill();
      });

      raf = requestAnimationFrame(step);
    };

    resize();
    points = makePoints();

    if (!prefersReducedMotion) {
      step();
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    window.addEventListener("resize", () => {
      resize();
      points = makePoints();
    });
  }

});
