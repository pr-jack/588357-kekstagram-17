'use strict';
// Перетаскивание слайдера
(function () {
  window.preview.effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = window.preview.effectLevelPin.getBoundingClientRect().left + window.preview.effectLevelPin.offsetWidth / 2;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoords - moveEvt.clientX;

      startCoords = moveEvt.clientX;

      var pinLeft = window.preview.effectLevelPin.offsetLeft - shift;

      var lineLeft = window.preview.effectLevelLine.getBoundingClientRect().left;
      var lineRight = window.preview.effectLevelLine.getBoundingClientRect().right;
      if (startCoords <= lineLeft) {
        pinLeft = 0;
      } else if (startCoords >= lineRight) {
        pinLeft = window.preview.effectLevelLine.clientWidth;
      }

      window.preview.effectLevelPin.style.left = pinLeft + 'px';
      window.preview.effectLevelDepth.style.width = pinLeft + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
