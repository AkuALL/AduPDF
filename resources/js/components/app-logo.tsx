import logoImg from '../../images/LOGO.jpg';

interface AppLogoProps {
    className?: string;
    imageClassName?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    withBackground?: boolean;
    alt?: string;
}

export function AppLogo({
    className = '',
    imageClassName = '',
    size = 'md',
    withBackground = false,
    alt = 'Logo AduPDF',
}: AppLogoProps) {
    const sizeMap = {
        xs: 'h-6 w-6',
        sm: 'h-7 w-7',
        md: 'h-9 w-9',
        lg: 'h-11 w-11',
        xl: 'h-14 w-14',
    };

    const dimensionClass = sizeMap[size] || 'h-9 w-9';

    if (withBackground) {
        return (
            <div
                className={`inline-flex shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-xs ring-1 ring-white/20 transition-transform ${dimensionClass} ${className}`}
            >
                <img
                    src={logoImg}
                    alt={alt}
                    className={`h-full w-full object-contain rounded ${imageClassName}`}
                />
            </div>
        );
    }

    return (
        <img
            src={logoImg}
            alt={alt}
            className={`shrink-0 object-contain rounded-lg ${dimensionClass} ${imageClassName} ${className}`}
        />
    );
}

export default AppLogo;
