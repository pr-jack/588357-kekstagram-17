'use strict';
// Накладываем эффекты на изображение
(function () {
  var DEFAULT_EFECT_VALUE = 100;
  var MIN_SCALE_VALUE = 25;
  var MAX_SCALE_VALUE = 100;
  var STEP_SCALE_VALUE = 25;
  var MAX_INTENSITY_EFFECT = 3;
  var HIEGHT_PREWEW = 600;
  var WIDTH_PREWEW = 600;
  var imgUploadPreview = document.querySelector('.img-upload__preview');
  var img = imgUploadPreview.querySelector('img');
  var effectsList = document.querySelector('.effects__list');
  var effectLevel = document.querySelector('.effect-level');
  var effectLevelValue = effectLevel.querySelector('.effect-level__value');
  var effectLevelLine = effectLevel.querySelector('.effect-level__line');
  var effectLevelPin = effectLevel.querySelector('.effect-level__pin');
  var effectLevelDepth = effectLevel.querySelector('.effect-level__depth');
  var currentEffect = 'none';
  var imgUploadScale = document.querySelector('.img-upload__scale');
  var scaleControlSmaller = imgUploadScale.querySelector('.scale__control--smaller');
  var scaleControlBigger = imgUploadScale.querySelector('.scale__control--bigger');
  var scaleControlValue = imgUploadScale.querySelector('.scale__control--value');

  window.preview = {
    effectLevel: effectLevel,
    effectLevelPin: effectLevelPin,
    effectLevelLine: effectLevelLine,
    effectLevelDepth: effectLevelDepth,
    imgUploadPreview: imgUploadPreview,
    scaleControlValue: scaleControlValue,
    img: img
  };

  var changeEffects = function (evt) {
    imgUploadPreview.className = '';
    imgUploadPreview.style.filter = '';
    effectLevel.classList.add('hidden');

    if (evt.target.value !== 'none') {
      effectLevel.classList.remove('hidden');
      effectLevelValue.value = DEFAULT_EFECT_VALUE;
      effectLevelPin.style.left = '100%';
      effectLevelDepth.style.width = '100%';
      imgUploadPreview.classList.add('effects__preview--' + evt.target.value);
      img.height = HIEGHT_PREWEW;
      img.width = WIDTH_PREWEW;
    }
    currentEffect = evt.target.value;
  };

  effectsList.addEventListener('change', function (evt) {
    changeEffects(evt);
  });

  // Интенсивность эффекта
  var changeLevel = function (effectType, value) {

    switch (effectType) {
      case 'chrome':
        imgUploadPreview.style.filter = 'grayscale(' + value + ')';
        break;

      case 'sepia':
        imgUploadPreview.style.filter = 'sepia(' + value + ')';
        break;

      case 'marvin':
        imgUploadPreview.style.filter = 'invert(' + value * 100 + '%)';
        break;

      case 'phobos':
        imgUploadPreview.style.filter = 'blur(' + value * MAX_INTENSITY_EFFECT + 'px)';
        break;

      case 'heat':
        imgUploadPreview.style.filter = 'brightness(' + value * MAX_INTENSITY_EFFECT + ')';
    }
  };

  effectLevelPin.addEventListener('mouseup', function () {
    var value = (effectLevelPin.offsetLeft / effectLevelLine.clientWidth).toFixed(2);
    changeLevel(currentEffect, value);
  });

  // Изменяем масштаб
  scaleControlValue.value = MAX_SCALE_VALUE + '%';

  var changeSize = function (value) {
    imgUploadPreview.style.transform = 'scale' + '(' + value / 100 + ')';
  };

  var changeScale = function (step) {
    var currentControlValue = parseInt(scaleControlValue.value, 10);
    if (currentControlValue + step <= MAX_SCALE_VALUE && currentControlValue + step >= MIN_SCALE_VALUE) {
      var result = currentControlValue + step;
      scaleControlValue.value = result + '%';
      changeSize(result);
    }
  };

  scaleControlSmaller.addEventListener('click', function () {
    changeScale(-STEP_SCALE_VALUE);
  });

  scaleControlBigger.addEventListener('click', function () {
    changeScale(STEP_SCALE_VALUE);
  });
})();
