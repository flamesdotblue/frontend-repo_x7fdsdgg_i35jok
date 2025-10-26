import React from 'react';
import Spline from '@splinetool/react-spline';

const Hero3D = () => {
  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E2A5E] via-indigo-700 to-blue-600" />

      {/* Animated particles */}
      <div className="pointer-events-none absolute inset-0"> 
        <div className="absolute -top-10 left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-blue-300/10 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
      </div>

      <div className="relative grid h-full grid-cols-1 gap-6 px-6 py-12 md:grid-cols-2 md:px-10 lg:px-16">
        <div className="z-10 flex flex-col items-start justify-center text-white">
          <span className="mb-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md ring-1 ring-white/20">Alliance University • Resume Maker</span>
          <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
            Build a polished, campus-ready resume with a modern glassmorphism touch
          </h1>
          <p className="mt-4 max-w-xl text-white/80">
            Fill the guided form below. Your progress auto-saves. Upload photos, add projects, and select logos — then generate your resume when ready.
          </p>
        </div>
        <div className="relative h-[40vh] w-full md:h-auto">
          <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          {/* soft gradient overlay to blend with background, doesn't block interaction */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1E2A5E]/30 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Hero3D;
