'use strict';
// Создаем объект с описанием фотографий
(function () {
  var NUMBERS_OF_PHOTOS = 25;
  var photos = window.getObjects(NUMBERS_OF_PHOTOS);

  var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');

  var picturesTitleElement = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  var renderPhoto = function (photo) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = photo.url;
    pictureElement.querySelector('.picture__comments').textContent = photo.comments;
    pictureElement.querySelector('.picture__likes').textContent = photo.likes;

    return pictureElement;
  };

  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(renderPhoto(photos[i]));
  }

  picturesTitleElement.appendChild(fragment);
})();
