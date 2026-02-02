import { Eye } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// DropdownMenu imports removed as they are unused
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ClassItem } from '@/lib/mock-data-classes';

interface ClassTableProps {
    data: ClassItem[];
}

export function ClassTable({ data }: ClassTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Class Name</TableHead>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span>{item.subject}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {item.medium}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback>
                                            {item.teacherName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">
                                        {item.teacherName}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col text-sm">
                                    <span>{item.schedule.day}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {item.schedule.time}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="font-semibold">
                                    LKR {item.fee.toLocaleString()}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        item.status === 'Active'
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {item.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="View Class Sheet"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">
                                                View Class Sheet
                                            </span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Class Sheet
                                            </DialogTitle>
                                            <DialogDescription>
                                                This feature is coming soon.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-6 text-center text-muted-foreground">
                                            Class details view is under
                                            construction.
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
