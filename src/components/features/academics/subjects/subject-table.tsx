import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SubjectItem } from '@/lib/mock-data-subjects';
import { SubjectDetails } from './subject-details';

interface SubjectTableProps {
    data: SubjectItem[];
}

export function SubjectTable({ data }: SubjectTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[250px]">
                            Subject Name
                        </TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Applicable Grades</TableHead>
                        <TableHead>Teachers</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((subject) => (
                        <TableRow key={subject.id}>
                            <TableCell className="font-semibold">
                                {subject.name}
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="text-xs">
                                    {subject.code}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">
                                    {subject.grades.length === 1
                                        ? subject.grades[0]
                                        : `${subject.grades[0]} - ${subject.grades[subject.grades.length - 1]}`}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center -space-x-2">
                                    {subject.teachers
                                        .slice(0, 3)
                                        .map((teacher, index) => (
                                            <Avatar
                                                key={index}
                                                className="h-8 w-8 border-2 border-background"
                                                title={teacher.name}
                                            >
                                                <AvatarFallback className="text-xs">
                                                    {teacher.initials}
                                                </AvatarFallback>
                                            </Avatar>
                                        ))}
                                    {subject.teachers.length > 3 && (
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                                            +{subject.teachers.length - 3}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <SubjectDetails
                                    subject={subject}
                                    variant="icon"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
