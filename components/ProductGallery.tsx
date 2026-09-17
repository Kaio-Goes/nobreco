"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const SWIPE_THRESHOLD = 40;

// as setas/dots podem estar dentro de um <Link> (card clicável) — impede a navegação disparar
function handleArrowClick(event: React.MouseEvent, action: () => void) {
  event.preventDefault();
  event.stopPropagation();
  action();
}

export default function ProductGallery({
  images,
  alt,
  grayscale = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  className = "",
  badge,
}: Readonly<{
  images: string[];
  alt: string;
  grayscale?: boolean;
  sizes?: string;
  className?: string;
  badge?: React.ReactNode;
}>) {
  const [activeImage, setActiveImage] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    event.preventDefault();
    if (delta < 0) {
      goToNext();
    } else {
      goToPrev();
    }
  }

  function goToPrev() {
    setActiveImage((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function goToNext() {
    setActiveImage((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden bg-creme ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* todas as fotos ficam pré-carregadas empilhadas — só troca opacidade, sem delay de rede */}
      {images.map((img, i) => (
        <Image
          key={img}
          src={img}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-200 ease-out group-hover:scale-105 ${
            grayscale ? "grayscale" : ""
          } ${i === activeImage ? "opacity-100" : "opacity-0"}`}
          sizes={sizes}
        />
      ))}

      {badge}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => handleArrowClick(e, goToPrev)}
            aria-label="Foto anterior"
            className="absolute left-1.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-preto/40 text-off-white transition-colors hover:bg-preto/70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="h-3.5 w-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => handleArrowClick(e, goToNext)}
            aria-label="Próxima foto"
            className="absolute right-1.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-preto/40 text-off-white transition-colors hover:bg-preto/70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="h-3.5 w-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1.5">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                aria-label={`Ver foto ${i + 1}`}
                onClick={(e) => handleArrowClick(e, () => setActiveImage(i))}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeImage
                    ? "w-4 bg-off-white"
                    : "w-1.5 bg-off-white/60 hover:bg-off-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
