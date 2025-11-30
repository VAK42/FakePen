import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
interface ImageGalleryProps {
  images: string[];
}
export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  if (images.length === 0) return null;
  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };
  const closeLightbox = () => {
    setSelectedIndex(null);
  };
  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };
  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };
  const gridClass = images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : images.length === 3 ? 'grid-cols-3' : 'grid-cols-2';
  return (
    <>
      <div className={`grid ${gridClass} gap-2 mt-3 rounded-lg overflow-hidden`}>
        {images.slice(0, 4).map((image, index) => (
          <div key={index} className={`relative cursor-pointer hover:opacity-90 transition-opacity ${images.length === 3 && index === 0 ? 'col-span-3' : ''}`} onClick={() => openLightbox(index)}>
            <img src={image} alt={`Image ${index + 1}`} className="w-full h-full object-cover aspect-square" />
            {index === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-bold">
                +{images.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors">
            <X className="h-6 w-6" />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); goToPrevious(); }} className="absolute left-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors">
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); goToNext(); }} className="absolute right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors">
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
          <img src={images[selectedIndex]} alt={`Image ${selectedIndex + 1}`} className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-4 text-white text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}