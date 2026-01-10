"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// Trigger TS re-check
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { getCroppedImg } from "@/utils/canvasUtils";
import { Loader2, RotateCcw, ZoomIn } from "lucide-react";
import { toast } from "sonner";

interface ImageEditorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    imageUrl: string;
    onSave: (blob: Blob) => Promise<void>;
}

export function ImageEditorDialog({ open, onOpenChange, imageUrl, onSave }: ImageEditorDialogProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [aspect, setAspect] = useState<number | undefined>(16 / 9);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!croppedAreaPixels) return;
        setIsSaving(true);
        try {
            const blob = await getCroppedImg(imageUrl, croppedAreaPixels, rotation);
            if (blob) {
                await onSave(blob);
                onOpenChange(false);
                // Reset state
                setZoom(1);
                setRotation(0);
                setAspect(16 / 9);
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to process image");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Edit Thumbnail</DialogTitle>
                </DialogHeader>

                <div className="relative flex-1 bg-black w-full min-h-0">
                    <Cropper
                        image={imageUrl}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                    />
                </div>

                <div className="p-4 bg-background border-t space-y-4">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between">
                                <Label>Zoom</Label>
                                <span className="text-xs text-muted-foreground">{zoom.toFixed(1)}x</span>
                            </div>
                            <Slider
                                value={[zoom]}
                                min={1}
                                max={3}
                                step={0.1}
                                onValueChange={(v) => setZoom(v[0])}
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between">
                                <Label>Rotation</Label>
                                <span className="text-xs text-muted-foreground">{rotation}°</span>
                            </div>
                            <Slider
                                value={[rotation]}
                                min={0}
                                max={360}
                                step={1}
                                onValueChange={(v) => setRotation(v[0])}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        <span className="text-sm font-medium mr-2">Ratio:</span>
                        <Button variant={aspect === 16 / 9 ? "default" : "outline"} size="sm" onClick={() => setAspect(16 / 9)}>16:9</Button>
                        <Button variant={aspect === 4 / 3 ? "default" : "outline"} size="sm" onClick={() => setAspect(4 / 3)}>4:3</Button>
                        <Button variant={aspect === 1 ? "default" : "outline"} size="sm" onClick={() => setAspect(1)}>1:1</Button>
                        <Button variant={aspect === undefined ? "default" : "outline"} size="sm" onClick={() => setAspect(undefined)}>Free</Button>
                    </div>

                    <DialogFooter className="flex-row justify-end gap-2">
                        <Button variant="ghost" onClick={() => { setZoom(1); setRotation(0); setCrop({ x: 0, y: 0 }) }}>
                            <RotateCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                            Save Copy
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
