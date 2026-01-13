"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings2, RotateCcw } from "lucide-react";
import { useZipSettings } from "@/context/ZipSettingsContext";
import React, { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const qualityOptions = [
    { value: "maxres", label: "Max Res", desc: "1920×1080" },
    { value: "high", label: "High", desc: "640×480" },
    { value: "medium", label: "Medium", desc: "320×180" },
    { value: "standard", label: "Standard", desc: "120×90" },
] as const;

export function ZipSettingsDialog() {
    const [open, setOpen] = useState(false);
    const {
        filenamePattern,
        folderStructure,
        qualityFilter,
        updateSettings,
        resetSettings
    } = useZipSettings();

    const handleQualityChange = (quality: "maxres" | "high" | "medium" | "standard", checked: boolean | string) => {
        let newFilter = [...qualityFilter];
        if (checked === true) {
            if (!newFilter.includes(quality)) newFilter.push(quality);
        } else {
            newFilter = newFilter.filter(q => q !== quality);
        }
        updateSettings({ qualityFilter: newFilter });
    };

    const handleSaveAndClose = () => {
        toast.success("Settings saved");
        setOpen(false);
    };

    const handleReset = () => {
        resetSettings();
        toast.info("Settings reset");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none h-9 w-9 hover:bg-accent"
                    title="Export Settings"
                >
                    <Settings2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Export Settings</DialogTitle>
                    <DialogDescription>
                        Configure your ZIP archive options
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-5 py-4">
                    {/* Filename Pattern */}
                    <div className="grid gap-2">
                        <Label htmlFor="filename-pattern">Filename Pattern</Label>
                        <Select
                            value={filenamePattern}
                            onValueChange={(value: any) => updateSettings({ filenamePattern: value })}
                        >
                            <SelectTrigger id="filename-pattern">
                                <SelectValue placeholder="Select pattern" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">Default (video-id/quality.jpg)</SelectItem>
                                <SelectItem value="flat-title">Flat Title (Title - Quality.jpg)</SelectItem>
                                <SelectItem value="flat-id">Flat ID (VideoID - Quality.jpg)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Folder Structure */}
                    <div className="grid gap-2">
                        <Label htmlFor="folder-structure">Folder Structure</Label>
                        <Select
                            value={folderStructure}
                            onValueChange={(value: any) => updateSettings({ folderStructure: value })}
                        >
                            <SelectTrigger id="folder-structure">
                                <SelectValue placeholder="Select structure" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nested">Nested (Group by Video)</SelectItem>
                                <SelectItem value="flat">Flat (All in root)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Quality Filter */}
                    <div className="grid gap-3">
                        <Label>Qualities to Include</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {qualityOptions.map((option) => {
                                const isChecked = qualityFilter.includes(option.value);
                                return (
                                    <div
                                        key={option.value}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                                            isChecked
                                                ? "border-primary/50 bg-primary/5"
                                                : "border-border hover:bg-accent/50"
                                        )}
                                        onClick={() => handleQualityChange(option.value, !isChecked)}
                                    >
                                        <Checkbox
                                            id={`q-${option.value}`}
                                            checked={isChecked}
                                            onCheckedChange={(checked) => handleQualityChange(option.value, checked)}
                                            className="pointer-events-none"
                                        />
                                        <div>
                                            <Label
                                                htmlFor={`q-${option.value}`}
                                                className="cursor-pointer text-sm font-medium"
                                            >
                                                {option.label}
                                            </Label>
                                            <p className="text-xs text-muted-foreground">{option.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {qualityFilter.length === 0 && (
                            <p className="text-xs text-destructive">Select at least one quality</p>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="mr-auto"
                    >
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        Reset
                    </Button>
                    <Button
                        onClick={handleSaveAndClose}
                        size="sm"
                        disabled={qualityFilter.length === 0}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
