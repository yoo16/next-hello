'use client';

import { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';

export default function MaskFaceAPI() {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const maskImg = useRef<HTMLImageElement | null>(null);
    const lastMask = useRef({ x: 0, y: 0, width: 0, height: 0, valid: false, lostFrames: 0 });

    useEffect(() => {
        const load = async () => {
            const MODEL_URL = '/models';
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            ]);

            const img = new Image();
            img.src = '/mask1.png';
            img.onload = () => {
                maskImg.current = img;
                startDetection();
            };
        };
        load();
    }, []);

    const startDetection = () => {
        const detect = async () => {
            const video = webcamRef.current?.video as HTMLVideoElement;
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');

            if (!canvas || !video || !ctx || !maskImg.current || video.readyState !== 4) {
                requestAnimationFrame(detect);
                return;
            }

            const result = await faceapi
                .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 512 }))
                .withFaceLandmarks();

            const width = video.videoWidth;
            const height = video.videoHeight;
            canvas.width = width;
            canvas.height = height;

            // ctx.clearRect(0, 0, width, height);

            if (result && maskImg.current.complete) {

                const resized = faceapi.resizeResults(result, { width, height });

                const landmarks = resized.landmarks;
                const leftEye = landmarks.getLeftEye();
                const rightEye = landmarks.getRightEye();
                const jaw = landmarks.getJawOutline();

                const centerX = (leftEye[0].x + rightEye[3].x) / 2;
                const centerY = (leftEye[0].y + jaw[8].y) / 2;
                const faceWidth = Math.abs(rightEye[3].x - leftEye[0].x) * 2.2;
                const faceHeight = Math.abs(jaw[8].y - leftEye[0].y) * 2.5;

                lastMask.current = {
                    x: centerX - faceWidth / 2,
                    y: centerY - faceHeight / 2,
                    width: faceWidth,
                    height: faceHeight,
                    valid: true,
                    lostFrames: 0,
                };
            }

            if (lastMask.current && maskImg.current.complete) {
                const { x, y, width, height } = lastMask.current;
                console.log(`Drawing mask at: x=${x}, y=${y}, width=${width}, height=${height}`);
                ctx.drawImage(maskImg.current, x, y, width, height);
            }

            requestAnimationFrame(detect);
        };

        detect();
    };

    return (
        <div style={{ position: 'relative', width: 640, height: 480 }}>
            {/* 背景としてWebCamを表示（描画しない） */}
            <Webcam
                ref={webcamRef}
                audio={false}
                videoConstraints={{ facingMode: 'user', width: 640, height: 480 }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 640,
                    height: 480,
                    zIndex: 0,
                }}
            />
            {/* マスクだけを描画するCanvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 640,
                    height: 480,
                    zIndex: 10,
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}
