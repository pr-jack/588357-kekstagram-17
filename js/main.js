'use strict';
var NUMBERS_OF_PHOTOS = 25;
var LIKES = {
  min: 15,
  max: 200
};
var NUMBERS = {
  min: 1,
  max: 6
};

var messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var names = [
  'Андрей',
  'Виктор',
  'Николай',
  'Евгений',
  'Дмитрий',
  'Александр'
];
// Вычисляем случайное число
var getRandomNumbers = function (min, max) {
  var randomNumber = Math.floor((Math.random() * (max - min) + min));
  return randomNumber;
};
// Создаем случайные сообщения
var getRandomTextMessage = function () {
  var randomLength = (Math.floor(Math.random() * 2) === 0);
  var firstMessage = messages[getRandomNumbers(NUMBERS.min, NUMBERS.max)] + ' ' + messages[getRandomNumbers(NUMBERS.min, NUMBERS.max)];
  var secondMessage = messages[getRandomNumbers(NUMBERS.min, NUMBERS.max)];

  if (randomLength) {
    return firstMessage;
  }
  return secondMessage;

};

// Создаем объект с комментариями
var getObjectsComents = function () {
  var objectComents = [];
  for (var j = 0; j < NUMBERS.max; j++) {
    objectComents.push({
      avatar: 'img/avatar-' + getRandomNumbers(NUMBERS.min, NUMBERS.max) + '.svg',
      message: getRandomTextMessage(),
      name: names[getRandomNumbers(NUMBERS.min, NUMBERS.max)]
    });
  }
  return objectComents;
};

// Создаем объект с описанием фотографий
var getObjects = function (count) {
  var objects = [];
  for (var i = 0; i < count; i++) {
    objects.push({
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumbers(LIKES.min, LIKES.max),
      comments: getObjectsComents()
    });
  }
  return objects;
};

var photos = getObjects(NUMBERS_OF_PHOTOS);

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
