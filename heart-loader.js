// Heart Loader Integration Script
(function() {
  document.body.classList.add('loading');
  // Create loader container
  var loader = document.createElement('div');
  loader.id = 'heart-loader';
  loader.innerHTML = `
    <div class="heart-container">
      <svg id="heart" viewBox="-2 -2 36 34" preserveAspectRatio="xMidYMid meet">
        <path id="heartPath" class="heart-path"
          d="M23.6,0c-3.4,0-6.3,2.1-7.6,5.1C14.7,2.1,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4
             c0,9.6,16,21.2,16,21.2s16-11.6,16-21.2C32,3.8,28.2,0,23.6,0z"/>
      </svg>
    </div>
    <div class="typed-text">
      <span id="typed"></span>
    </div>
  `;
  loader.style.position = 'fixed';
  loader.style.inset = 0;
  loader.style.zIndex = 9999;
  loader.style.background = '#fff';
  loader.style.display = 'flex';
  loader.style.flexDirection = 'column';
  loader.style.justifyContent = 'center';
  loader.style.alignItems = 'center';
  loader.style.transition = 'opacity 0.6s';
  document.body.appendChild(loader);

  // Loader styles
  var style = document.createElement('style');
  style.innerHTML = `
    .heart-container { display: flex; justify-content: center; align-items: center; }
    #heart { width: 160px; height: 160px; stroke: red; stroke-width: 0.4; fill: none; overflow: visible; }
    .heart-path { stroke-dasharray: 1500; stroke-dashoffset: 1500; }
    @keyframes beat { 0%,100%{transform:scale(1);} 50%{transform:scale(1.08);} }
    .typed-text { margin-top: 30px; font-size: 1.2rem; color: #444; text-align: center; }
  `;
  document.head.appendChild(style);

  // Typed.js
  var typedScript = document.createElement('script');
  typedScript.src = 'https://cdn.jsdelivr.net/npm/typed.js@2.0.12';
  typedScript.onload = function() {
    new window.Typed('#typed', {
      strings: [
        'Drawing love with every stroke...',
        'Creating a moment to remember...',
        'Almost ready for something beautiful...'
      ],
      typeSpeed: 50,
      backSpeed: 25,
      loop: true
    });
  };
  document.body.appendChild(typedScript);

  // Heart animation logic
  var heart = loader.querySelector('#heart');
  var path = loader.querySelector('#heartPath');
  function animateHeart() {
    path.style.strokeDasharray = 1500;
    path.style.strokeDashoffset = 1500;
    path.style.animation = 'none';
    heart.style.animation = 'none';
    void path.offsetWidth;
    void heart.offsetWidth;
    let duration = 12000;
    let start = null;
    function drawStep(ts) {
      if (!start) start = ts;
      let progress = Math.min((ts - start) / duration, 1);
      path.style.strokeDashoffset = 1500 - 1500 * progress;
      if (progress < 1) {
        requestAnimationFrame(drawStep);
      } else {
        heart.style.animation = 'beat 1s ease-in-out 2';
        setTimeout(animateHeart, 2000);
      }
    }
    requestAnimationFrame(drawStep);
  }
  animateHeart();

  // Remove loader when site is fully loaded
  window.addEventListener('load', function() {
    setTimeout(function() {
      loader.style.opacity = 0;
      setTimeout(function() {
        loader.remove();
        document.body.classList.remove('loading');
      }, 600);
    }, 400); // slight delay for smoothness
  });
})();
