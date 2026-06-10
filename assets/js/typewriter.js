document.addEventListener("DOMContentLoaded", function() {
    const words = ["AI & Python Developer", "AI/ML Engineer", "Full-Stack Developer"];
    let i = 0;
    let timer;
    const target = document.getElementById('typewriter');
    
    if (!target) return;

    function typingEffect() {
        let word = words[i].split("");
        var loopTyping = function() {
            if (word.length > 0) {
                target.innerHTML += word.shift();
                timer = setTimeout(loopTyping, 100);
            } else {
                timer = setTimeout(deletingEffect, 2000);
            }
        };
        loopTyping();
    }

    function deletingEffect() {
        let word = words[i].split("");
        var loopDeleting = function() {
            if (word.length > 0) {
                word.pop();
                target.innerHTML = word.join("");
                timer = setTimeout(loopDeleting, 60);
            } else {
                i = (i + 1) % words.length;
                timer = setTimeout(typingEffect, 500);
            }
        };
        loopDeleting();
    }

    typingEffect();
});
