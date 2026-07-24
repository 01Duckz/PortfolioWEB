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

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    console.log('Message ready to send:', data);
    alert('Thank you! Your message has been submitted.');
    contactForm.reset();
  });
}