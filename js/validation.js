'use strict';

(function () {
  var MAX_HASHTAGS_LENGTH = 5;
  var MAX_HASHTAG_SIZE = 20;
  var MIN_HASHTAG_SIZE = 2;
  var SPACE = 1;
  var textHashtags = document.querySelector('.text__hashtags');

  var validateFormData = function () {
    var errorMessage;
    var hashtagValue = textHashtags.value.replace(/\s+/g, ' ').trim().toLowerCase();
    var hashtagArray = hashtagValue ? hashtagValue.split(' ') : [];

    if (hashtagArray.length > MAX_HASHTAGS_LENGTH) {
      errorMessage = 'Должно быть не больше 5 хэш-тегов';
    }
    hashtagArray.forEach(function (hash) {
      var hashtagArrayCopy = hashtagArray.slice();
      var repeatedHashtags = hashtagArrayCopy.filter(function (element, indexElement, array) {
        return indexElement !== array.indexOf(element) || indexElement !== array.lastIndexOf(element);
      });
      var gridArray = hash.match(/#/g);
      var gridCount = gridArray ? gridArray.length : 0;
      if (hash.charAt(0) !== '#') {
        errorMessage = 'Хэш-тег должен начинаться с символа #';
      } else if (hash.charAt(0) === '#' && hash.length < MIN_HASHTAG_SIZE) {
        errorMessage = 'Хэш-тег должен быть больше одного символа';
      } else if (hash.charAt(0) === '#' && gridCount > SPACE) {
        errorMessage = 'Хэш-теги должны быть разделены пробелами';
      } else if (hash.length > MAX_HASHTAG_SIZE) {
        errorMessage = 'Хэш-тег должен быть не больше 20 символов';
      } else if (repeatedHashtags.length > 0) {
        errorMessage = 'Хэш-теги не должны повторяться';
      }
    });

    if (errorMessage) {
      textHashtags.setCustomValidity(errorMessage);
      textHashtags.style.border = '2px solid red';
    } else {
      textHashtags.style.border = '';
      textHashtags.setCustomValidity('');
    }
  };

  textHashtags.addEventListener('input', validateFormData);
})();
