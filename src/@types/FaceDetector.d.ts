
export interface FaceDetector {
    detect: (ImageData) => Promise<Face[]>
}

export interface Face {
    boundingBox: BoundingBox
}

interface BoundingBox {
    x: number,
    y: number
}