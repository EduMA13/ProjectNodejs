document.addEventListener('DOMContentLoaded', function() {
    new Splide('.splide', {
      type: 'loop',
      perPage: 3,
      perMove: 1,
      gap: '1rem',
      autoplay: true,
      pauseOnHover: false,
      breakpoints: {
        768: {
          perPage: 2,
          gap: '0.5rem',
        },
        576: {
          perPage: 1,
        }
      }
    }).mount();
  });
  