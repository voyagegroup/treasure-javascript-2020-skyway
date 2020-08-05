import { Face } from "../../@types/FaceDetector";

export const drawFaceMask: (
  faces: Face[],
  setStyle: (style: MaskStyle) => void
) => void = (faces, setStyle) => {
  for (const face of faces) {
    setStyle({
      position: "absolute",
      top: face.boundingBox.y,
      left: face.boundingBox.x,
      display: "block"
    });
  }
};

export interface MaskStyle {
  position?: "absolute" | "relative";
  top?: number;
  left?: number;
  display?: "none" | "block";
}
