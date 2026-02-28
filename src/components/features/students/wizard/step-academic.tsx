'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Camera, Upload, User } from 'lucide-react';
import { calculateBatchYear } from '@/lib/utils';

interface StepAcademicProps {
    formData: {
        grade: string;
        batch: string;
        photoMode: 'webcam' | 'upload' | 'skip';
        photoData?: string;
    };
    onUpdate: (field: string, value: string) => void;
}

export function StepAcademic({ formData, onUpdate }: StepAcademicProps) {
    const [photoTab, setPhotoTab] = useState<'webcam' | 'upload'>('webcam');

    // Auto-update batch when grade changes
    useEffect(() => {
        if (formData.grade) {
            const batch = calculateBatchYear(formData.grade);
            onUpdate('batch', batch.display);
        }
    }, [formData.grade]);

    return (
        <div className="space-y-6">
            {/* Academic Information */}
            <div>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Academic Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="grade">Grade *</Label>
                        <Select
                            value={formData.grade}
                            onValueChange={(value) => onUpdate('grade', value)}
                        >
                            <SelectTrigger id="grade" className="h-11">
                                <SelectValue placeholder="Select grade..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Grade 1">Grade 1</SelectItem>
                                <SelectItem value="Grade 2">Grade 2</SelectItem>
                                <SelectItem value="Grade 3">Grade 3</SelectItem>
                                <SelectItem value="Grade 4">Grade 4</SelectItem>
                                <SelectItem value="Grade 5">Grade 5</SelectItem>
                                <SelectItem value="Grade 6">Grade 6</SelectItem>
                                <SelectItem value="Grade 7">Grade 7</SelectItem>
                                <SelectItem value="Grade 8">Grade 8</SelectItem>
                                <SelectItem value="Grade 9">Grade 9</SelectItem>
                                <SelectItem value="Grade 10">
                                    Grade 10
                                </SelectItem>
                                <SelectItem value="Grade 11">
                                    Grade 11
                                </SelectItem>
                                <SelectItem value="Grade 12">
                                    Grade 12
                                </SelectItem>
                                <SelectItem value="Grade 13">
                                    Grade 13
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="batch">Batch (Auto-calculated) *</Label>
                        <Input
                            id="batch"
                            value={formData.batch}
                            onChange={(e) => onUpdate('batch', e.target.value)}
                            className="h-11"
                            placeholder="Auto-calculated from grade"
                        />
                        <p className="text-xs text-muted-foreground">
                            Automatically calculated based on grade. Can be edited if needed.
                        </p>
                    </div>
                </div>
            </div>

            {/* Photo Upload */}
            <div>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Student Photo
                </h3>
                <Tabs
                    value={photoTab}
                    onValueChange={(v) => setPhotoTab(v as 'webcam' | 'upload')}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="webcam">
                            <Camera className="mr-2 h-4 w-4" />
                            Webcam
                        </TabsTrigger>
                        <TabsTrigger value="upload">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="webcam" className="mt-4">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <Camera className="h-12 w-12 text-muted-foreground/50" />
                                    <p className="text-sm text-muted-foreground">
                                        Webcam preview will appear here
                                    </p>
                                    <Button variant="outline" size="sm">
                                        <Camera className="mr-2 h-4 w-4" />
                                        Start Camera
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="upload" className="mt-4">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <Upload className="h-12 w-12 text-muted-foreground/50" />
                                    <p className="text-sm text-muted-foreground">
                                        Click to upload or drag and drop
                                    </p>
                                    <Button variant="outline" size="sm">
                                        Browse Files
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
