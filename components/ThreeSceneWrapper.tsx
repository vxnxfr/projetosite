'use client';

import dynamic from 'next/dynamic';

const ThreeBarberScene = dynamic(() => import('./ThreeBarberScene'), {
  ssr: false,
  loading: () => null,
});

export default function ThreeSceneWrapper() {
  return <ThreeBarberScene />;
}

