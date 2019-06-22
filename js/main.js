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

var ESC_BUTTON = 27;

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

// Показываем форму редактирования изображения
var uploadFile = document.querySelector('#upload-file');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
uploadFile.addEventListener('change', function () {
  imgUploadOverlay.classList.remove('hidden');
});

// Закрываем форму редактирования изображения
var uploadCancel = document.querySelector('#upload-cancel');
var closePopup = function () {
  imgUploadOverlay.classList.add('hidden');
};

uploadCancel.addEventListener('click', function () {
  closePopup();
});

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_BUTTON) {
    closePopup();
  }
});

// Накладываем эффекты на изображение
var imgUploadPreview = document.querySelector('.img-upload__preview');
var effectsList = document.querySelector('.effects__list');
var effectsRadio = effectsList.querySelector('.effects__radio').value;
var effectLevel = document.querySelector('.effect-level');
var effectLevelValue = effectLevel.querySelector('.effect-level__value');
var effectLevelLine = effectLevel.querySelector('.effect-level__line');
var effectLevelPin = effectLevel.querySelector('.effect-level__pin');
var effectLevelDepth = effectLevel.querySelector('.effect-level__depth');
var currentEffect = 'none';
var DEFAULT_EFECT_VALUE = 100;

var changeEffects = function (evt) {
  if (evt.target.value === 'none') {
    effectLevel.classList.add('hidden');
  } else if (evt.target.value !== 'none') {
    effectLevel.classList.remove('hidden');
    effectLevelValue.value = DEFAULT_EFECT_VALUE;
    effectLevelPin.style.left = '100%';
    effectLevelDepth.style.width = '100%';
    imgUploadPreview.classList.add('effects__preview--' + evt.target.value);
  }
  currentEffect = evt.target.value;
};

effectsList.addEventListener('change', function (evt) {
  changeEffects(evt);
});

// Интенсивность эффекта
var changeLevel = function (effectType, value) {

  switch (effectsRadio) {
    case 'chrome':
      imgUploadPreview.style.filter = 'grayscale(' + value + ')';
      break;

    case 'sepia':
      imgUploadPreview.style.filter = 'sepia(' + value + ')';
      break;

    case 'marvin':
      imgUploadPreview.style.filter = 'invert(' + value * 100 + '%)';
      break;

    case 'phobos':
      imgUploadPreview.style.filter = 'blur(' + value * 3 + 'px)';
      break;

    case 'effects__preview--heat':
      imgUploadPreview.style.filter = 'brightness(' + value * 3 + ')';
  }
};

effectLevelPin.addEventListener('mouseup', function () {
  var value = (effectLevelPin.offsetLeft / effectLevelLine.clientWidth).toFixed(2);
  changeLevel(currentEffect, value);
});

// Изменяем масштаб
var MIN_SCALE_VALUE = 25;
var MAX_SCALE_VALUE = 100;
var STEP_SCALE_VALUE = 25;
var imgUploadScale = document.querySelector('.img-upload__scale');
var scaleControlSmaller = imgUploadScale.querySelector('.scale__control--smaller');
var scaleControlBigger = imgUploadScale.querySelector('.scale__control--bigger');
var scaleControlValue = imgUploadScale.querySelector('.scale__control--value');

scaleControlValue.value = MAX_SCALE_VALUE + '%';

var changeSize = function (value) {
  imgUploadPreview.style.transform = 'scale' + '(' + value / 100 + ')';
};

var changeScale = function (step) {
  var currentControlValue = parseInt(scaleControlValue.value, 10);
  if (currentControlValue + step <= MAX_SCALE_VALUE && currentControlValue + step >= MIN_SCALE_VALUE) {
    var result = currentControlValue + step;
    scaleControlValue.value = result + '%';
    changeSize(result);
  }
};

scaleControlSmaller.addEventListener('click', function () {
  changeScale(-STEP_SCALE_VALUE);
});

scaleControlBigger.addEventListener('click', function () {
  changeScale(STEP_SCALE_VALUE);
});
