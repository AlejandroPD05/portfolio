const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const langToggle = document.getElementById('langToggle');
const modeToggle = document.getElementById('modeToggle');

let currentLang = localStorage.getItem('siteLang') || 'es';
let currentMode = localStorage.getItem('siteMode') || 'light';

const typewriterElement = document.getElementById('typewriterText') || document.getElementById('loaderText');
const loaderElement = document.getElementById('initial-loader');
const fullText = "Alejandro";
let charIndex = 0;

function typeWriter() {
  if (typewriterElement && charIndex < fullText.length) {
    typewriterElement.textContent += fullText.charAt(charIndex);
    charIndex++;
    const randomDelay = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
    setTimeout(typeWriter, randomDelay);
  } else {
    setTimeout(() => {
      if (loaderElement) {
        loaderElement.classList.add('loader-hidden');
      }
      document.body.classList.add('page-loaded');
      triggerScrollReveals();
    }, 300);
  }
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.section === id);
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealTargets = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

function triggerScrollReveals() {
  revealTargets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      el.classList.add('revealed');
      revealObserver.unobserve(el);
    } else {
      revealObserver.observe(el);
    }
  });
}

const translations = {
  navInicio: { es: 'Inicio', en: 'Home' },
  navSobre: { es: 'Sobre mí', en: 'About' },
  navProyectos: { es: 'Proyectos', en: 'Projects' },
  navContacto: { es: 'Contacto', en: 'Contact' },
  heroStatus: { es: 'Disponible para nuevas oportunidades', en: 'Available for new opportunities' },
  heroDesc: {
    es: 'Resuelvo incidencias del lado del usuario y construyo la interfaz que las previene. Un perfil a medio camino entre el soporte técnico y el desarrollo web.',
    en: 'I resolve incidents from the user’s side and build the interface that prevents them. A profile halfway between technical support and web development.'
  },
  btnVerProyectos: { es: 'Ver proyectos', en: 'View projects' },
  btnContactar: { es: 'Contactar', en: 'Get in touch' },
  titleSobreMi: { es: 'Sobre mí', en: 'About Me' },
  aboutP1: {
    es: 'Empecé resolviendo incidencias de soporte N1: usuarios bloqueados, redes que fallan, aplicaciones que no arrancan y tickets que hay que priorizar y cerrar contra reloj. Ese contacto diario con el problema real de quien usa la tecnología es lo que me llevó a querer construir yo mismo las herramientas, no solo repararlas.',
    en: 'I started out resolving L1 support incidents: locked-out users, failing networks, apps that won’t start, and tickets that have to be prioritized and closed against the clock. That daily contact with the real problems of the people using the technology is what made me want to build the tools myself, not just fix them.'
  },
  aboutP2: {
    es: 'Hoy combino esa experiencia con el desarrollo de aplicaciones web: maquetación responsiva, interactividad con JavaScript y las bases de backend necesarias para que una idea funcione de principio a fin. Sigo aprendiendo cada día, con la misma disciplina con la que se cierra un ticket bien documentado.',
    en: 'Today I combine that experience with web application development: responsive layouts, JavaScript interactivity, and the backend foundations needed to take an idea from start to finish. I keep learning every day, with the same discipline it takes to close a well-documented ticket.'
  },
  statRolLabel: { es: 'rol', en: 'role' },
  statRolValue: { es: 'Técnico de Soporte IT — N1', en: 'IT Support Technician — L1' },
  statEnfoqueLabel: { es: 'enfoque', en: 'focus' },
  statEnfoqueValue: { es: 'Desarrollo Web Frontend', en: 'Frontend Web Development' },
  statModoLabel: { es: 'modo', en: 'mode' },
  statModoValue: { es: 'Full-stack en formación', en: 'Full-stack in training' },
  statUbicacionLabel: { es: 'ubicación', en: 'location' },
  statUbicacionValue: { es: 'España', en: 'Spain' },
  titleProyectos: { es: 'Proyectos', en: 'Projects' },
  projTicketingTitle: { es: 'Simulador de Ticketing', en: 'Ticketing Simulator' },
  projTicketingDesc: {
    es: 'Réplica funcional de un sistema de helpdesk: usuarios con rol de empleado o técnico, categorías de incidencia, tickets con prioridad y estado, e hilos de comentarios por ticket. Esquema relacional pensado para escalar a una aplicación Java real.',
    en: 'A functional replica of a helpdesk system: users with an employee or technician role, incident categories, tickets with priority and status, and comment threads per ticket. A relational schema designed to scale into a real Java application.'
  },
  pillRelational: { es: 'Modelo relacional', en: 'Relational model' },
  linkSchema: { es: 'Ver esquema del proyecto', en: 'View project schema' },
  projAsteroidesTitle: { es: 'Juego de Asteroides', en: 'Asteroids Game' },
  projAsteroidesDesc: {
    es: 'Clon del clásico arcade construido en Canvas y JavaScript puro: física de movimiento, colisiones, disparo y oleadas de dificultad creciente.',
    en: 'A clone of the classic arcade game built with Canvas and vanilla JavaScript: movement physics, collisions, shooting, and increasingly difficult waves.'
  },
  linkDefault: { es: 'Ver proyecto', en: 'View project' },
  projHuapiTitle: { es: 'Carta Digital — Huapi', en: 'Digital Menu — Huapi' },
  projHuapiDesc: {
    es: 'Menú digital responsivo para un negocio de comida local, con navegación por categorías y una interfaz pensada primero para móvil.',
    en: 'A responsive digital menu for a local food business, with category navigation and a mobile-first interface.'
  },
  tagAnimacion: { es: 'Frontend · Animación', en: 'Frontend · Animation' },
  projWebAnimadaTitle: { es: 'Web Animada', en: 'Animated Web Page' },
  projWebAnimadaDesc: {
    es: 'Landing page de temática romántica construida como línea de tiempo, con animaciones CSS encadenadas y revelado de contenido al hacer scroll.',
    en: 'A romantic-themed landing page built as a timeline, with chained CSS animations and scroll-triggered content reveals.'
  },
  projScriptUiTitle: { es: 'Script de UI', en: 'UI Theme Script' },
  projScriptUiDesc: {
    es: 'Fragmento de interfaz de un reproductor de vídeo al que un script inyecta un tema visual completo en verde oscuro y negro, sin tocar el HTML base.',
    en: 'A video player interface fragment where a script injects a full dark green and black visual theme, without touching the base HTML.'
  },
  titleContacto: { es: 'Contacto', en: 'Contact' },
  contactDesc: {
    es: '¿Buscas a alguien que entienda tanto el ticket como el código que lo evita? Hablemos.',
    en: 'Looking for someone who understands both the ticket and the code that prevents it? Let’s talk.'
  },
  labelCorreo: { es: 'Correo', en: 'Email' },
  footerBuilt: { es: 'Construido con HTML, CSS y JavaScript', en: 'Built with HTML, CSS and JavaScript' }
};

