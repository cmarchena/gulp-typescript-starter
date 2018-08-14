function loadImage(src, parent, callback) {
    const img = document.createElement("img");
    img.src = src;
    img.onload = callback;
    parent.appendChild(img);
}
const img1 = "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=98c2d910abcc9bb04fcb180f6a45e407&auto=format&fit=crop&w=1091&q=80";
const img2 = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cea32ac97f8ffde3f76df4a646ac8b4d&auto=format&fit=crop&w=1050&q=80";
const img3 = "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=247b379684184e3794e14d3400c7d629&auto=format&fit=crop&w=1050&q=80";
const parent1 = document.getElementById("image-1");
const parent2 = document.getElementById("image-2");
const parent3 = document.getElementById("image-3");
const callback = (message) => {
    return console.log(message);
};
loadImage(img1, parent1, callback("done"));
loadImage(img2, parent2, callback("done"));
loadImage(img3, parent3, callback("done"));
