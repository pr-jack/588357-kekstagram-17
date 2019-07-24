'use strict';

(function () {
  var ESC_BUTTON = 27;
  var ENTER_BUTTON = 13;

  window.utils = {
    isEscPressed: function (evt) {
      return evt.keyCode === ESC_BUTTON;
    },

    isEnterPressed: function (evt) {
      return evt.keyCode === ENTER_BUTTON;
    },

    closeElement: function (element) {
      if (element) {
        element.classList.add('hidden');
      }
    },

    addClose: function (element) {
      document.addEventListener('keydown', element);
    }
  };
})();
