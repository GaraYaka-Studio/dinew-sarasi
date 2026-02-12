import { Badge } from '@/components/ui/badge';
import { SubjectItem } from '@/lib/mock-data-subjects';
import { SubjectDetails } from './subject-details';

interface SubjectListMobileProps {
    data: SubjectItem[];
}

export function SubjectListMobile({ data }: SubjectListMobileProps) {
    return (
        <div className="grid gap-4">
            {data.map((subject) => (
                <div
                    key={subject.id}
                    className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                >
                    {/* Left Side */}
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                        {/* Line 1: Subject Name */}
                        <h3 className="text-base leading-none font-semibold tracking-tight">
                            {subject.name}
                        </h3>

                        {/* Line 2: Code Badge */}
                        <div>
                            <Badge
                                variant="secondary"
                                className="text-xs font-normal"
                            >
                                {subject.code}
                            </Badge>
                        </div>

                        {/* Line 3: Grades & Teacher Count */}
                        <div className="flex flex-col gap-1 pt-1 text-sm text-muted-foreground">
                            <span>
                                Grades:{' '}
                                {subject.grades.length === 1
                                    ? subject.grades[0]
                                    : `${subject.grades[0]} - ${subject.grades[subject.grades.length - 1]}`}
                            </span>
                            <span>
                                {subject.teachers.length}{' '}
                                {subject.teachers.length === 1
                                    ? 'Teacher'
                                    : 'Teachers'}{' '}
                                Assigned
                            </span>
                        </div>
                    </div>

                    {/* Right Side: Eye Icon */}
                    <div className="flex-shrink-0">
                        <SubjectDetails subject={subject} variant="button" />
                    </div>
                </div>
            ))}
        </div>
    );
}
