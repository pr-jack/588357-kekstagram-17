'use strict';
// Создаем объект с описанием фотографий
(function () {
  var NEW_PICTURES = 10;
  var DEBOUNCE_INTERVAL = 500;
  var MAX_COMMENTS = 5;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var picturesTitleElement = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');
  var imgFilters = document.querySelector('.img-filters');
  var filterPopular = imgFilters.querySelector('#filter-popular');
  var filterDiscussed = imgFilters.querySelector('#filter-discussed');
  var filterNew = imgFilters.querySelector('#filter-new');
  var imgFiltersButton = imgFilters.querySelectorAll('button');
  var imgUploadInput = document.querySelector('.img-upload__input');
  var preview = document.querySelector('.img-upload__preview > img');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var effectsPreviewImageElements = imgUploadOverlay.querySelectorAll('.effects__preview');
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
  // Функция получения случайного массива
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
  var remainingComments;
  var commentsQuantity = {};
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');
  var commentsLoader = bigPicture.querySelector('.comments-loader');

  var makeElement = function (tagName, className) {
    var element = document.createElement(tagName);
    element.classList.add(className);

    return element;
  };

  var createComment = function (pictures) {
    var listItem = makeElement('li', 'social__comment');
    var image = makeElement('img', 'social__picture');

    image.src = pictures.avatar;
    listItem.appendChild(image);

    var commentText = makeElement('p', 'social__text');
    commentText.textContent = pictures.message;
    listItem.appendChild(commentText);

    return listItem;
  };

  var renderComments = function (photos) {
    var fragment = document.createDocumentFragment();
    photos.forEach(function (item) {
      fragment.appendChild(createComment(item));
    });

    socialComments.appendChild(fragment);

    updateCommentsContent(commentsQuantity.currentCount, commentsQuantity.totalCount);
  };

  var getBigPicture = function (photos) {
    bigPicture.classList.remove('hidden');
    bigPicture.querySelector('.big-picture__img img').src = photos.url;
    bigPicture.querySelector('.likes-count').textContent = photos.likes;
    bigPicture.querySelector('.social__caption').textContent = photos.description;
    remainingComments = photos.comments.slice(0);
    commentsQuantity.totalCount = remainingComments.length;
    socialComments.innerHTML = '';

    renderComments(prepareComments(remainingComments));
  };

  var prepareComments = function (comments) {
    if (comments.length > MAX_COMMENTS) {
      commentsLoader.classList.remove('hidden');
      commentsQuantity.currentCount = commentsQuantity.totalCount - comments.length + MAX_COMMENTS;

      return comments.splice(0, MAX_COMMENTS);
    }

    commentsLoader.classList.add('hidden');
    commentsQuantity.currentCount = commentsQuantity.totalCount;

    return comments.splice(0, comments.length);
  };

  var updateCommentsContent = function (currentCount, totalCount) {
    bigPicture.querySelector('.social__comment-count').textContent = currentCount + ' из '
      + totalCount + ' комментариев';
  };

  var loadCommentsClickHandler = function () {
    renderComments(prepareComments(remainingComments));
  };

  commentsLoader.addEventListener('click', loadCommentsClickHandler);

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

  // Закрываем попап
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

  var onImgUploadEscPress = function (evt) {
    if (window.utils.isEscPressed(evt)) {
      window.utils.closeElement(bigPicture);
    }
  };

  window.utils.addClose(onImgUploadEscPress);

  bigPictureCancel.addEventListener('click', function () {
    window.utils.closeElement(bigPicture);
  });
})();
