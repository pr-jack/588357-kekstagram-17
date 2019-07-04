'use strict';
// Создаем объект с описанием фотографий
(function () {
  var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');

  var picturesTitleElement = document.querySelector('.pictures');

  var renderPhoto = function (photo) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = photo.url;
    pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;
    pictureElement.querySelector('.picture__likes').textContent = photo.likes;

    return pictureElement;
  };

  var insertPhoto = function (photos) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(renderPhoto(photos[i]));
    }
    picturesTitleElement.appendChild(fragment);
    return photos;
  };

  window.load(insertPhoto);

  var imgFilters = document.querySelector('.img-filters');
  imgFilters.classList.remove('img-filters--inactive');
  var filterName = document.querySelector('.img-filters__button');
  var imgFiltersButton = document.querySelectorAll('.img-filters__button');
  var FilterName = {
    POPULAR: 'filter-popular',
    NEW: 'filter-new',
    DISCUSSED: 'filter-discussed'
  };

  imgFilters.addEventListener('click', function (evt) {
    if (evt.target.type === 'button' && !evt.target.classList.contains('img-filters__button--active')) {
      changeFilter(evt.target);
      applyFilter(filterName);
    }
  });

  var changeFilter = function (btn) {
    imgFiltersButton.forEach(function (btnItem) {
      btnItem.classList.remove('img-filters__button--active');
    });
    btn.classList.add('img-filters__button--active');
  };

  var applyFilter = function () {

    window.arrayPhotos = window.arrayPhotos.slice();

    switch (filterName) {

      case FilterName.NEW:
        window.arrayPhotos = window.arrayPhotos
        .sort(function () {
          return Math.random() - 0.5;
        })
        .slice(-10);
        break;

      case FilterName.DISCUSSED:
        window.arrayPhotos = window.arrayPhotos
          .sort(function (first, second) {
            return second.comments.length - first.comments.length;
          });
        break;
    }
  };
})();
