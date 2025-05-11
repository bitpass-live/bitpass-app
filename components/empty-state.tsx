'use client';

import type React from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconBackgroundProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
}

export const EmptyState: React.FC<IconBackgroundProps> = ({ icon: Icon, size = 320, className = '' }) => {
  const pulseAnimations = `
  @keyframes pulse-center {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.12); }
  }
  
  @keyframes pulse-wave {
    0%, 100% { opacity: var(--base-opacity); transform: scale(1); }
    50% { opacity: calc(var(--base-opacity) * 0.2); transform: scale(1.12); }
  }
  
  .center-circle {
    animation: pulse-center 2s ease-in-out infinite;
    transform-origin: center center;
  }
  
  .circle-4 {
    --base-opacity: 0.14;
    animation: pulse-wave 2s ease-in-out infinite;
    animation-delay: 0.2s;
    transform-origin: center center;
  }
  
  .circle-3 {
    --base-opacity: 0.1;
    animation: pulse-wave 2s ease-in-out infinite;
    animation-delay: 0.4s;
    transform-origin: center center;
  }
  
  .circle-2 {
    --base-opacity: 0.06;
    animation: pulse-wave 2s ease-in-out infinite;
    animation-delay: 0.6s;
    transform-origin: center center;
  }
  
  .circle-1 {
    --base-opacity: 0.02;
    animation: pulse-wave 2s ease-in-out infinite;
    animation-delay: 0.8s;
    transform-origin: center center;
  }
`;

  return (
    <div className={className} style={{ width: size, height: size }}>
      <style jsx>{pulseAnimations}</style>
      <svg width={size} height={size} viewBox='0 0 320 320' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <g clipPath='url(#clip0_96_105)'>
          <g opacity='0.02' filter='url(#filter0_d_96_105)' className='circle-1'>
            <circle cx='160' cy='160' r='160' fill='url(#paint0_radial_96_105)' shapeRendering='crispEdges' />
            <circle
              cx='160'
              cy='160'
              r='159'
              stroke='#141414'
              strokeOpacity='0.64'
              strokeWidth='2'
              shapeRendering='crispEdges'
            />
          </g>
          <g opacity='0.06' filter='url(#filter1_d_96_105)' className='circle-2'>
            <circle cx='160' cy='160' r='127.407' fill='url(#paint1_radial_96_105)' shapeRendering='crispEdges' />
            <circle
              cx='160'
              cy='160'
              r='126.407'
              stroke='#141414'
              strokeOpacity='0.64'
              strokeWidth='2'
              shapeRendering='crispEdges'
            />
          </g>
          <g opacity='0.1' filter='url(#filter2_d_96_105)' className='circle-3'>
            <circle cx='160' cy='160' r='98.5185' fill='url(#paint2_radial_96_105)' shapeRendering='crispEdges' />
            <circle
              cx='160'
              cy='160'
              r='97.5185'
              stroke='#141414'
              strokeOpacity='0.64'
              strokeWidth='2'
              shapeRendering='crispEdges'
            />
          </g>
          <g opacity='0.14' filter='url(#filter3_d_96_105)' className='circle-4'>
            <circle cx='160' cy='160' r='72.5926' fill='url(#paint3_radial_96_105)' shapeRendering='crispEdges' />
            <circle
              cx='160'
              cy='160'
              r='71.5926'
              stroke='#141414'
              strokeOpacity='0.64'
              strokeWidth='2'
              shapeRendering='crispEdges'
            />
          </g>
          <g className='center-circle'>
            <circle cx='160' cy='160' r='39.2593' fill='#242424' />
            <foreignObject x='120.741' y='120.741' width='78.5186' height='78.5186'>
              <div className='flex items-center justify-center w-full h-full'>
                <Icon className='w-8 h-8 text-white transform-gpu' strokeWidth={1.5} />
              </div>
            </foreignObject>
          </g>
        </g>
        <defs>
          <filter
            id='filter0_d_96_105'
            x='-24'
            y='-24'
            width='368'
            height='368'
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodOpacity='0' result='BackgroundImageFix' />
            <feColorMatrix
              in='SourceAlpha'
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
              result='hardAlpha'
            />
            <feOffset />
            <feGaussianBlur stdDeviation='12' />
            <feComposite in2='hardAlpha' operator='out' />
            <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0' />
            <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_96_105' />
            <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_96_105' result='shape' />
          </filter>
          <filter
            id='filter1_d_96_105'
            x='8.59277'
            y='8.59277'
            width='302.814'
            height='302.814'
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodOpacity='0' result='BackgroundImageFix' />
            <feColorMatrix
              in='SourceAlpha'
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
              result='hardAlpha'
            />
            <feOffset />
            <feGaussianBlur stdDeviation='12' />
            <feComposite in2='hardAlpha' operator='out' />
            <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0' />
            <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_96_105' />
            <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_96_105' result='shape' />
          </filter>
          <filter
            id='filter2_d_96_105'
            x='37.4814'
            y='37.4814'
            width='245.037'
            height='245.037'
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodOpacity='0' result='BackgroundImageFix' />
            <feColorMatrix
              in='SourceAlpha'
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
              result='hardAlpha'
            />
            <feOffset />
            <feGaussianBlur stdDeviation='12' />
            <feComposite in2='hardAlpha' operator='out' />
            <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0' />
            <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_96_105' />
            <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_96_105' result='shape' />
          </filter>
          <filter
            id='filter3_d_96_105'
            x='63.4072'
            y='63.4072'
            width='193.186'
            height='193.186'
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodOpacity='0' result='BackgroundImageFix' />
            <feColorMatrix
              in='SourceAlpha'
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
              result='hardAlpha'
            />
            <feOffset />
            <feGaussianBlur stdDeviation='12' />
            <feComposite in2='hardAlpha' operator='out' />
            <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0' />
            <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_96_105' />
            <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_96_105' result='shape' />
          </filter>
          <radialGradient
            id='paint0_radial_96_105'
            cx='0'
            cy='0'
            r='1'
            gradientUnits='userSpaceOnUse'
            gradientTransform='translate(160 160) rotate(90) scale(160)'
          >
            <stop offset='0.24' stopColor='#141414' stopOpacity='0' />
            <stop offset='1' stopColor='#9E9E9E' />
          </radialGradient>
          <radialGradient
            id='paint1_radial_96_105'
            cx='0'
            cy='0'
            r='1'
            gradientUnits='userSpaceOnUse'
            gradientTransform='translate(160 160) rotate(90) scale(127.407)'
          >
            <stop offset='0.24' stopColor='#141414' stopOpacity='0' />
            <stop offset='1' stopColor='#9E9E9E' />
          </radialGradient>
          <radialGradient
            id='paint2_radial_96_105'
            cx='0'
            cy='0'
            r='1'
            gradientUnits='userSpaceOnUse'
            gradientTransform='translate(160 160) rotate(90) scale(98.5185)'
          >
            <stop offset='0.24' stopColor='#141414' stopOpacity='0' />
            <stop offset='1' stopColor='#9E9E9E' />
          </radialGradient>
          <radialGradient
            id='paint3_radial_96_105'
            cx='0'
            cy='0'
            r='1'
            gradientUnits='userSpaceOnUse'
            gradientTransform='translate(160 160) rotate(90) scale(72.5926)'
          >
            <stop offset='0.24' stopColor='#141414' stopOpacity='0' />
            <stop offset='1' stopColor='#9E9E9E' />
          </radialGradient>
          <clipPath id='clip0_96_105'>
            <rect width='320' height='320' fill='white' />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};
