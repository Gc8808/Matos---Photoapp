let mCurrentIndex = 0;          // Tracks the current image index
let mImages = [];               // Array to hold the objects from images.json
const mUrl = 'images.json';     // <-- make sure the file is reachable
const mWaitTime = 5000;         // 5 seconds between slides

let slideshowTimer = null;      // Interval reference

$(document).ready(() => {
  $('.details').hide();         // hide details until the first image loads

  // -----------------------------------------------------------------
  // 1. Load the JSON and start the slideshow
  // -----------------------------------------------------------------
  fetchJSON();                  // <-- load data first
  startTimer();                 // <-- start timer (will be restarted after each manual nav)

  // -----------------------------------------------------------------
  // 2. More-indicator toggle
  // -----------------------------------------------------------------
  $('#moreIndicator').on('click', function () {
    $(this).toggleClass('rot90 rot270');
    $('.details').slideToggle(300);
  });

  // -----------------------------------------------------------------
  // 3. Navigation buttons
  // -----------------------------------------------------------------
  $('#nextBtn').on('click', showNextPhoto);
  $('#prevBtn').on('click', showPrevPhoto);
});

/* --------------------------------------------------------------- */
/*  FETCH JSON & STORE IN mImages                                   */
/* --------------------------------------------------------------- */
function fetchJSON() {
  fetch(mUrl)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      // The JSON you posted is { images: [ … ] }
      mImages = data.images || [];          // <-- extract the array
      console.log('Loaded', mImages.length, 'images');

      if (mImages.length > 0) {
        swapPhoto();                       // show first image
        $('.details').show();              // reveal details section
      }
    })
    .catch(err => {
      console.error('fetch error:', err);
      alert('Could not load images – open console for details.');
    });
}

/* --------------------------------------------------------------- */
/*  DISPLAY CURRENT PHOTO                                           */
/* --------------------------------------------------------------- */
function swapPhoto() {
  if (!mImages.length) return;

  const img = mImages[mCurrentIndex];

  $('#photo')
    .attr('src', img.imgPath)                 
    .attr('alt', img.description || '');

  $('.location').text(img.imgLocation || '');
  $('.description').text(img.description || '');
  $('.date').text(img.date || '');           
}


function showNextPhoto() {
  if (!mImages.length) return;
  mCurrentIndex = (mCurrentIndex + 1) % mImages.length;
  swapPhoto();
  restartTimer();           // keep the 5-second rhythm after manual click
}

function showPrevPhoto() {
  if (!mImages.length) return;
  mCurrentIndex = (mCurrentIndex - 1 + mImages.length) % mImages.length;
  swapPhoto();
  restartTimer();
}


function startTimer() {
  if (slideshowTimer) clearInterval(slideshowTimer);
  slideshowTimer = setInterval(showNextPhoto, mWaitTime);
}

function restartTimer() {
  clearInterval(slideshowTimer);
  slideshowTimer = setInterval(showNextPhoto, mWaitTime);
}