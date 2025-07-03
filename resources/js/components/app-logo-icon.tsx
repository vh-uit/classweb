import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {/* Book/Education base */}
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 2C3.44772 2 3 2.44772 3 3V19C3 20.1046 3.89543 21 5 21H19C19.5523 21 20 20.5523 20 20V4C20 2.89543 19.1046 2 18 2H4ZM5 4H18V19H5V4Z"
                opacity="0.9"
            />
            
            {/* Inner pages/content */}
            <path
                d="M6 6H16V8H6V6Z"
                opacity="0.7"
            />
            <path
                d="M6 10H14V12H6V10Z"
                opacity="0.7"
            />
            <path
                d="M6 14H12V16H6V14Z"
                opacity="0.7"
            />
            
            {/* Network/connection nodes representing collaboration */}
            <circle cx="16" cy="8" r="1.5" />
            <circle cx="14" cy="12" r="1.5" />
            <circle cx="12" cy="16" r="1.5" />
            
            {/* Connection lines */}
            <path
                d="M15.2 9.2L14.8 10.8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.8"
            />
            <path
                d="M13.2 13.2L12.8 14.8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.8"
            />
        </svg>
    );
}