const applyMode = (mode) => {
  currentMode = mode;
  const isDark = mode === 'dark';

  document.documentElement.classList.toggle('dark-mode', isDark);
  document.documentElement.classList.toggle('light-mode', !isDark);
  document.body.classList.toggle('dark-mode', isDark);
  document.body.classList.toggle('light-mode', !isDark);

  if (modeToggle) {
    const label = isDark
      ? (currentLang === 'es' ? 'Cambiar a modo día' : 'Switch to day mode')
      : (currentLang === 'es' ? 'Cambiar a modo noche' : 'Switch to night mode');
    modeToggle.setAttribute('aria-label', label);
  }

  localStorage.setItem('siteMode', mode);
};

const swapLanguageContent = (lang) => {
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const entry = translations[el.dataset.i18n];
    if (entry && entry[lang]) {
      el.textContent = entry[lang];
    }
  });

  document.documentElement.lang = lang;
  if (langToggle) {
    langToggle.setAttribute('aria-label', lang === 'es' ? 'View page in English' : 'Ver página en español');
  }
  if (navToggle) {
    navToggle.setAttribute('aria-label', lang === 'es' ? 'Abrir menú' : 'Open menu');
  }

  localStorage.setItem('siteLang', lang);
};

const applyLanguage = (lang) => {
  document.body.classList.add('i18n-fade');
  setTimeout(() => {
    swapLanguageContent(lang);
    applyMode(currentMode);
    setTimeout(() => {
      document.body.classList.remove('i18n-fade');
    }, 20);
  }, 250);
};

if (langToggle) {
  langToggle.addEventListener('click', () => {
    applyLanguage(currentLang === 'es' ? 'en' : 'es');
  });
}

if (modeToggle) {
  modeToggle.addEventListener('click', () => {
    const nextMode = currentMode === 'dark' ? 'light' : 'dark';
    applyMode(nextMode);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  swapLanguageContent(currentLang);
  applyMode(currentMode);
  typeWriter();

  const scrollBtn = document.querySelector('.scroll-indicator');

if (scrollBtn) {
  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetSection = document.querySelector('#sobre-mi');

    if (targetSection) {
      const headerOffset = 72;
      const elementPosition = targetSection.getBoundingClientRect().top;
      const startPosition = window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = elementPosition + startPosition - headerOffset;
      const distance = targetPosition - startPosition;
      
      const duration = 600;
      let start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const time = Math.min(progress / duration, 1);

        const ease = time < 0.5 
          ? 4 * time * time * time 
          : 1 - Math.pow(-2 * time + 2, 3) / 2;

        window.scrollTo(0, startPosition + distance * ease);

        if (progress < duration) {
          window.requestAnimationFrame(step);
        }
      }

      window.requestAnimationFrame(step);
    }
  });
}
});