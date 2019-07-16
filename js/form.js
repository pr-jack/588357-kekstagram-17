'use strict';
// Показываем форму редактирования изображения
(function () {
  var ESC_BUTTON = 27;
  var MAX_SCALE_VALUE = 100;
  var uploadFile = document.querySelector('#upload-file');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var effectNone = imgUploadOverlay.querySelector('#effect-none');

  uploadFile.addEventListener('change', function () {
    effectNone.checked = true;
    imgUploadOverlay.classList.remove('hidden');
    window.preview.effectLevel.classList.add('hidden');
    window.preview.imgUploadPreview.style.transform = '';
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


  var validateFormData = function (formData) {
    var hashArray = formData.get('hashtags').toLowerCase().split(' ');

    if (hashArray.length > MAX_HASHTAGS_LENGTH) {
      onHashtagsError();
      return false;
    }

    var hashIsValid = true;
    if (hashArray[0].length) {
      var hashArrayUnique = [];
      hashIsValid = !hashArray.some(function (item) {
        if (item.length > MAX_HASHTAG_SIZE || item.length < MIN_HASHTAG_SIZE || item.charAt(0) !== '#') {
          onHashtagsError();
          return item;
        }
        if (hashArrayUnique.indexOf(item) >= 0) {
          onHashtagsError();
          return item;
        } else {
          hashArrayUnique.push(item);
        }
        return false;
      });
    }
    return hashIsValid;
  };

  var onHashtagsError = function () {
    event.preventDefault();
    textHashtags.style.boxShadow = '0 0 0 3px red';
    textHashtags.addEventListener('keydown', onHashtagsChange);
  };

  var onHashtagsChange = function () {
    textHashtags.style = '';
    textHashtags.removeEventListener('keydown', onHashtagsChange);
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

  var onSubmitForm = function (evt) {
    var formData = new FormData(evt.target);
    var isFormFalid = validateFormData(formData);

    if (!isFormFalid) {
      evt.preventDefault();
    }

    window.upload(formData, onSuccessSave, onErrorSave);
    evt.preventDefault();
  };

  imgUploadForm.addEventListener('submit', onSubmitForm);
})();
