'use strict';

import CounterAnimationCollection from './modules/CounterAnimation';
import Header from './modules/Header';
import headerFon from './modules/headerFon';
import spollers from './modules/spollers';
import popup from './modules/popup';
import sliderPortfolio from './modules/sliderPortfolio';

window.addEventListener('DOMContentLoaded', () => {
  new CounterAnimationCollection();
  new Header();
  headerFon();
  spollers();
  popup();
  sliderPortfolio();
});
