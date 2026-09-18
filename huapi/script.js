const tabLinks = document.querySelectorAll('.tab-btn');
const categorySections = document.querySelectorAll('[data-category]');
const tabBar = document.getElementById('tabBar');
const menuHeader = document.querySelector('.menu-header');

const setActiveTab = (targetId) => {
  tabLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.target === targetId);
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveTab(entry.target.id);
      }
    });
  },
  { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
);

categorySections.forEach((section) => sectionObserver.observe(section));

const stickyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      tabBar.classList.toggle('is-stuck', !entry.isIntersecting);
    });
  },
  { threshold: 0 }
);

stickyObserver.observe(menuHeader);