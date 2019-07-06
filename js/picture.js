'use strict';
// Создаем объект с описанием фотографий
(function () {
  var NEW_PICTURES = 10;
  var DEBOUNCE_INTERVAL = 500;
  var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');

  var picturesTitleElement = document.querySelector('.pictures');
  var picturesBlock = [];

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

  // функция для удаления всех элементов из родителя
  var clearPictures = function () {
    picturesTitleElement.querySelectorAll('.picture').forEach(function (element) {
      element.remove();
    });
  };

  var imgFilters = document.querySelector('.img-filters');
  var filterPopular = imgFilters.querySelector('#filter-popular');
  var filterDiscussed = imgFilters.querySelector('#filter-discussed');
  var filterNew = imgFilters.querySelector('#filter-new');
  var imgFiltersButton = document.querySelectorAll('.img-filters__button');

  var changeFilter = function (btn) {
    imgFiltersButton.forEach(function (btnItem) {
      btnItem.classList.remove('img-filters__button--active');
    });
    btn.classList.add('img-filters__button--active');
  };

  // функция показа фотографий по обсуждаемости
  var showDiscussedFotos = function (photos) {
    var photosCopy = photos.slice();
    photosCopy.sort(function (first, second) {
      return second.comments.length - first.comments.length;
    });
    insertPhoto(photosCopy);
  };

  // функция для показа 10 новых фотографий (в случайном порядке)
  var showNewFotos = function (photos) {
    var photosCopy = photos
      .sort(function () {
        return Math.random() - 0.5;
      })
      .slice(-NEW_PICTURES);
    insertPhoto(photosCopy);
  };

  var showLoadSuccess = function (photos) {
    picturesBlock = photos;
    imgFilters.classList.remove('img-filters--inactive');
    insertPhoto(picturesBlock);
    return picturesBlock;
  };

  var onFilterButtonClick = function (evt) {
    clearPictures();
    changeFilter(evt.target);
    var id = evt.target.id;
    switch (id) {
      case 'filter-popular':
        insertPhoto(picturesBlock);
        break;
      case 'filter-new':
        showNewFotos(picturesBlock);
        break;
      case 'filter-discussed':
        showDiscussedFotos(picturesBlock);
    }
  };

  window.load(showLoadSuccess);

  var debounce = function (fn) {
    var lastTimeout = null;
    return function () {
      var args = arguments;
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }
      lastTimeout = setTimeout(function () {
        fn.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };

  var onFilterButtonClickDebounce = debounce(onFilterButtonClick);

  // меняем подборку фотографий при нажатии на фильтр "Популярные"
  filterPopular.addEventListener('click', onFilterButtonClickDebounce);
  filterDiscussed.addEventListener('click', onFilterButtonClickDebounce);
  filterNew.addEventListener('click', onFilterButtonClickDebounce);

  // Показываем увеличенное изображение
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');

  var getBigPicture = function (photos) {
    bigPicture.classList.remove('hidden');
    bigPicture.querySelector('.big-picture__img img').src = photos[0].url;
    bigPicture.querySelector('.likes-count').textContent = photos[0].likes;
    bigPicture.querySelector('.comments-count').textContent = photos[0].comments.length;
    bigPicture.querySelector('.comments-count').textContent = photos[0].comments.length;
    socialComments.querySelector('.social__picture').src = photos[0].comments[0].avatar;
    socialComments.querySelector('.social__text').textContent = photos[0].comments[0].message;
    bigPicture.querySelector('.social__caption').textContent = photos[0].description;
  };

  window.load(getBigPicture);

  // Скрываем счетчик и загрузку комментариев
  var socialCommentCount = bigPicture.querySelector('.social__comment-count');
  var commentsLoader = bigPicture.querySelector('.comments-loader');

  var getHiddenElement = function (element) {
    element.classList.add('visually-hidden');
  };

  getHiddenElement(socialCommentCount);
  getHiddenElement(commentsLoader);
})();
