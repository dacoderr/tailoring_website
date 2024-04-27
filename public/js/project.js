document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-button');

  logoutBtn.addEventListener('click', () => {
    fetch('/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow'
    })
        .then((response) => response.text())
        .then((result) => {
          console.log(result); // Optional: Display the logout response in the console
          window.location.href = '/'; // Redirect to the registration page
        })
        .catch((error) => {
          console.error('Error logging out: ', error);
        });
  });
});

var swiper = new Swiper(".services-slider", {
  slidesPerView: 1,
  spaceBetween: 20,
  centeredSlides: true,
  loop: true,
  grabCursor: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    991: {
      slidesPerView: 3,
    },
  },
});


const exploreBtn = document.getElementById('explore-btn');
    exploreBtn.addEventListener('click', function() {
        window.location.href = '/services';
    });

const serviceBtn = document.getElementById('services-btn');
    serviceBtn.addEventListener('click', function() {
      window.location.href = '/services';
    });

const contactBtn = document.getElementById('contact-btn');
    contactBtn.addEventListener('click', function() {
      window.location.href = '/contact';
    });

const profileBtn = document.getElementById('profile');
profileBtn.addEventListener('click', function() {
    window.location.href = '/profile';
});
