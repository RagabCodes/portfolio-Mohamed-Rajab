document.addEventListener("DOMContentLoaded", () => {
  const sections = {
    home: document.querySelector(".home"),
    about: document.querySelector(".about-me-section"),
    skills: document.querySelector(".skills-section"),
    projects: document.querySelector(".projects-section"),
    resume: document.querySelector(".resume-section"),
    contact: document.querySelector(".contact-section"),
  };

  const sectionOrder = [
    "home",
    "about",
    "skills",
    "projects",
    "resume",
    "contact",
  ];
  let currentIndex = 0; 

  const tabs = document.querySelectorAll(".am-tab");
  const homeIcons = document.querySelectorAll(".icons i");

  function showSection(name) {
    Object.values(sections).forEach((sec) => {
      if (sec) sec.style.display = "none";
    });
    if (sections[name]) {
      sections[name].style.display = name === "home" ? "flex" : "grid";
    }

    currentIndex = sectionOrder.indexOf(name);

    tabs.forEach((t) => {
      t.classList.toggle("am-tab--active", t.dataset.tab === name);
    });

    if (name === "skills") animateSkills();
    if (name === "resume" || name === "contact") animateOnScroll();
  }

  // ====== animateSkills ======
  function animateSkills() {
    const skillsProgress = {
      html: { value: 95, color: "#E44D26" },
      css: { value: 98, color: "#264de4" },
      js: { value: 75, color: "#f7df1e", textColor: "#000" },
      php: { value: 60, color: "#8892BF" },
      python: { value: 95, color: "#FFD43B", textColor: "#000" },
      git: { value: 80, color: "#F1502F" },
      github: { value: 85, color: "#333" },
      blender: { value: 60, color: "#F5792A" },
      premeir: { value: 95, color: "#9999FF" },
      arduino: { value: 70, color: "#00979D" },
      robot: { value: 60, color: "#FF4C4C" },
    };

    Object.entries(skillsProgress).forEach(
      ([key, { value, color, textColor }]) => {
        const el = document.querySelector(`.am-card--${key} .progress`);
        if (!el || el.dataset.animated) return;

        const rect = el.getBoundingClientRect();
        if (rect.top > window.innerHeight) return; 

        el.dataset.animated = "true";
        let current = 0;

        const text = document.createElement("span");
        text.style.position = "absolute";
        text.style.zIndex = "2";
        text.style.color = textColor || "#fff";
        el.appendChild(text);

        const incrementSpeed = window.innerWidth >= 900 ? 40 : 20;

        const interval = setInterval(() => {
          if (current >= value) clearInterval(interval);
          else {
            current++;
            el.style.background = `conic-gradient(${color} ${
              current * 3.6
            }deg, #444 ${current * 3.6}deg)`;
            text.textContent = current + "%";
          }
        }, incrementSpeed);
      }
    );
  }

  // ====== animateOnScroll ======
  function animateOnScroll() {
    const animatedBlocks = document.querySelectorAll(
      ".resume-block, .contact-card"
    );
    const triggerPoint = window.innerHeight - 100;

    animatedBlocks.forEach((block, index) => {
      const blockTop = block.getBoundingClientRect().top;
      if (blockTop < triggerPoint && !block.classList.contains("show")) {
        setTimeout(() => block.classList.add("show"), index * 200);
      }
    });
  }

  let isScrolling = false;

  function goNextSection() {
    if (currentIndex < sectionOrder.length - 1) {
      showSection(sectionOrder[currentIndex + 1]);
      isScrolling = true;
      setTimeout(() => (isScrolling = false), 800);
    }
  }

  function goPrevSection() {
    if (currentIndex > 0) {
      showSection(sectionOrder[currentIndex - 1]);
      isScrolling = true;
      setTimeout(() => (isScrolling = false), 800);
    }
  }

  function handleWheel(e) {
    if (window.innerWidth >= 900) return;
    if (isScrolling) return;
    e.deltaY > 0 ? goNextSection() : goPrevSection();
  }

  let touchStartY = 0;
  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (window.innerWidth >= 900 || isScrolling) return;
    const touchEndY = e.changedTouches[0].clientY;
    if (touchStartY - touchEndY > 50) goNextSection();
    else if (touchEndY - touchStartY > 50) goPrevSection();
  }

  window.addEventListener("wheel", handleWheel);
  window.addEventListener("touchstart", handleTouchStart);
  window.addEventListener("touchend", handleTouchEnd);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => showSection(tab.dataset.tab));
  });

  homeIcons.forEach((icon) => {
    icon.addEventListener("click", () => showSection(icon.dataset.tab));
  });

  showSection("home");

  ["scroll", "resize", "load"].forEach((ev) => {
    window.addEventListener(ev, () => {
      animateSkills();
      animateOnScroll();
    });
  });
});
