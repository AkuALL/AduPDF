import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/**
 * Native scroll-snap carousel. Auto-advances every 3s until the visitor
 * clicks, touches or scrolls it; then it stays under manual control.
 */
export default function FacilityPhotoCarousel({ images, alt }: { images: string[]; alt: string }) {
    const track = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);
    const [manual, setManual] = useState(false);

    useEffect(() => {
        if (manual || images.length < 2) {
            return;
        }

        const timer = setInterval(() => {
            const el = track.current;

            if (el) {
                const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % images.length;
                el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
            }
        }, 3000);

        return () => clearInterval(timer);
    }, [manual, images.length]);

    function goTo(i: number) {
        setManual(true);
        track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: 'smooth' });
    }

    return (
        <div className="self-start">
            <div className="relative">
                <div
                    ref={track}
                    onPointerDown={() => setManual(true)}
                    onWheel={() => setManual(true)}
                    onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
                    className="flex aspect-[3/2] snap-x snap-mandatory overflow-x-auto rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {images.map((src, i) => (
                        <img
                            key={src}
                            src={src}
                            alt={`${alt} ${i + 1}`}
                            loading={i === 0 ? 'eager' : 'lazy'}
                            draggable={false}
                            className="h-full w-full shrink-0 snap-center object-contain"
                        />
                    ))}
                </div>
                {images.length > 1 && (
                    <>
                        {[
                            { label: 'Foto sebelumnya', step: -1, Icon: ChevronLeft, side: 'left-2' },
                            { label: 'Foto berikutnya', step: 1, Icon: ChevronRight, side: 'right-2' },
                        ].map(({ label, step, Icon, side }) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => goTo((index + step + images.length) % images.length)}
                                aria-label={label}
                                className={`absolute top-1/2 ${side} flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-[#111827] shadow-sm backdrop-blur-sm transition hover:bg-white/90`}
                            >
                                <Icon className="h-4 w-4" />
                            </button>
                        ))}
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div className="mt-3 flex justify-center gap-1.5">
                    {images.map((src, i) => (
                        <button
                            key={src}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Foto ${i + 1}`}
                            className={`h-2 w-2 rounded-full transition ${i === index ? 'bg-[#2D4C79]' : 'bg-[#D0D5DD] hover:bg-[#98A2B3]'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
