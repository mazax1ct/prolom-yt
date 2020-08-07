//fancybox меняем defaults настройки
$.fancybox.defaults.hash = false;
$.fancybox.defaults.autoFocus = false;
$.fancybox.defaults.backFocus = false;
//$.fancybox.defaults.closeExisting = true;


//функция навешивания класса на шапку и фильтр каталога
var resize_scroll = function(e) {
  var h = $(".header");
  if($(window).scrollTop() > h.height()/2) {
    h.addClass("scrolled");
  } else {
    h.removeClass("scrolled");
  }

  if($(".catalog-topbar").length) {
    var f = $(".catalog-topbar");
    var fOffsetTop = f.offset().top;
    if(($(window).scrollTop() + $(".header.scrolled").height()) > fOffsetTop) {
      $(".catalog-topbar__float").addClass('scrolled');
    } else {
      $(".catalog-topbar__float").removeClass('scrolled');
    }
  }
};

//прогресс-бар
function setProgress(index, slider) {
  var calc = ((index + 1) / (slider.slick('getSlick').slideCount)) * 100;

  $('.progress[data-progress="'+ slider.attr("data-progress") +'"]').css('background-size', `${calc}% 100%`).attr('aria-valuenow', calc);
}

//проверка на тач-устройства
function isTouchDevice () {
  return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
}

//переменная для слайдера быстрого просмотра
var fastLookSlider = $('.js-fast-look-slider');

//переменная для проверки открытия корзины
var cartOpen = false;

//переменная для проверки открытия фильтра
var filterOpen = false;

//переменная для проверки открытия сортировки
var sortOpen = false;

$(document).ready(function () {
  //запуск функции навешивания класса на шапку
  resize_scroll();

  //меню второго уровня
  if(isTouchDevice() === true) {
    $('.js-root .main-menu__link').click(function() {
      $(this).toggleClass('is-active');
      $(this).next('.sub-menu').slideToggle();
      console.log('click');
      return false;
    });
  }

  //кастомный скролл
  $('.js-custom-scroll').each(function(index, element) {
    new SimpleBar(element, { autoHide: false })
  });

  //слайдер в попапе быстрого просмотра
  if (fastLookSlider.length) {
    fastLookSlider.slick({
      mobileFirst: true,
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      appendArrows: $('.fast-look__slider-nav'),
      prevArrow: '<button class="button-prev" title="Назад"><svg class="icon" aria-hidden="true"><use xlink:href="#slider_prev" /></svg></button>',
      nextArrow: '<button class="button-next" title="Вперед"><svg class="icon" aria-hidden="true"><use xlink:href="#slider_next" /></svg></button>',
      draggable: true
    });

    fastLookSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
      setProgress(nextSlide, fastLookSlider);
    });

    setProgress(0, fastLookSlider);
  }
});

//перезапуск функции навешивания класса на шапку при скролле и ресайзе
$(window).on("scroll", resize_scroll).on("resize", resize_scroll);

//открытие главного меню
$(document).on('click', '.js-menu-opener', function () {
  $('body').addClass('menu-is-open');
  $('.header__menu-block').addClass('is-open');
  setTimeout(
    "$('.header__mobile-duplicate, .header__menu').addClass('is-open');",
    200
  );
  return false;
});

//закрытие главного меню
$(document).on('click', '.js-menu-closer', function () {
  $('.header__mobile-duplicate, .header__menu').removeClass('is-open');
  setTimeout(
    "$('.header__menu-block').removeClass('is-open'); $('body').removeClass('menu-is-open');",
    200
  );
  return false;
});

//открытие/закрытие поиска
$(document).on('click', '.js-search-toggler', function () {
  $(this).toggleClass('is-active');
  $('.search-bar__form').toggleClass('is-open');
  if($(this).hasClass('is-active')) {
    $('.search-bar__input').focus();
    $('.search-bar__dropdown').addClass('is-open');
  } else {
    $('.search-bar__input').val('').blur();
    $('.search-bar__dropdown').removeClass('is-open');
  }
  return false;
});

//выбор варианта для поиска
$(document).on('click', '.js-search-option', function () {
  $('.search-bar__input').val($(this).text());
  return false;
});

$(document).on('mouseover', '.js-cart-open', function () {
  if($('body').width() > 1199) {
    if(filterOpen == true || sortOpen == true) {
      $('.catalog-sort').removeClass('is-open');
      $('.js-filter-toggler').removeClass('is-active');
      $('.filter').removeClass('fadeIn');
      setTimeout(function() {
        $('body').removeClass('filter-is-open');
        filterOpen = false;
      },300);
      sortOpen = false;
    }
    if(cartOpen == false) {
      $('body').addClass('overlay cart-is-open');
      setTimeout(function() {
        $('body').addClass('overlay-fadeIn');
        setTimeout(function() {
          $('.mini-cart').addClass('fadeIn');
          cartOpen = true;
        },300);
      },100);
    }
    return false;
  }
});

$(document).on('click', '.js-cart-close', function () {
  if(cartOpen == true) {
    $('.mini-cart').removeClass('fadeIn');
    setTimeout(function() {
      $('body').removeClass('overlay-fadeIn');
      setTimeout(function() {
        $('body').removeClass('overlay cart-is-open');
        cartOpen = false;
      },300);
    },100);
  }
  return false;
});

