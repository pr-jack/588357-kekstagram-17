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
})();
