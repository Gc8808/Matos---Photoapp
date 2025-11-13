let mCurrentIndex = 0;
let mImages = [];
const mUrl = 'images.json';
const mWaitTime = 5000;
let slideshowTimer = null;

$(document).ready(() => {
  $('.details').hide();

  // Load JSON first
  fetchJSON().then(() => {
    // Only start slideshow AFTER images are loaded
    if (mImages.length > 0) {
      swapPhoto();
      $('.details').show();
      startTimer(); // Now safe to start
    }
  });

  $('#moreIndicator').on('click', function () {
    $(this).toggleClass('rot90 rot270');
    $('.details').slideToggle(300);
  });

  $('#nextBtn').on('click', showNextPhoto);
  $('#prevBtn').on('click', showPrevPhoto);
});

// Make fetchJSON return a promise
function fetchJSON() {
  return fetch(mUrl)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      mImages = data.images || [];
      console.log('Loaded', mImages.length, 'BMW images');
    })
    .catch(err => {
      console.error('Fetch failed:', err);
      alert('Failed to load images. Check console.');
    });
}

// Safe swapPhoto with null checks
function swapPhoto() {
  if (!mImages.length || mCurrentIndex < 0 || mCurrentIndex >= mImages.length) {
    console.warn('No image to display at index', mCurrentIndex);
    return;
  }

  const img = mImages[mCurrentIndex];

  // Double-check imgPath exists
  if (!img || !img.imgPath) {
    console.error('Invalid image object:', img);
    return;
  }

  $('#photo')
    .attr('src', img.imgPath)
    .attr('alt', img.description || 'BMW Gallery Image');

  $('.location').text(img.imgLocation || '');
  $('.description').text(img.description || '');
  $('.date').text(img.date || '');
}

function showNextPhoto() {
  if (!mImages.length) return;
  mCurrentIndex = (mCurrentIndex + 1) % mImages.length;
  swapPhoto();
  restartTimer();
}

function showPrevPhoto() {
  if (!mImages.length) return;
  mCurrentIndex = (mCurrentIndex - 1 + mImages.length) % mImages.length;
  swapPhoto();
  restartTimer();
}

