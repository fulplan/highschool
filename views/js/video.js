// Video initialization for HighSchoolive Africa website
// GLightbox handles most video functionality, this is just for any additional video features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize GLightbox for video functionality
    if (typeof GLightbox !== 'undefined') {
        const lightbox = GLightbox({
            touchNavigation: true,
            loop: false,
            autoplayVideos: true
        });
    }
    
    // Additional video-related functionality can be added here if needed
    console.log('Video functionality initialized');
});