// --- Animated Banner Drop Effect ---
const soloImages = [
  // List all images in solo except banner.png
  "IMG_20241222_163044.jpg","IMG_20241222_163049.jpg","IMG_20241222_163051.jpg","IMG_20250101_162754.jpg","IMG_20250101_162805.jpg","IMG_20250103_183629.jpg","IMG_20250107_181445.jpg","IMG_20250107_181456 (1).jpg","IMG_20250107_181456.jpg","IMG-20241124-WA0017.jpg","IMG-20241205-WA0012.jpg","IMG-20241215-WA0017.jpg","IMG-20250119-WA0059.jpg","IMG-20250119-WA0122.jpg","IMG-20250201-WA0008 (1).jpg","IMG-20250202-WA0034.jpg","IMG-20250203-WA0004.jpg","IMG-20250203-WA0005.jpg","IMG-20250205-WA0018 (1).jpg","IMG-20250205-WA0046 (1).jpg","IMG-20250205-WA0067 (1).jpg","IMG-20250205-WA0073 (1).jpg","IMG-20250205-WA0075 (1).jpg","IMG-20250405-WA0008.jpg","IMG-20250405-WA0009.jpg","IMG-20250505-WA0012.jpg","IMG-20250505-WA0015.jpg","IMG-20250505-WA0023.jpg","IMG-20250505-WA0027.jpg","IMG-20250505-WA0028.jpg","IMG-20250505-WA0029.jpg","IMG-20250505-WA0030.jpg","IMG-20250505-WA0031.jpg","IMG-20250505-WA0033.jpg","IMG-20250505-WA0034.jpg","IMG-20250505-WA0035.jpg","IMG-20250505-WA0040.jpg","IMG-20250511-WA0001.jpg","Screenshot_20250123_000756.jpg","Screenshot_20250206_163109 (1).jpg","Screenshot_20250206_205609 (1).jpg","Screenshot_20250207_142032 (1).jpg","Snapchat-111262094 (1) (1).jpg","Snapchat-111262094 (1).jpg","Snapchat-1544830312 (1) (1).jpg","Snapchat-1544830312 (1).jpg","Snapchat-1613237512 (1) (1).jpg","Snapchat-1613237512 (1).jpg","Snapchat-1653172035 (1) (1).jpg","Snapchat-1653172035 (1).jpg","Snapchat-1742740907 (1).jpg","Snapchat-1800900428 (1).jpg","Snapchat-1875360662 (1).jpg","Snapchat-1904725201 (1).jpg","Snapchat-1996547810 (1).jpg","Snapchat-420669609 (1).jpg","Snapchat-425736260 (1).jpg","Snapchat-42926503 (1).jpg","Snapchat-565155465 (1).jpg","Snapchat-689951205 (1).jpg","Snapchat-755698779 (1).jpg","Snapchat-791963831 (1).jpg","Snapchat-914071737 (1).jpg","Snapchat-93611013 (1).jpg"
];

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Limit concurrent sounds to 1
const minConcurrentBannerSounds = 1;
const maxConcurrentBannerSounds = 1;
let currentBannerSounds = [];
let bannerAnimationActive = false;

function playBannerSound() {
  if (!bannerAnimationActive) return;

  currentBannerSounds = currentBannerSounds.filter(a => !a.ended && !a._stopped);
  if (currentBannerSounds.length >= maxConcurrentBannerSounds) return;

  const audio = new Audio('audio/sound.mp3');
  audio.loop = false;
  audio.volume = 1.0;
  audio._stopped = false;

  const stopTime = 0.5; // 1 second
  audio.addEventListener('timeupdate', function () {
    if (!bannerAnimationActive || audio.currentTime >= stopTime) {
      audio.pause();
      audio._stopped = true;
    }
  });

  audio.play().catch(() => {});
  currentBannerSounds.push(audio);
}


function stopAllBannerSounds() {
  bannerAnimationActive = false;

  // Stop multiple drop sounds
  currentBannerSounds.forEach(a => {
    if (!a._stopped) {
      try {
        a.pause();
        a._stopped = true;
      } catch (e) {}
    }
  });
  currentBannerSounds = [];

  // Stop banner background audio if it exists
  const bgAudio = document.getElementById('banner-audio');
  if (bgAudio) {
    try {
      bgAudio.pause();
      bgAudio.currentTime = 0;
    } catch (e) {}
  }
}


