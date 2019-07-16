'use strict';
// Показываем форму редактирования изображения
(function () {
  var ESC_BUTTON = 27;
  var MAX_SCALE_VALUE = 100;
  var uploadFile = document.querySelector('#upload-file');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var effectNone = imgUploadOverlay.querySelector('#effect-none');

  uploadFile.addEventListener('change', function () {
    textHashtags.style.boxShadow = '';
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
    uploadFile.value = '';
    effectNone.checked = true;
    window.preview.imgUploadPreview.className = 'img-upload__preview';
    element.classList.add('hidden');
  };

  var onImgUploadEscPress = function (evt) {
    if (evt.keyCode === ESC_BUTTON) {
      closePopup(imgUploadOverlay);
    }
  };

  var addEscClose = function () {
    document.addEventListener('keydown', onImgUploadEscPress);
  };

  addEscClose();

  uploadCancel.addEventListener('click', function () {
    closePopup(imgUploadOverlay);
  });

  textDescription.addEventListener('focus', function () {
    document.removeEventListener('keydown', onImgUploadEscPress);
  });

  textDescription.addEventListener('blur', function () {
    addEscClose();
  });

  // Хэштэги
  textHashtags.addEventListener('focus', function () {
    document.removeEventListener('keydown', onImgUploadEscPress);
  });

  textHashtags.addEventListener('blur', function () {
    addEscClose();
  });

  var MAX_HASHTAGS_LENGTH = 5;
  var MAX_HASHTAG_SIZE = 20;
  var MIN_HASHTAG_SIZE = 2;

  var imgUploadForm = document.querySelector('.img-upload__form');


  var resetForm = function () {
    textHashtags.value = '';
    uploadFile.value = null;
    textDescription.value = '';
  };

  var onSuccessSave = function () {
    resetForm();
    closePopup(imgUploadOverlay);
    renderSuccessModal();
  };

  var RenderSuccess = function () {
    var successTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');
    this.element = successTemplate.cloneNode(true);
    return this.element;
  };

  var renderSuccessModal = function () {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(new RenderSuccess());
    document.querySelector('main').appendChild(fragment);
    initSuccessModal();
  };

  var initSuccessModal = function () {
    var modal = document.querySelector('.success');
    var closeButton = modal.querySelector('.success__button');
    closeButton.addEventListener('click', function () {
      closeSuccessModal();
    });
    closeButton.addEventListener('keydown', function (evt) {
      window.util.isEnterEvent(evt, closeSuccessModal);
    });
    modal.addEventListener('click', function (evt) {
      if (evt.target === modal) {
        closeSuccessModal();
      }
    });
    document.addEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, closeSuccessModal);
    });
  };

  var closeSuccessModal = function () {
    document.querySelector('.success').remove();
    document.removeEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, closeSuccessModal);
    });
  };

  var onErrorSave = function () {
    resetForm();
    closePopup(imgUploadOverlay);
    renderErrorModal();
  };

  var renderErrorModal = function () {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(new window.RenderError());
    document.querySelector('main').appendChild(fragment);
    initErrorModal();
  };

  var initErrorModal = function () {
    var modal = document.querySelector('.error');
    var closeButton = modal.querySelector('.error__button');
    closeButton.addEventListener('click', function () {
      closeErrorModal();
    });
    closeButton.addEventListener('keydown', function (evt) {
      window.util.isEnterEvent(evt, closeErrorModal);
    });
    modal.addEventListener('click', function (evt) {
      if (evt.target === modal) {
        closeErrorModal();
      }
    });
  };

  var closeErrorModal = function () {
    document.querySelector('.error').remove();
    document.removeEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, closeErrorModal);
    });
  };

  var validateFormData = function () {
    var hashtagValue = textHashtags.value.replace(/\s+/g, ' ').trim().toLowerCase();
    var hashtagArray = hashtagValue.split(' ');
    var errorMessage;

    var repeatedHashtags = hashtagArray.filter(function (element, indexElement, array) {
      return indexElement !== array.indexOf(element) || indexElement !== array.lastIndexOf(element);
    });

    for (var i = 0; i < hashtagArray.length; i++) {
      var hash = hashtagArray[i];

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
      if (errorMessage) {
        textHashtags.setCustomValidity(errorMessage);
        textHashtags.style.border = '2px solid red';
      } else {
        textHashtags.setCustomValidity(' ');
        textHashtags.style.border = 'none';
        window.upload(new FormData(imgUploadForm), onSuccessSave, onErrorSave);
      }
    }
  };

  textHashtags.addEventListener('change', validateFormData);
})();
