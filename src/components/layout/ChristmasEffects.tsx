"use client";

import Snowfall from "react-snowfall";
import { useChristmas } from "@/providers/ChristmasProvider";

export function ChristmasEffects() {
  const { enabled } = useChristmas();

  if (!enabled) return null;

  return (
    <>
      {/* Snowfall */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <Snowfall
          snowflakeCount={25}
          speed={[0.5, 2]}
          wind={[-0.5, 1]}
          radius={[1, 4]}
          color="rgba(255, 255, 255, 0.8)"
        />
      </div>

      {/* Pine branches */}
      <div
        className="pine-corner pine-top-left"
        style={{
          position: "fixed",
          top: -50,
          left: -50,
          width: 220,
          height: 220,
          pointerEvents: "none",
          zIndex: 9998,
          transform: "rotate(135deg)",
        }}
      >
        <img
          src="/assets/pine-branch.svg"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div
        className="pine-corner pine-top-right"
        style={{
          position: "fixed",
          top: -50,
          right: -50,
          width: 220,
          height: 220,
          pointerEvents: "none",
          zIndex: 9998,
          transform: "rotate(225deg)",
        }}
      >
        <img
          src="/assets/pine-branch.svg"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      <style jsx>{`
        .pine-corner {
          position: fixed;
          pointer-events: none;
          z-index: 9998;
          width: 220px;
          height: 220px;
        }
        .pine-corner img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .pine-top-left {
          top: -50px;
          left: -50px;
          transform: rotate(135deg);
        }
        .pine-top-right {
          top: -50px;
          right: -50px;
          transform: rotate(225deg);
        }
        @media (max-width: 900px) {
          .pine-corner {
            width: 160px;
            height: 160px;
          }
          .pine-top-left {
            top: -40px;
            left: -40px;
          }
          .pine-top-right {
            top: -40px;
            right: -40px;
          }
        }
        @media (max-width: 768px) {
          .pine-corner {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
