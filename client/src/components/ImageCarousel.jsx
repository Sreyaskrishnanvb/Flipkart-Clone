import { useState } from 'react';

function ImageCarousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="image-carousel">
        <div className="image-carousel__main">
          <img src="https://via.placeholder.com/400x400?text=No+Image" alt="No image" />
        </div>
      </div>
    );
  }

  return (
    <div className="image-carousel">
      <div className="image-carousel__thumbnails">
        {images.map((img, index) => (
          <div
            key={img.id || index}
            className={`image-carousel__thumb ${index === activeIndex ? 'active' : ''}`}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
          >
            <img src={img.imageUrl} alt={`Thumbnail ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="image-carousel__main">
        <img
          src={images[activeIndex]?.imageUrl}
          alt="Product"
        />
      </div>
    </div>
  );
}

export default ImageCarousel;
