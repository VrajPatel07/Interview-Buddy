import prisma from "@/lib/prisma";
import JobCard from "@/components/job/JobCard";
import { auth } from "@/auth";
import CreateJobDialog from "@/components/job/CreateJobDialog";

export default async function JobsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        return <p>Unauthorized</p>;
    }

    const jobs = await prisma.job.findMany({
        where: {
            companyId: session.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div>

            <CreateJobDialog />

            {jobs.length === 0 && <p>No jobs found</p>}

            <div>
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
            
        </div>
    );
}
