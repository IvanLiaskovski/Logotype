$(document).ready(function () {
    $(".main-slider, .news-slider-container").slick({
        nextArrow: '<button type="button" data-role="none" class="slide-next"></button>',
        prevArrow: '<button type="button" data-role="none" class="slide-prev"></button>',
        autoplay: true
    });

    $(".burger").click(function () {
        $(".burger").toggleClass("active");
        $(".nav").slideToggle();
    });

    $(".consultation-form select").styler();
});

