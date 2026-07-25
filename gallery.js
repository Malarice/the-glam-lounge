function initGallery() {
    // your entire gallery.js code goes here
}

document.addEventListener("DOMContentLoaded", () => {

    const wrapper = document.getElementById("gallery-wrapper");
    if (!wrapper) return;

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
        });

    function renderGallery(images) {
        wrapper.innerHTML = "";

        let count = 1;

        images.forEach(file => {
            const picture = document.createElement("picture");
            picture.className = `cs-picture cs-picture${count}`;

            picture.innerHTML = `
                <source media="(max-width: 600px)" srcset="assets/gallery/${file}">
                <source media="(min-width: 601px)" srcset="assets/gallery/${file}">
                <img loading="lazy" decoding="async" src="assets/gallery/${file}" alt="gallery image">
            `;

            wrapper.appendChild(picture);
            count++;
        });

        const zigzag = document.createElement("img");
        zigzag.className = "cs-graphic";
        zigzag.src = "https://csimg.nyc3.cdn.digitaloceanspaces.com/Images%2FGraphics%2Fzigzag.svg";
        zigzag.alt = "zigzag";
        zigzag.loading = "lazy";
        zigzag.decoding = "async";

        wrapper.appendChild(zigzag);
    }

});

