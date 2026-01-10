"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Settings2 } from "lucide-react";
import { useZipSettings, QualityFilter } from "@/context/ZipSettingsContext";
import React from "react";

export function ZipSettingsDialog() {
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

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="Zip Settings">
                    <Settings2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Download Settings</DialogTitle>
                    <DialogDescription>
                        Configure how your ZIP archives are generated.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">

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
                        <p className="text-xs text-muted-foreground">
                            {filenamePattern === 'default' && "Creates folders for each video."}
                            {filenamePattern === 'flat-title' && "All files in one folder, named by title."}
                            {filenamePattern === 'flat-id' && "All files in one folder, named by ID."}
                        </p>
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
                                <SelectItem value="nested">Group by Video (Nested Folders)</SelectItem>
                                <SelectItem value="flat">Flat List (All files in root)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            "Flat List" puts all images directly in the zip root (useful with Flat Title/ID).
                        </p>
                    </div>

                    {/* Quality Filter */}
                    <div className="grid gap-2">
                        <Label>Qualities to Include</Label>
                        <div className="grid grid-cols-2 gap-4">
                            {["maxres", "high", "medium", "standard"].map((q) => (
                                <div key={q} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`q-${q}`}
                                        checked={qualityFilter.includes(q as any)}
                                        onCheckedChange={(checked) => handleQualityChange(q as any, checked)}
                                    />
                                    <Label htmlFor={`q-${q}`} className="capitalize cursor-pointer">{q}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button variant="ghost" onClick={resetSettings} className="mr-auto text-muted-foreground">
                        Reset Defaults
                    </Button>
                    <Button type="submit" onClick={(e) => (e.target as HTMLElement).closest('dialog')?.close()}>Done</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
