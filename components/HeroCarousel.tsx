"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const SLIDES = [
  { src: "/carrossel/prancheta-01.png", alt: "Nobreco — coleção 1" },
  { src: "/carrossel/prancheta-02.png", alt: "Nobreco — coleção 2" },
  { src: "/carrossel/prancheta-03.png", alt: "Nobreco — coleção 3" },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    setIndex((i + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => goTo(index + 1), 5000);
    return () => clearInterval(timer);
  }, [index, goTo]);

  return (
    // aspect-video casa com a proporção real das imagens (1920x1080), evitando corte/distorção
    <div className="group relative w-full aspect-video overflow-hidden bg-preto">
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-all duration-1000 ease-out ${
            i === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
        />
      ))}

      <button
        type="button"
        aria-label="Slide anterior"
        onClick={() => goTo(index - 1)}
        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-preto/40 text-off-white opacity-0 backdrop-blur transition-opacity duration-200 hover:bg-preto/60 group-hover:opacity-100 sm:h-10 sm:w-10"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Próximo slide"
        onClick={() => goTo(index + 1)}
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-preto/40 text-off-white opacity-0 backdrop-blur transition-opacity duration-200 hover:bg-preto/60 group-hover:opacity-100 sm:h-10 sm:w-10"
      >
        ›
      </button>

      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Ir para o slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? "w-6 bg-off-white"
                : "w-1.5 bg-off-white/50 hover:bg-off-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