//закрытие корзины
$(document).on('mouseenter', '.page-content, .checkout, .main-menu, .footer', function () {
  if(cartOpen == true) {
    $('.mini-cart').removeClass('fadeIn');
    setTimeout(function() {
      $('body').removeClass('overlay-fadeIn');
      setTimeout(function() {
        $('body').removeClass('overlay cart-is-open');
        cartOpen = false;
        filterOpen = false;
        sortOpen = false;
      },300);
    },100);
  }
});

//сортировка в каталоге
$(document).on('click', '.js-catalog-sort-open', function () {
  if(filterOpen == true || cartOpen == true) { //закрываем корзину и фильтр
    $('.js-filter-toggler').removeClass('is-active');
    $('.filter').removeClass('fadeIn');
    $('.mini-cart').removeClass('fadeIn');
    setTimeout(function() {
      $('body').removeClass('cart-is-open filter-is-open');
      filterOpen = false;
      cartOpen = false;
    },300);
  }
  if(sortOpen == false) {
    $('body').addClass('overlay');
    setTimeout(function() {
      $('body').addClass('overlay-fadeIn');
      setTimeout(function() {
        $('.catalog-sort').addClass('is-open');
        sortOpen = true;
      },300);
    },100);
  } else {
    $('.catalog-sort').removeClass('is-open');
    setTimeout(function() {
      $('body').removeClass('overlay-fadeIn');
      setTimeout(function() {
        $('body').removeClass('overlay');
        sortOpen = false;
      },300);
    },100);
  }
  return false;
});

$(document).on('click', '.js-catalog-sort', function () {
  $('.catalog-sort__var').removeClass('is-active');
  $(this).addClass('is-active');
  $('.catalog-sort__value').text($(this).text());
  return false;
});

//открытие/закрытие фильтра
$(document).on('click', '.js-filter-toggler', function () {
  if(cartOpen == true || sortOpen == true) { //закрываем корзину и сортировку
    $('.mini-cart').removeClass('fadeIn');
    $('.catalog-sort').removeClass('is-open');
    setTimeout(function() {
      $('body').removeClass('cart-is-open');
      cartOpen = false;
    },300);
    sortOpen = false;
  }
  if(filterOpen == false) {
    $('body').addClass('overlay filter-is-open');
    $('.js-filter-toggler').addClass('is-active');
    setTimeout(function() {
      $('body').addClass('overlay-fadeIn');
      if($('body').width() > 1199) {
        var f = $(".catalog-topbar");
        var fOffsetTop = f.offset().top;
        $('.filter').height($(window).height() - fOffsetTop - 50 - 30);
      }
      setTimeout(function() {
        $('.filter-block').addClass('is-open');
        $('.filter').addClass('fadeIn');
        if($('body').width() > 1199) {
          document.addEventListener('click', closeFilter);
        }
        filterOpen = true;
      },300);
    },100);
  } else {
    $('.filter').removeClass('fadeIn');
    $('.filter-block').removeClass('is-open');
    setTimeout(function() {
      $('body').removeClass('overlay-fadeIn');
      setTimeout(function() {
        $('body').removeClass('overlay filter-is-open');
        $('.js-filter-toggler').removeClass('is-active');
        if($('body').width() > 1199) {
          document.removeEventListener('click', closeFilter);
        }
        filterOpen = false;
      },300);
    },100);
  }
  return false;
});

function closeFilter(evt) {
  if (!$('.filter-block').is(evt.target) && $('.filter-block').has(evt.target).length === 0) {
    $('.filter').removeClass('fadeIn');
    $('.filter-block').removeClass('is-open');

    setTimeout(function() {
      if (!$('.js-catalog-sort-open').is(evt.target) && $('.js-catalog-sort-open').has(evt.target).length === 0) {
        $('body').removeClass('overlay-fadeIn');
      }
      setTimeout(function() {
        if (!$('.js-catalog-sort-open').is(evt.target) && $('.js-catalog-sort-open').has(evt.target).length === 0) {
          $('body').removeClass('overlay');
        }
        $('body').removeClass('filter-is-open');
        $('.js-filter-toggler').removeClass('is-active');
        if($('body').width() > 1199) {
          document.removeEventListener('click', closeFilter);
        }
        filterOpen = false;
      },300);
    },100);
	}
}

//открытие/закрытие раздела фильтра
$(document).on('click', '.js-filter-section-toggler', function () {
  $(this).toggleClass('is-active');
  $(this).parent().next('.filter__section-dropdown').slideToggle();
  return false;
});

//открытие/закрытие меню в футере для мобил
$(document).on('click', '.js-footer-dropdown-toggler', function () {
  if($('body').width() < 768) {
    $(this).toggleClass('is-active');
    $(this).next('.footer__section-dropdown').slideToggle();
    return false;
  }
});

//попап быстрого просмотра
$(document).on('click', '.js-fast-look', function () {
  $.fancybox.open(
    [
      {
    		src  : $(this).attr('data-src'),
        opts: {
          hash: false,
          arrows: false,
          infobar: false,
      		afterShow: function() {
            fastLookSlider.slick('setPosition');
      		}
        }
    	}
    ], {
    	loop : false
  });
});

//закрытие попапа
$(document).on('click', '.js-popup-close', function () {
  $.fancybox.close();
  return false;
});
