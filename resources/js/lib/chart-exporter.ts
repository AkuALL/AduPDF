/**
 * Client-side SVG to high-resolution PNG chart exporter (Plotly-style camera snapshot)
 */
export function exportSvgToPng(svgElement: SVGSVGElement | null, filename: string): void {
    if (!svgElement) return;

    try {
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgElement);

        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }

        const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement('canvas');
            // High DPI 2x scaling for crisp, retina-ready plot output
            canvas.width = 1520;
            canvas.height = Math.round((svgElement.clientHeight / (svgElement.clientWidth || 1)) * 1520) || 600;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const pngUrl = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;
                downloadLink.download = `${filename.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
            URL.revokeObjectURL(url);
        };

        img.src = url;
    } catch (err) {
        console.error('Gagal mengunduh gambar grafik:', err);
    }
}
