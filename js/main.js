'use strict';
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var NUMBER_OF_PHOTOS = 24;

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
// Задаем случайное количество лайков
var getRandomLikes = function () {
  var randomLikes = Math.floor((Math.random() * (MAX_LIKES - MIN_LIKES) + MIN_LIKES));
  return randomLikes;
};
// Задаем случайный номер от 1 до 6
var getRandomNumbers = function () {
  var randomNumbers = Math.floor((Math.random() * (1 - 6) + 6));
  return randomNumbers;
};
// Создаем объект с комментариями
var getObjectsComents = function () {
  var objectComents = [];
  for (var j = 0; j < 6; j++) {
    objectComents.push({
      avatar: 'img/avatar-' + getRandomNumbers() + '.svg',
      message: messages[getRandomNumbers()],
      name: names[getRandomNumbers()]
    });
  }
  return objectComents;
};
// Создаем объект с описанием фотографий
var getObjects = function (length) {
  var objects = [];
  for (var i = 0; i <= length; i++) {
    objects.push({
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomLikes(),
      comments: getObjectsComents()
    });
  }
  return objects;
};

var photos = getObjects(NUMBER_OF_PHOTOS);

var picture = document.querySelector('#picture')
    .content
    .querySelector('.picture');

var fragment = document.createDocumentFragment();

for (var i = 0; i < NUMBER_OF_PHOTOS; i++) {
  var pictureElement = picture.cloneNode(true);
  pictureElement.querySelector('picture__img').src = photos[i].url;
  pictureElement.querySelector('picture__comments').textContent = photos[i].comments;
  pictureElement.querySelector('picture__likes').textContent = photos[i].likes;

  fragment.appendChild(pictureElement);
}

picture.appendChild(fragment);
