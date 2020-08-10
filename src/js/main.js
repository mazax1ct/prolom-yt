$(document).ready(function () {
});

$(document).on('click', '.js-menu-open', function () {
  $('body').addClass('menu-open');
  $('.header__menu-block').addClass('is-open');
  return false;
});

$(document).on('click', '.js-menu-close', function () {
  $('body').removeClass('menu-open');
  $('.header__menu-block').removeClass('is-open');
  return false;
});

$(document).on('click', '.js-question', function () {
  $(this).toggleClass('is-active');
  $(this).next('.answer').slideToggle();
  return false;
});
