import {
  body,
  lockPadding,
  bodyLock,
  bodyUnlock,
  bodyLockStatus,
} from '../function/function';

export default function popup() {
  document.body.addEventListener('click', (e) => {
    const dataPopupOpen = e.target.closest('[data-popup-open]');
    if (dataPopupOpen) {
      e.preventDefault();
      const popupName = dataPopupOpen.getAttribute('data-popup-open');
      const currentPopup = document.getElementById(popupName);
      popupOpen(currentPopup);
      return;
    }

    const closeBtn = e.target.closest('.close-popup');
    if (closeBtn) {
      e.preventDefault();
      const popup = closeBtn.closest('.popup');
      popupClose(popup);
      return;
    }
  });

  // Закрытие по клику вне popup__content
  document.body.addEventListener('click', (e) => {
    const openPopup = document.querySelector('.popup.open');
    if (
      openPopup &&
      !e.target.closest('.popup__content') &&
      e.target.closest('.popup')
    ) {
      popupClose(openPopup);
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      const popupActive = document.querySelector('.popup.open');
      if (popupActive) {
        popupClose(popupActive);
      }
    }
  });

  function popupOpen(currentPopup) {
    if (currentPopup && bodyLockStatus) {
      const popupActive = document.querySelector('.popup.open');
      if (popupActive) {
        popupClose(popupActive, false);
      } else {
        bodyLock();
      }
      currentPopup.classList.add('open');
    }
  }

  function popupClose(popupActive, doUnlock = true) {
    if (popupActive && bodyLockStatus) {
      popupActive.classList.remove('open');
      if (doUnlock) {
        bodyUnlock();
      }
    }
  }
}
