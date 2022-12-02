import React, { useEffect } from "react";
import { DrawSurface } from "./DrawSurface";
import { parseMovementString } from "./rubik/utils/movements";
import { RubiksCubeManager } from "./RubiksCubeManager";
import "./RubikScrollAnimation.css";

type Props = {
  movementString: string,
}
type State = {}

export function RubikScrollAnimation(props: Props) {
  let canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  let rubiksCubeManager: RubiksCubeManager = new RubiksCubeManager();
  let drawSurface: DrawSurface;
  let shouldDraw = false;

  const handleScroll = (e?: Event) => {
    e?.preventDefault();
    if (!shouldDraw) {
      requestAnimationFrame(() => {
        const alpha = window.scrollY / getMaxScrollY();
        canvasRef.current!.style.top = alpha * (window.innerHeight - canvasRef.current!.offsetHeight) + "px";
        shouldDraw = false;
        rubiksCubeManager.update(alpha);
        rubiksCubeManager.draw(drawSurface);
      })
    }
    shouldDraw = true;
  }

  const getMaxScrollY = () => {
    return Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    ) - window.innerHeight;
  }

  useEffect(() => {
    drawSurface = new DrawSurface(canvasRef.current!);
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };

  }, []);

  useEffect(() => {
    const movements = parseMovementString(props.movementString);
    rubiksCubeManager.initialize(movements);
    handleScroll();
  }, [props.movementString]);

  return (
    <div className="rubik-container">
      <canvas
        className="rubik-anim"
        ref={canvasRef}
        style={{
          position: "relative",
          display: "block",
          width: "100%",
        }}
      />
    </div>
  );
}
