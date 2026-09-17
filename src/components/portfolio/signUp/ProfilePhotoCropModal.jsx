import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ZoomIn, ZoomOut, X, Move } from "lucide-react";

/**
 * Generates a cropped File from an image, crop area (in source space), rotation angle, and mime type.
 */
async function getCroppedImg(
  imageSrc,
  cropArea,
  rotation = 0,
  mimeType = "image/jpeg",
  fileName = "cropped_photo.jpg"
) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = imageSrc;
  });

  // Step 1: Render rotated image onto offscreen canvas
  const rotCanvas = document.createElement("canvas");
  const rotCtx = rotCanvas.getContext("2d");

  if (!rotCtx) return null;

  const rad = (rotation * Math.PI) / 180;
  const is90or270 = (rotation / 90) % 2 !== 0;

  const rotWidth = is90or270 ? image.height : image.width;
  const rotHeight = is90or270 ? image.width : image.height;

  rotCanvas.width = rotWidth;
  rotCanvas.height = rotHeight;

  rotCtx.translate(rotWidth / 2, rotHeight / 2);
  rotCtx.rotate(rad);
  rotCtx.drawImage(image, -image.width / 2, -image.height / 2);

  // Step 2: Crop from rotated canvas to final 512x512 output canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const targetSize = 512;
  canvas.width = targetSize;
  canvas.height = targetSize;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const { x, y, width, height } = cropArea;

  ctx.drawImage(
    rotCanvas,
    Math.max(0, x),
    Math.max(0, y),
    Math.min(rotWidth, width),
    Math.min(rotHeight, height),
    0,
    0,
    targetSize,
    targetSize
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        const croppedFile = new File([blob], fileName, {
          type: blob.type || mimeType,
        });
        resolve(croppedFile);
      },
      mimeType,
      0.92
    );
  });
}

export function ProfilePhotoCropModal({
  file,
  isOpen,
  onClose,
  onCropComplete,
  defaultShape = "circle", // "circle" | "square"
}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [shape, setShape] = useState(defaultShape); // "circle" | "square"
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    setShape(defaultShape);
  }, [defaultShape, isOpen]);

  useEffect(() => {
    if (!file) {
      setImageSrc(null);
      return undefined;
    }

    if (typeof file === "string") {
      setImageSrc(file);
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !imageSrc || typeof document === "undefined") {
    return null;
  }

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.002;
    setZoom((prev) => Math.min(Math.max(1, prev + delta), 2));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleCropSave = async () => {
    if (!imageRef.current || !containerRef.current) return;
    try {
      setIsProcessing(true);

      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();

      const img = imageRef.current;
      const is90or270 = (rotation / 90) % 2 !== 0;
      const naturalRotWidth = is90or270 ? img.naturalHeight : img.naturalWidth;
      const naturalRotHeight = is90or270 ? img.naturalWidth : img.naturalHeight;

      // Calculate exact scale between rendered screen rectangle and natural dimensions
      const scaleX = naturalRotWidth / Math.max(1, imageRect.width);
      const scaleY = naturalRotHeight / Math.max(1, imageRect.height);

      // Viewport bounds in DOM image relative space
      const cropXInDOM = containerRect.left - imageRect.left;
      const cropYInDOM = containerRect.top - imageRect.top;
      const cropWidthInDOM = containerRect.width;
      const cropHeightInDOM = containerRect.height;

      // Crop area in natural coordinates
      const cropX = cropXInDOM * scaleX;
      const cropY = cropYInDOM * scaleY;
      const cropWidth = cropWidthInDOM * scaleX;
      const cropHeight = cropHeightInDOM * scaleY;

      const cropArea = {
        x: Math.max(0, cropX),
        y: Math.max(0, cropY),
        width: Math.min(naturalRotWidth, cropWidth),
        height: Math.min(naturalRotHeight, cropHeight),
      };

      const fileType = typeof file === "object" && file?.type ? file.type : "image/jpeg";
      const fileName = typeof file === "object" && file?.name ? file.name : "profile_photo.jpg";

      const croppedFile = await getCroppedImg(
        imageSrc,
        cropArea,
        rotation,
        fileType,
        fileName
      );

      if (croppedFile) {
        onCropComplete(croppedFile);
      }
    } catch (err) {
      console.error("Error cropping image:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="relative flex w-full max-w-lg flex-col rounded-2xl bg-white p-5 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Crop Image</h3>
            <p className="text-xs text-gray-500">Drag to position, slider to zoom</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>


        {/* Viewport Cropper Box */}
        <div className="my-4 flex flex-col items-center gap-2">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            onWheel={handleWheel}
            className="relative h-[280px] w-[280px] cursor-grab overflow-hidden rounded-2xl bg-gray-950 active:cursor-grabbing select-none"
          >
            <div className="flex h-full w-full items-center justify-center">
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                  
                  objectFit: "contain",
                }}
                className="pointer-events-none transition-transform duration-75 ease-out"
              />
            </div>

            {/* Visual Viewport Overlay Mask */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className={`h-full w-full border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] ${
                  shape === "circle" ? "rounded-full" : "rounded-2xl"
                }`}
              >
                {/* 3x3 Grid Overlay */}
                <div className="grid h-full w-full grid-cols-3 grid-rows-3 opacity-40">
                  <div className="border-b border-r border-white/50" />
                  <div className="border-b border-r border-white/50" />
                  <div className="border-b border-white/50" />
                  <div className="border-b border-r border-white/50" />
                  <div className="border-b border-r border-white/50" />
                  <div className="border-b border-white/50" />
                  <div className="border-r border-white/50" />
                  <div className="border-r border-white/50" />
                  <div />
                </div>
              </div>
            </div>
          </div>

          <p className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
            <Move className="h-3 w-3 text-[#0353a4]" />
            Drag image to adjust crop area
          </p>
        </div>

        {/* Zoom Slider */}
        <div className="mb-4 flex items-center gap-3 px-2">
          <ZoomOut className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="range"
            min="1"
            max="2"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#0353a4]"
          />
          <ZoomIn className="h-4 w-4 shrink-0 text-gray-400" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCropSave}
            disabled={isProcessing}
            className="rounded-xl btn-gradient px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isProcessing ? "Cropping..." : "Crop & Save"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
