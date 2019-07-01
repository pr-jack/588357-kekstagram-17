'use strict';
(function () {
  var imgFilters = document.querySelector('.img-filters');
  imgFilters.classList.remove('img-filters--inactive');
  var arrayPhotos = [];

  var successHandler = function (data) {
    arrayPhotos = data;
    window.render(arrayPhotos);
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var URL = 'https://js.dump.academy/kekstagram/data';
  window.load(URL, successHandler, errorHandler);
})();
