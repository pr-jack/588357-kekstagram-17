'use strict';

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

var getObjects = function (length) {
  var objects = [];
  for (var i = 1; i <= length; i++) {
    var randomLikes = (Math.random() * (15 - 200) + 15);
    var randomNumbers = (Math.random() * (1 - 6) + 6);

    objects.push({
      'url': 'photos/' + i + '.jpg',
      'likes': randomLikes,
      'comments': {
        'avatar': 'img/avatar-' + randomNumbers + '.svg',
        'message': messages[randomNumbers],
        'naeme': names[randomNumbers]
      }
    });
  }
  return objects;
};

getObjects(25);
