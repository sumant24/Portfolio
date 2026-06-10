document.addEventListener("DOMContentLoaded", function() {
    var video = document.getElementById('hero-video');
    var unmuteBtn = document.getElementById('video-unmute-btn');
    if (!video) return;

    // Ensure audio volume starts at maximum
    video.volume = 1.0;

    // Set initial muted state to false (will be overwritten if autoplay is blocked)
    video.muted = false;

    var autoplayTimeout;

    // User interaction handler to unmute the video and restart it with sound
    function startUnmuted() {
        if (autoplayTimeout) {
            clearTimeout(autoplayTimeout);
        }

        // Unmute and set volume to max
        video.muted = false;
        video.volume = 1.0;

        // Restart and play from the beginning with sound
        video.currentTime = 0;
        video.play().then(function() {
            console.log("Unmuted playback started from the beginning.");
        }).catch(function(e) {
            console.log("Play failed on interaction:", e);
        });

        // Hide the unmute overlay button
        if (unmuteBtn) {
            unmuteBtn.style.display = 'none';
        }

        // Clean up listeners
        document.removeEventListener('click', startUnmuted);
        document.removeEventListener('touchstart', startUnmuted);
        if (unmuteBtn) {
            unmuteBtn.removeEventListener('click', startUnmuted);
        }
    }

    document.addEventListener('click', startUnmuted);
    document.addEventListener('touchstart', startUnmuted);
    if (unmuteBtn) {
        unmuteBtn.addEventListener('click', startUnmuted);
    }

    // Function to initialize the autoplay sequence
    function initAutoplay() {
        if (autoplayTimeout) return;
        autoplayTimeout = setTimeout(function() {
            // Try playing unmuted first
            video.muted = false;
            var playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(function() {
                    console.log("Unmuted autoplay succeeded.");
                    // Autoplay succeeded unmuted, clean up the interaction listener and button
                    document.removeEventListener('click', startUnmuted);
                    document.removeEventListener('touchstart', startUnmuted);
                    if (unmuteBtn) {
                        unmuteBtn.style.display = 'none';
                    }
                }).catch(function(error) {
                    console.log("Unmuted autoplay blocked, falling back to muted autoplay:", error);
                    
                    // Fall back to muted autoplay to ensure the video plays immediately
                    video.muted = true;
                    video.play().then(function() {
                        console.log("Muted autoplay started successfully.");
                    }).catch(function(err) {
                        console.log("Muted autoplay also blocked:", err);
                    });
                });
            }
        }, 1000); // 1.0 second delay after load
    }

    // Bulletproof trigger for the load event
    if (document.readyState === "complete" || document.readyState === "interactive") {
        initAutoplay();
    } else {
        window.addEventListener('load', initAutoplay);
    }
});
