'use client';

import { useEffect, useState } from 'react';

type CatImage = { url: string; id: string };

export default function HomePage() {
  const [images, setImages] = useState<CatImage[] | null>(null);
  const [loadingImages, setLoadingImages] = useState(false);
  const [overlays, setOverlays] = useState<Record<string, { text: string; loading: boolean }>>({});

  async function fetchImages() {
    setLoadingImages(true);
    setImages(null);
    try {
      const res = await fetch('https://api.thecatapi.com/v1/images/search?limit=9');
      const data = (await res.json()) as CatImage[];
      setImages(data.slice(0, 9));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingImages(false);
    }
  }

  async function handleClick(id: string) {
    setOverlays(prev => ({ ...prev, [id]: { text: 'Loading...', loading: true } }));
    try {
      const res  = await fetch('https://catfact.ninja/fact');
      const json = (await res.json()) as { fact: string };
      setOverlays(prev => ({ ...prev, [id]: { text: json.fact, loading: false } }));
    } catch {
      setOverlays(prev => ({ ...prev, [id]: { text: 'Error loading fact.', loading: false } }));
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <main
      className="
        min-h-screen
        bg-[radial-gradient(ellipse_at_center,_#fafaff,_#cbb8ff)]
        pt-35
        pb-10
        px-4
      "
    >
      <h1 className="text-5xl font-extrabold text-center text-gray-700 pb-22">
        Cats Cats Cats!
      </h1>

      <div
        id="gallery"
        className="
          grid grid-cols-3 gap-6 justify-center
          max-w-xl mx-auto 
        "
      >
        {loadingImages && (
          <div className="col-span-3 text-center text-lg text-gray-500">Loading...</div>
        )}
        {!loadingImages &&
          images?.map(img => (
            <div
              key={img.id}
              className="relative w-40 h-40 rounded-xl overflow-hidden shadow-lg cursor-pointer"
              onClick={() => handleClick(img.id)}
            >
              <img src={img.url} alt="Cute cat" className="w-full h-full object-cover" />
              {overlays[img.id] && (
                <div
                  className="
                    absolute inset-0
                    bg-black/60
                    p-2
                    overflow-y-auto
                    text-white text-sm
                    whitespace-pre-wrap break-words
                  "
                >
                  {overlays[img.id].text}
                </div>
              )}
            </div>
          ))}
      </div>

      <button
        onClick={fetchImages}
        className="
          block mt-12
          mx-auto
          px-6 py-3
          bg-purple-600 hover:bg-purple-700
          text-white font-semibold
          rounded-xl
          shadow-md
          transition
          duration-200
        "
      >
        Fetch New Cats
      </button>
    </main>
  );
}
