"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: false,
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 30,
      particles: {
        number: {
          value: 15,
          density: {
            enable: true,
            area: 1500,
          },
        },
        color: {
          value: "#00C2FF",
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.3,
        },
        size: {
          value: { min: 1, max: 3 },
        },
        links: {
          enable: true,
          distance: 200,
          color: "#00C2FF",
          opacity: 0.12,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.3,
          direction: "none" as const,
          straight: false,
          outModes: {
            default: "out" as const,
          },
        },
      },
      interactivity: {
        detectsOn: "canvas" as const,
        events: {
          onHover: {
            enable: false,
          },
          onClick: {
            enable: false,
          },
        },
      },
      detectRetina: false,
    }),
    []
  );

  if (!init) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="particles-container"
    />
  );
}
