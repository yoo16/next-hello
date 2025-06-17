'use client';

import { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';

interface WebcamOverlayProps {
    width?: number;
    height?: number;
}

export default function WebcamOverlay({ width = 640, height = 480 }: WebcamOverlayProps) {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayImage = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = '/frame1.png';
        img.onload = () => {
            overlayImage.current = img;
        };
    }, []);

    useEffect(() => {
        let animationFrameId: number;

        const draw = () => {
            const video = webcamRef.current?.video as HTMLVideoElement | null;
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');

            if (
                video &&
                ctx &&
                canvas &&
                video.readyState === 4 &&
                overlayImage.current?.complete
            ) {
                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(video, 0, 0, width, height);
                ctx.drawImage(overlayImage.current, 0, 0, width, height);
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [width, height]);

    return (
        <div style={{ position: 'relative', width, height }}>
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: 'user', width, height }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width,
                    height,
                    opacity: 0.01,
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />
            <canvas
                ref={canvasRef}
                style={{ width, height }}
            />
        </div>
    );
}
