'use strict';

(function () {
  var ESC_BUTTON = 27;

  window.utils = {
    isEscPressed: function (evt) {
      return evt.keyCode === ESC_BUTTON;
    },

    closeElement: function (element) {
      if (element) {
        element.classList.add('hidden');
      }
    },

    addEscClose: function (element) {
      document.addEventListener('keydown', element);
    }
  };
})();
