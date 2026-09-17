import { useCallback, useEffect, useState } from "react";
import type { FortuneStick, HiddenFortuneStick, Journal } from "../journal/types";
import { loadFortuneState, recordDraw, registerVisit, resetDrawnCycle } from "./fortuneStorage";
import { isHiddenEligible } from "./fortuneEligibility";

export type FortunePhase = "idle" | "shaking" | "drawn";

/** Time the bucket spends "shaking" before a stick falls out. */
const SHAKE_DURATION_MS = 700;

/** How often a hidden stick is picked over a regular one, when one is eligible. */
const HIDDEN_DRAW_CHANCE = 0.4;

type DeviceMotionPermission = {
  requestPermission?: () => Promise<"granted" | "denied">;
};

function getDeviceMotionPermission(): DeviceMotionPermission | undefined {
  return (window as unknown as { DeviceMotionEvent?: DeviceMotionPermission }).DeviceMotionEvent;
}

export function useFortuneJar(journal: Journal) {
  const config = journal.fortune;
  const [phase, setPhase] = useState<FortunePhase>("idle");
  const [drawnStick, setDrawnStick] = useState<FortuneStick | HiddenFortuneStick | null>(null);
  const [isHiddenStick, setIsHiddenStick] = useState(false);
  const [bucketRefilled, setBucketRefilled] = useState(false);
  const [needsMotionPermission, setNeedsMotionPermission] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(false);

  useEffect(() => {
    registerVisit(journal.id);
  }, [journal.id]);

  useEffect(() => {
    const deviceMotion = getDeviceMotionPermission();
    if (deviceMotion && typeof deviceMotion.requestPermission === "function") {
      setNeedsMotionPermission(true);
    } else if (typeof window.DeviceMotionEvent !== "undefined") {
      setMotionEnabled(true);
    }
  }, []);

  const performDraw = useCallback(() => {
    if (!config) return;
    setPhase("shaking");
    window.setTimeout(() => {
      const state = loadFortuneState(journal.id);
      const now = new Date();

      const eligibleHidden = config.hiddenSticks.filter(
        (stick) => !state.drawnHiddenIds.includes(stick.id) && isHiddenEligible(stick.unlock, now, journal, state)
      );

      let pool = config.sticks.filter((stick) => !state.drawnIds.includes(stick.id));
      const refilled = pool.length === 0;
      if (refilled) pool = config.sticks;

      const drawHidden = eligibleHidden.length > 0 && Math.random() < HIDDEN_DRAW_CHANCE;
      const picked = drawHidden
        ? eligibleHidden[Math.floor(Math.random() * eligibleHidden.length)]
        : pool[Math.floor(Math.random() * pool.length)];

      if (refilled) resetDrawnCycle(journal.id);
      recordDraw(journal.id, picked.id, drawHidden);

      setDrawnStick(picked);
      setIsHiddenStick(drawHidden);
      setBucketRefilled(refilled);
      setPhase("drawn");
    }, SHAKE_DURATION_MS);
  }, [config, journal]);

  const shake = useCallback(() => {
    if (phase !== "idle") return;
    performDraw();
  }, [phase, performDraw]);

  const drawNext = useCallback(() => {
    setDrawnStick(null);
    setIsHiddenStick(false);
    setBucketRefilled(false);
    setPhase("idle");
  }, []);

  const requestMotionPermission = useCallback(() => {
    const deviceMotion = getDeviceMotionPermission();
    deviceMotion
      ?.requestPermission?.()
      .then((result) => {
        if (result === "granted") {
          setMotionEnabled(true);
          setNeedsMotionPermission(false);
        }
      })
      .catch(() => {
        // Denied or unsupported — the tap-to-shake fallback still works.
      });
  }, []);

  // Real shake gesture, once motion access is available.
  useEffect(() => {
    if (!motionEnabled) return;

    let last: { x: number; y: number; z: number } | null = null;
    let lastShakeAt = 0;
    const THRESHOLD = 16;
    const COOLDOWN_MS = 1400;

    function onMotion(event: DeviceMotionEvent) {
      const acc = event.accelerationIncludingGravity;
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return;

      if (last) {
        const delta = Math.abs(acc.x - last.x) + Math.abs(acc.y - last.y) + Math.abs(acc.z - last.z);
        const now = Date.now();
        if (delta > THRESHOLD && now - lastShakeAt > COOLDOWN_MS) {
          lastShakeAt = now;
          shake();
        }
      }
      last = { x: acc.x, y: acc.y, z: acc.z };
    }

    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [motionEnabled, shake]);

  return {
    phase,
    drawnStick,
    isHiddenStick,
    bucketRefilled,
    needsMotionPermission,
    motionEnabled,
    requestMotionPermission,
    shake,
    drawNext,
  };
}
