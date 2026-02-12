import { Calendar, Users, MoreHorizontal, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClassItem } from '@/lib/mock-data-classes';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClassListMobileProps {
    data: ClassItem[];
    onViewClass: (classItem: ClassItem) => void;
}

export function ClassListMobile({ data, onViewClass }: ClassListMobileProps) {
    return (
        <div className="grid gap-4">
            {data.map((item) => (
                <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                >
                    {/* Line 1: Subject + Menu */}
                    <div className="flex items-start justify-between">
                        <h3 className="text-lg leading-none font-semibold tracking-tight">
                            {item.subject}
                        </h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="-mr-2 h-8 w-8 p-0"
                                >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    Edit Class (Coming Soon)
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    Archive Class
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Line 2: Medium Badge */}
                    <div>
                        <Badge
                            variant="outline"
                            className="text-xs font-normal"
                        >
                            {item.medium}
                        </Badge>
                    </div>

                    {/* Line 3: Teacher + Fee */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            {item.teacherName}
                        </span>
                        <span className="font-bold">
                            LKR {item.fee.toLocaleString()}
                        </span>
                    </div>

                    {/* Line 4: Schedule + Count */}
                    <div className="mt-1 flex items-center justify-between border-t pt-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                            <Calendar className="mr-1 h-3.5 w-3.5" />
                            <span>
                                {item.schedule.day} • {item.schedule.time}
                            </span>
                        </div>
                        <div className="flex items-center font-medium">
                            <Users className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                            <span>{item.studentCount}</span>
                        </div>
                    </div>

                    {/* Mobile Action View Button */}
                    <div className="flex justify-end pt-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-full text-xs"
                            onClick={() => onViewClass(item)}
                        >
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            View Class Sheet
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
