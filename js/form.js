'use strict';
// Показываем форму редактирования изображения
(function () {
  var ESC_BUTTON = 27;
  var uploadFile = document.querySelector('#upload-file');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  uploadFile.addEventListener('change', function () {
    imgUploadOverlay.classList.remove('hidden');
  });

  // Закрываем форму редактирования изображения
  var uploadCancel = document.querySelector('#upload-cancel');
  var textDescription = imgUploadOverlay.querySelector('.text__description');
  var textHashtags = imgUploadOverlay.querySelector('.text__hashtags');

  var closePopup = function () {
    imgUploadOverlay.classList.add('hidden');
  };

  var onImgUploadEscPress = function (evt) {
    if (evt.keyCode === ESC_BUTTON) {
      closePopup();
    }
  };

  var addEscClose = function () {
    document.addEventListener('keydown', onImgUploadEscPress);
  };

  addEscClose();

  uploadCancel.addEventListener('click', function () {
    closePopup();
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
  // var elementFormHashTags = document.querySelector('.text__hashtags');
  var imgUploadForm = document.querySelector('.img-upload__form');

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
    // alert('Поле заполнено не верно');
    // elementFormHashTags.setCustomValidity('Поле заполнено не верно');
    event.preventDefault();
  };

  var onSubmitForm = function (evt) {
    var formData = new FormData(evt.target);
    validateFormData(formData);
  };

  imgUploadForm.addEventListener('submit', onSubmitForm);
})();
