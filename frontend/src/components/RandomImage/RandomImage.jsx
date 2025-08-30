import React from 'react';
import img1 from './assets/images/img1.webp';
import img2 from './assets/images/img2.webp';
import img3 from './assets/images/img3.webp';

const images = [img1, img2, img3];

function getRandomImage(images) {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

function RandomImageComponent() {
    const randomImage = getRandomImage(images);

    return (
        <img src={randomImage} alt="Random" />
    );
}

export default RandomImageComponent;