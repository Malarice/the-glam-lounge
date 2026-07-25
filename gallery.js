function initGallery() {
    // your entire gallery.js code goes here
}

document.addEventListener("DOMContentLoaded", () => {

    // Make sure the gallery exists on this page
    const wrapper = document.getElementById("gallery-wrapper");
    if (!wrapper) return; // <-- prevents home page failure

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    let allImages = [];

    fetch("/gallery.json")
        .then(res => res.json())
        .then(images => {
            allImages = images;

            const shuffled = shuffle([...images]);
            renderGallery(shuffled.slice(0, 5));

            const tabs = document.querySelectorAll(".cs-button");
            if (tabs.length > 0) {
                tabs[0].classList.add("cs-active");
            }
        });

    function renderGallery(images) {
        wrapper.innerHTML = "";

        const galleryDiv = document.createElement("div");
        galleryDiv.className = "cs-gallery";

        images.forEach(file => {
            const picture = document.createElement("picture");
            picture.className = "cs-image";

            picture.innerHTML = `
                <source media="(max-width: 600px)" srcset="/assets/gallery/${file}">
                <source media="(min-width: 601px)" srcset="/assets/gallery/${file}">
                <img loading="lazy" decoding="async" src="/assets/gallery/${file}" alt="gallery image">
            `;

            galleryDiv.appendChild(picture);
        });

        wrapper.appendChild(galleryDiv);
    }

    const tabs = document.querySelectorAll(".cs-button");

    tabs.forEach(button => {
        button.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("cs-active"));
            button.classList.add("cs-active");

            const shuffled = shuffle([...allImages]);
            renderGallery(shuffled.slice(0, 5));
        });
    });

});

