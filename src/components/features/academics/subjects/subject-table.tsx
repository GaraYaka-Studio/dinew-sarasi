import { useEffect, useState } from 'react';

import { getSubjectTeachers } from '@/lib/db/select';
import { getInitials } from '@/lib/utils';

import { Subject, Teacher } from '@/types/schema.types';

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
import { SubjectDetails } from './subject-details';

interface SubjectTableProps {
    subjects: Subject[];
}

export function SubjectTable({ subjects }: SubjectTableProps) {
    const [subject, setSubject] = useState<Subject>({
        id: String(),
        name: String(),
        grades: [],
        category: String(),
        code: String(),
        deleted_at: new Date(),
        is_active: Boolean(),
    });
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    useEffect(() => {
        getSubjectTeachers(subject).then(setTeachers);
    }, [subject]);

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
                    {subjects?.map((subject) => {
                        setSubject(subject);

                        return (
                            <TableRow key={subject.id}>
                                <TableCell className="font-semibold">
                                    {subject.name}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
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
                                        {teachers
                                            .slice(0, 3)
                                            .map((teacher, index) => (
                                                <Avatar
                                                    key={index}
                                                    className="h-8 w-8 border-2 border-background"
                                                    title={teacher.name}
                                                >
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(
                                                            teacher.name
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ))}
                                        {teachers.length > 3 && (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                                                +{teachers.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <SubjectDetails
                                        subject={subject}
                                        teachers={teachers}
                                        variant="icon"
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
