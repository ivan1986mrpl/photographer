import { _slideUp, _slideToggle, _slideDown } from '../function/function';

export default function spollers() {
  const spollersArray = document.querySelectorAll('[data-spollers]');
  if (spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter(
      (item) => !item.dataset.spollers.split(',')[0],
    );
    if (spollersRegular.length > 0) {
      initSpollers(spollersRegular);
    }

    const spollersMedia = Array.from(spollersArray).filter(
      (item) => item.dataset.spollers.split(',')[0],
    );
    if (spollersMedia.length > 0) {
      const breakpointsArray = [];
      spollersMedia.forEach((item) => {
        const paramsArray = item.dataset.spollers.split(',');
        breakpointsArray.push({
          value: paramsArray[0],
          type: paramsArray[1] ? paramsArray[1].trim() : 'max',
          item,
        });
      });

      let mediaQueries = breakpointsArray.map(
        (item) =>
          `(${item.type}-width: ${item.value}px),${item.value},${item.type}`,
      );
      mediaQueries = mediaQueries.filter(
        (item, index, self) => self.indexOf(item) === index,
      );

      mediaQueries.forEach((breakpoint) => {
        const [mediaString, mediaValue, mediaType] = breakpoint.split(',');
        const matchMedia = window.matchMedia(mediaString);
        const relevantSpollers = breakpointsArray.filter(
          (item) => item.value === mediaValue && item.type === mediaType,
        );
        matchMedia.addListener(() => {
          initSpollers(relevantSpollers, matchMedia);
        });
        initSpollers(relevantSpollers, matchMedia);
      });
    }

    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach((spollersBlock) => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add('init');
          initSpollerBody(spollersBlock);
          spollersBlock.addEventListener('click', setSpollerAction);
        } else {
          spollersBlock.classList.remove('init');
          initSpollerBody(spollersBlock, false);
          spollersBlock.removeEventListener('click', setSpollerAction);
        }
      });
    }

    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
      if (spollerTitles.length > 0) {
        spollerTitles.forEach((spollerTitle) => {
          if (hideSpollerBody) {
            spollerTitle.removeAttribute('tabindex');
            if (!spollerTitle.classList.contains('active')) {
              spollerTitle.nextElementSibling.hidden = true;
            }
          } else {
            spollerTitle.setAttribute('tabindex', '-1');
            spollerTitle.nextElementSibling.hidden = false;
          }
        });

        const id = spollersBlock.id;
        if (id) {
          const savedIndex = localStorage.getItem(`spoller-${id}`);
          if (savedIndex !== null && spollerTitles[savedIndex]) {
            spollerTitles.forEach((title) => {
              title.classList.remove('active');
              if (title.nextElementSibling) {
                title.nextElementSibling.hidden = true;
              }
            });

            const savedTitle = spollerTitles[savedIndex];
            savedTitle.classList.add('active');
            savedTitle.nextElementSibling.hidden = false;
          } else {
            spollerTitles.forEach((title, index) => {
              if (index === 0) {
                title.classList.add('active');
                title.nextElementSibling.hidden = false;
              }
            });
          }
        }
      }
    }

    function setSpollerAction(e) {
      const el = e.target;
      if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
        const spollerTitle = el.hasAttribute('data-spoller')
          ? el
          : el.closest('[data-spoller]');
        const spollersBlock = spollerTitle.closest('[data-spollers]');
        const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');

        if (!spollersBlock.querySelectorAll('.slide').length) {
          if (oneSpoller && !spollerTitle.classList.contains('active')) {
            hideSpollersBody(spollersBlock);
          }

          spollerTitle.classList.toggle('active');
          _slideToggle(spollerTitle.nextElementSibling, 500);

          saveSpollerState(spollersBlock);
        }
        e.preventDefault();
      }
    }

    function hideSpollersBody(spollersBlock) {
      const activeTitle = spollersBlock.querySelector('[data-spoller].active');
      if (activeTitle) {
        activeTitle.classList.remove('active');
        _slideUp(activeTitle.nextElementSibling, 500);
      }
    }

    function saveSpollerState(spollersBlock) {
      const id = spollersBlock.id;
      if (!id) {
        return;
      }

      const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
      const activeIndex = Array.from(spollerTitles).findIndex((title) =>
        title.classList.contains('active'),
      );

      localStorage.setItem(`spoller-${id}`, activeIndex);
    }
  }
}
