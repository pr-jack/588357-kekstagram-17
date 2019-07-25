'use strict';
// Показываем форму редактирования изображения
(function () {
  var MAX_SCALE_VALUE = 100;
  var MAX_HASHTAGS_LENGTH = 5;
  var MAX_HASHTAG_SIZE = 20;
  var MIN_HASHTAG_SIZE = 2;
  var uploadFile = document.querySelector('#upload-file');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var effectNone = imgUploadOverlay.querySelector('#effect-none');

  uploadFile.addEventListener('change', function () {
    effectNone.checked = true;
    imgUploadOverlay.classList.remove('hidden');
    window.preview.effectLevel.classList.add('hidden');
    window.preview.imgUploadPreview.style.transform = '';
    window.preview.imgUploadPreview.style.filter = '';
    window.preview.scaleControlValue.value = MAX_SCALE_VALUE + '%';
  });

  // Закрываем форму редактирования изображения
  var uploadCancel = document.querySelector('#upload-cancel');
  var textDescription = imgUploadOverlay.querySelector('.text__description');
  var textHashtags = document.querySelector('.text__hashtags');

  var closePopup = function (element) {
    element.classList.add('hidden');
    uploadFile.value = '';
    effectNone.checked = true;
    textHashtags.value = '';
    textDescription.value = '';
    window.preview.imgUploadPreview.className = 'img-upload__preview';
  };

  var onImgUploadEscPress = function (evt) {
    if (window.utils.isEscPressed(evt)) {
      closePopup(imgUploadOverlay);
    }
  };

  window.utils.addClose(onImgUploadEscPress);

  uploadCancel.addEventListener('click', function () {
    closePopup(imgUploadOverlay);
  });

  textDescription.addEventListener('focus', function () {
    document.removeEventListener('keydown', onImgUploadEscPress);
  });

  textDescription.addEventListener('blur', function () {
    window.utils.addClose(onImgUploadEscPress);
  });

  // Хэштэги
  textHashtags.addEventListener('focus', function () {
    document.removeEventListener('keydown', onImgUploadEscPress);
  });

  textHashtags.addEventListener('blur', function () {
    window.utils.addClose(onImgUploadEscPress);
  });

  var imgUploadForm = document.querySelector('.img-upload__form');

  var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var main = document.querySelector('main');

  var onEscKeydown = function (evt) {
    if (window.utils.isEscPressed(evt)) {
      closeModal();
    }
  };

  var closeModal = function () {
    var messageElement = main.querySelector('.success, .error');
    if (messageElement) {
      messageElement.remove();
      document.removeEventListener('keydown', onEscKeydown);
    }
  };

  var resetForm = function () {
    textHashtags.value = '';
    uploadFile.value = null;
    textDescription.value = '';
  };

  var onSuccessSave = function () {
    resetForm();
    window.utils.closeElement(imgUploadOverlay);
    var element = successTemplate.cloneNode(true);
    main.appendChild(element);

    element.querySelector('.success__button').addEventListener('click', function () {
      closeModal();
    });

    element.addEventListener('click', function (evt) {
      if (evt.target === element) {
        closeModal();
      }
    });

    document.addEventListener('keydown', onEscKeydown);
  };

  var onErrorSave = function () {
    resetForm();
    window.utils.closeElement(imgUploadOverlay);
    var element = errorTemplate.cloneNode(true);
    main.appendChild(element);

    element.querySelector('.error__button').addEventListener('click', function () {
      closeModal();
    });

    element.addEventListener('click', function (evt) {
      if (evt.target === element) {
        closeModal();
      }
    });

    document.addEventListener('keydown', onEscKeydown);
  };

  var validateFormData = function () {
    var hashtagValue = textHashtags.value.replace(/\s+/g, ' ').trim().toLowerCase();
    var hashtagArray = hashtagValue.split(' ');
    var errorMessage;

    var repeatedHashtags = hashtagArray.filter(function (element, indexElement, array) {
      return indexElement !== array.indexOf(element) || indexElement !== array.lastIndexOf(element);
    });

    hashtagArray.forEach(function (element) {
      var hash = element;
      if (hash.charAt(0) !== '#') {
        errorMessage = 'Хэш-тег должен начинаться с символа #';
      } else if (hash.charAt(0) === '#' && hash.length < MIN_HASHTAG_SIZE) {
        errorMessage = 'Хэш-тег должен быть больше одного символа';
      } else if (hash.charAt(0) === '#' && hash.length >= MIN_HASHTAG_SIZE) {
        var result = hash.match(/#/g).length;
        if (hash.length > MAX_HASHTAG_SIZE) {
          errorMessage = 'Хэш-тег должен быть не больше 20 символов';
        } else if (hashtagArray.length > MAX_HASHTAGS_LENGTH) {
          errorMessage = 'Должно быть не больше 5 хэш-тегов';
        } else if (result > 1) {
          errorMessage = 'Хэш-теги должны быть разделены пробелами';
        } else if (repeatedHashtags.length > 0) {
          errorMessage = 'Хэш-теги не должны повторяться';
        }
      }
    });

    if (errorMessage) {
      textHashtags.setCustomValidity(errorMessage);
      textHashtags.style.border = '2px solid red';
    } else {
      textHashtags.setCustomValidity(' ');
      textHashtags.style.border = 'none';
      window.upload(new FormData(imgUploadForm), onSuccessSave, onErrorSave);
    }
  };

  textHashtags.addEventListener('change', validateFormData);

  imgUploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.upload(new FormData(imgUploadForm), onSuccessSave, onErrorSave);
  });
})();
