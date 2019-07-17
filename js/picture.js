'use strict';
// Создаем объект с описанием фотографий
(function () {
  var NEW_PICTURES = 10;
  var DEBOUNCE_INTERVAL = 500;
  var picturesTitleElement = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');
  var imgFilters = document.querySelector('.img-filters');
  var filterPopular = imgFilters.querySelector('#filter-popular');
  var filterDiscussed = imgFilters.querySelector('#filter-discussed');
  var filterNew = imgFilters.querySelector('#filter-new');
  var imgFiltersButton = imgFilters.querySelectorAll('button');
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
  };

  // Функция для удаления всех элементов из родителя
  var clearPictures = function () {
    picturesTitleElement.querySelectorAll('.picture').forEach(function (element) {
      element.remove();
    });
  };

  var changeFilter = function (btn) {
    imgFiltersButton.forEach(function (btnItem) {
      btnItem.classList.remove('img-filters__button--active');
    });
    btn.classList.add('img-filters__button--active');
  };

  // Функция показа фотографий по обсуждаемости
  var showDiscussedFotos = function (photos) {
    var photosCopy = photos.slice();
    photosCopy.sort(function (first, second) {
      return second.comments.length - first.comments.length;
    });
    insertPhoto(photosCopy);
  };

  var shuffleArray = function (photos) {
    var photosCopy = photos
      .sort(function () {
        return Math.random() - 0.5;
      });
    return photosCopy;
  };

  // Функция для показа 10 новых фотографий (в случайном порядке)
  var showNewFotos = function (photos) {
    var photosCopy = photos.slice(-NEW_PICTURES);
    shuffleArray(photosCopy);
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

  window.load(showLoadSuccess);

  var onFilterButtonClickDebounce = debounce(onFilterButtonClick);

  // Меняем подборку фотографий
  filterPopular.addEventListener('click', onFilterButtonClickDebounce);
  filterDiscussed.addEventListener('click', onFilterButtonClickDebounce);
  filterNew.addEventListener('click', onFilterButtonClickDebounce);

  // Показываем увеличенное изображение
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');
  var socialComment = bigPicture.querySelector('.social__comment');

  var getBigPicture = function (photos) {
    bigPicture.classList.remove('hidden');
    bigPicture.querySelector('.big-picture__img img').src = photos.url;
    bigPicture.querySelector('.likes-count').textContent = photos.likes;
    bigPicture.querySelector('.comments-count').textContent = photos.comments.length;
    bigPicture.querySelector('.social__caption').textContent = photos.description;
    createComments(photos);
  };

  var showBigPhoto = function (evt) {
    evt.preventDefault();
    if (evt.target.classList.contains('picture__img')) {
      var attribute = evt.target.getAttribute('src');
      for (var i = 0; i < picturesBlock.length; i++) {
        if (picturesBlock[i].url === attribute) {
          getBigPicture(picturesBlock[i]);
        }
      }
    }
  };

  var openBigPicture = function (evt) {
    var target = evt.target;
    var picture = target.closest('.picture');
    if (!picture) {
      return;
    }
    showBigPhoto(evt);
  };

  picturesTitleElement.addEventListener('click', openBigPicture);

  // Создаем комментарий
  var createComment = function (photos) {
    if (!comment) {
      var comment = socialComment.cloneNode(true);
    }
    socialComments.querySelector('.social__picture').src = photos.comments.avatar;
    socialComments.querySelector('.social__text').textContent = photos.comments.message;

    comment = comment.cloneNode(true);

    return comment;
  };

  // Создаем 5 комментариев
  var createComments = function (photos) {
    var MAX_COMMENTS = 5;
    var fragmentComment = document.createDocumentFragment();

    var bigPictureDataFives = photos.comments.slice(0, MAX_COMMENTS);

    bigPictureDataFives.forEach(function (item) {
      fragmentComment.appendChild(createComment(item));
    });

    socialComments.innerHTML = '';
    socialComments.appendChild(fragmentComment);
  };

  // Скрываем счетчик и загрузку комментариев
  var socialCommentCount = bigPicture.querySelector('.social__comment-count');
  var commentsLoader = bigPicture.querySelector('.comments-loader');

  var getHiddenElement = function (element) {
    element.classList.add('visually-hidden');
  };

  getHiddenElement(socialCommentCount);
  getHiddenElement(commentsLoader);

  // Закрываем попап
  var ESC_BUTTON = 27;
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

  var closePopup = function () {
    bigPicture.classList.add('hidden');
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

  bigPictureCancel.addEventListener('click', function () {
    closePopup();
  });
})();