function animateBannerDrop() {
  bannerAnimationActive = true;
  const banner = document.getElementById('banner-anim');
  const bannerImg = document.getElementById('main-banner-img');
  const bannerImgMobile = document.getElementById('main-banner-img-mobile');
  const bannerWidth = window.innerWidth;
  const bannerHeight = window.innerHeight;
  soloImages.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = `solo/${src}`;
    img.className = 'falling-image';
    img.style.position = 'absolute';
    img.style.width = '120px';
    img.style.height = '120px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '10px';
    img.style.opacity = 0;
    // Start position (random offscreen)
    const startX = randRange(-bannerWidth, bannerWidth * 2) + 'px';
    const startY = randRange(-bannerHeight, bannerHeight * 2) + 'px';
    const startZ = randRange(-1500, -800) + 'px';
    const startRot = randRange(-90, 90) + 'deg';
    // End position (random on screen)
    const landX = randRange(0, bannerWidth - 120) + 'px';
    const landY = randRange(0, bannerHeight - 120) + 'px';
    img.style.setProperty('--start-x', startX);
    img.style.setProperty('--start-y', startY);
    img.style.setProperty('--start-z', startZ);
    img.style.setProperty('--start-rot', startRot);
    img.style.setProperty('--land-x', landX);
    img.style.setProperty('--land-y', landY);
    img.style.animation = `smashDrop 2.5s forwards`;
    img.style.animationDelay = `${i * 80}ms`;
    img.style.opacity = 1;
    img.style.willChange = 'transform, opacity';
    banner.appendChild(img);
    // Play sound for each image as it starts dropping
    setTimeout(() => {
      playBannerSound();
    }, i * 80);
    // Force reflow to trigger animation
    void img.offsetWidth;
  });
  // After animation, fade out all images and fade in banner
  setTimeout(() => {
    banner.innerHTML = '';
    if (bannerImg) bannerImg.classList.remove('opacity-0');
    if (bannerImg) bannerImg.classList.add('opacity-100');
    if (bannerImgMobile) bannerImgMobile.classList.remove('opacity-0');
    if (bannerImgMobile) bannerImgMobile.classList.add('opacity-100');
    stopAllBannerSounds();
  }, 2.5 * 1000 + soloImages.length * 80 + 500);
}

document.addEventListener('DOMContentLoaded', function() {
  animateBannerDrop();
  var audio = document.getElementById('banner-audio');
  if (audio) {
    audio.currentTime = 0;
    audio.loop = true;
    audio.muted = false;
    audio.volume = 1.0;
    audio.play().catch(()=>{});
  }
});

// --- Draggable Stacked Images: Mouse & Touch Support ---
document.addEventListener('DOMContentLoaded', function() {
    class Paper {
        init(paper)  {
            // Mouse drag
            paper.addEventListener('mousedown', (e) => {
                e.preventDefault();
                let startX = e.clientX;
                let startY = e.clientY;
                let origX = paper.offsetLeft;
                let origY = paper.offsetTop;
                function onMove(ev) {
                    paper.style.position = 'absolute';
                    paper.style.left = (origX + ev.clientX - startX) + 'px';
                    paper.style.top = (origY + ev.clientY - startY) + 'px';
                }
                function onUp() {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                }
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            });
            // Touch drag
            paper.addEventListener('touchstart', (e) => {
                if (e.touches.length !== 1) return;
                e.stopPropagation();
                let touch = e.touches[0];
                let startX = touch.clientX;
                let startY = touch.clientY;
                let origX = paper.offsetLeft;
                let origY = paper.offsetTop;
                function onTouchMove(ev) {
                    if (!ev.touches.length) return;
                    let t = ev.touches[0];
                    paper.style.position = 'absolute';
                    paper.style.left = (origX + t.clientX - startX) + 'px';
                    paper.style.top = (origY + t.clientY - startY) + 'px';
                }
                function onTouchEnd(ev) {
                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                }
                document.addEventListener('touchmove', onTouchMove, { passive: false });
                document.addEventListener('touchend', onTouchEnd);
            });
        }
    }
    const papers = Array.from(document.querySelectorAll('.draggable-img'));
    papers.forEach(paper => {
        const p = new Paper();
        p.init(paper);
    });
});