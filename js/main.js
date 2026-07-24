const clickSound = new Audio('audio/click.wav');
const hoverSound = new Audio('audio/hover.wav');
const scrollSound = new Audio('audio/on-scroll.wav');

let lastPlayedSectionId = '';
let hoverLock = false;

function playSound(audio, volume = 0.5) {
  if (!audio) return;

  try {
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (error) {
    console.warn('Audio playback was blocked or unavailable.', error);
  }
}

function activateHoverState() {
  if (hoverLock) return;

  hoverLock = true;
  window.setTimeout(() => {
    hoverLock = false;
  }, 140);

  playSound(hoverSound, 0.60);
}

setTimeout(() => {
  document.querySelectorAll('.card').forEach((card) => card.classList.add('show'));
}, 5000);

const items = document.querySelectorAll('.reveal, .reveal-expand');
const heroSection = document.querySelector('.hero');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0.05) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  },
  {
    root: null,
    threshold: [0.05],
    rootMargin: '-20% 0px -20% 0px',
  }
);

items.forEach((element) => revealObserver.observe(element));

const sections = document.querySelectorAll('.page-section');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
        const sectionId = entry.target.id;
        if (sectionId && sectionId !== lastPlayedSectionId) {
          playSound(scrollSound, 0.25);
          lastPlayedSectionId = sectionId;
        }
      }
    });
  },
  {
    root: null,
    threshold: [0.45],
    rootMargin: '-10% 0px -10% 0px',
  }
);

sections.forEach((section) => sectionObserver.observe(section));

if (heroSection) {
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        heroSection.classList.toggle('active-section', entry.isIntersecting && entry.intersectionRatio >= 0.35);
      });
    },
    {
      root: null,
      threshold: [0.35],
      rootMargin: '-10% 0px -10% 0px',
    }
  );

  heroObserver.observe(heroSection);
}

const copyableContactItems = document.querySelectorAll('.contact-info-item[data-copy]');

copyableContactItems.forEach((item) => {
  const actionIcon = item.querySelector('.contact-info-action-icon');

  item.addEventListener('click', () => {
    const value = item.getAttribute('data-copy');
    if (!value) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).catch(() => {});
    }

    item.classList.add('copied');
    if (actionIcon) {
      actionIcon.classList.remove('bi-clipboard');
      actionIcon.classList.add('bi-check2');
    }

    window.clearTimeout(item._copyResetTimeout);
    item._copyResetTimeout = window.setTimeout(() => {
      item.classList.remove('copied');
      if (actionIcon) {
        actionIcon.classList.remove('bi-check2');
        actionIcon.classList.add('bi-clipboard');
      }
    }, 1600);
  });
});

const copyableFooterItems = document.querySelectorAll('.contact-footer-item[data-copy]');

copyableFooterItems.forEach((item) => {
  item.addEventListener('click', () => {
    const value = item.getAttribute('data-copy');
    if (!value) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).catch(() => {});
    }

    item.classList.add('copied');
    window.clearTimeout(item._copyResetTimeout);
    item._copyResetTimeout = window.setTimeout(() => {
      item.classList.remove('copied');
    }, 1600);
  });
});

const menuRibbon = document.querySelector('.menu-ribbon');
const menuPanel = document.querySelector('.menu-panel');
const projectCards = document.querySelectorAll('.project-card');

if (menuRibbon && menuPanel) {
  menuRibbon.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = menuPanel.classList.toggle('open');
    menuRibbon.setAttribute('aria-expanded', isOpen);
    menuPanel.setAttribute('aria-hidden', !isOpen);
  });

  document.addEventListener('click', (event) => {
    if (!menuPanel.contains(event.target) && !menuRibbon.contains(event.target)) {
      menuPanel.classList.remove('open');
      menuRibbon.setAttribute('aria-expanded', false);
      menuPanel.setAttribute('aria-hidden', true);
    }
  });
}

const buttonElements = document.querySelectorAll('button, [type="button"], [role="button"]');

buttonElements.forEach((button) => {
  button.addEventListener('click', () => {
    playSound(clickSound, 0.55);
  });
});

const interactiveElements = document.querySelectorAll(
  'a, button, .project-card, .cert-link, .linkedin-icon, .contact-btn, .menu-ribbon, .card'
);

interactiveElements.forEach((element) => {
  element.addEventListener('mouseenter', () => {
    activateHoverState();
  });
});

projectCards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    document.body.classList.add('project-hover-active');
  });

  card.addEventListener('mouseleave', () => {
    document.body.classList.remove('project-hover-active');
  });
});

const projectModal = document.getElementById('projectModal');
const projectModalDialog = projectModal ? projectModal.querySelector('.project-modal-dialog') : null;
const projectModalImageWrapper = document.getElementById('projectModalImageWrapper');
const projectModalImage = document.getElementById('projectModalImage');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalDescription = document.getElementById('projectModalDescription');
const projectModalTags = document.getElementById('projectModalTags');
const projectModalGithub = document.getElementById('projectModalGithub');
const projectModalMore = document.getElementById('projectModalMore');
const projectTriggers = document.querySelectorAll('[data-project-trigger]');

let lastFocusedTrigger = null;

function openProjectModal(trigger) {
  if (!projectModal) return;

  const title = trigger.getAttribute('data-title') || '';
  const image = trigger.getAttribute('data-image') || '';
  const description = trigger.getAttribute('data-description') || '';
  const tagsAttr = trigger.getAttribute('data-tags') || '';
  const github = trigger.getAttribute('data-github') || '';
  const page = trigger.getAttribute('data-page') || trigger.getAttribute('href') || '#';

  projectModalTitle.textContent = title;
  projectModalDescription.textContent = description;
  projectModalMore.setAttribute('href', page);

  if (image) {
    projectModalImage.setAttribute('src', image);
    projectModalImage.setAttribute('alt', title);
    projectModalImageWrapper.classList.remove('is-hidden');
  } else {
    projectModalImageWrapper.classList.add('is-hidden');
  }

  projectModalTags.innerHTML = '';
  if (tagsAttr) {
    tagsAttr.split(',').forEach((tag) => {
      const trimmed = tag.trim();
      if (!trimmed) return;
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = trimmed;
      projectModalTags.appendChild(span);
    });
  }

  if (github) {
    projectModalGithub.setAttribute('href', github);
    projectModalGithub.classList.remove('is-hidden');
  } else {
    projectModalGithub.classList.add('is-hidden');
  }

  lastFocusedTrigger = trigger;
  projectModal.classList.add('open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeProjectModal() {
  if (!projectModal) return;

  projectModal.classList.remove('open');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  if (lastFocusedTrigger) {
    lastFocusedTrigger.focus({ preventScroll: true });
  }
}

projectTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openProjectModal(trigger);
  });
});

if (projectModal) {
  projectModal.querySelectorAll('[data-modal-close]').forEach((element) => {
    element.addEventListener('click', closeProjectModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && projectModal.classList.contains('open')) {
      closeProjectModal();
    }
  });

  if (projectModalDialog) {
    projectModalDialog.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }
}