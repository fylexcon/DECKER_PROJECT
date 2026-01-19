/* --- assets/js/decking.js --- */

/**
 * Switches the main product image when a thumbnail is clicked.
 * Includes a smooth opacity transition.
 * @param {HTMLElement} thumb - The thumbnail element clicked
 * @param {string} mainId - The ID of the main image to update
 */
function switchImage(thumb, mainId) {
  const mainImg = document.getElementById(mainId);
  
  // Fade out
  mainImg.style.opacity = 0;
  
  setTimeout(() => {
    // Change source
    mainImg.src = thumb.src;
    // Fade in
    mainImg.style.opacity = 1;
  }, 200);

  // Update active class on thumbnails
  const siblings = thumb.parentElement.children;
  for (let img of siblings) {
    img.classList.remove('active');
  }
  thumb.classList.add('active');
}

/**
 * Toggles the "Read More" expansion for product descriptions.
 * @param {HTMLElement} btn - The "Read More" button clicked
 */
function toggleReadMore(btn) {
  const desc = btn.previousElementSibling;
  desc.classList.toggle('expanded');
  
  if (desc.classList.contains('expanded')) {
    btn.textContent = 'Read Less';
  } else {
    btn.textContent = 'Read More';
  }
}