import prisma from "@/lib/prisma";
import JobCard from "@/components/job/JobCard";
import { auth } from "@/auth";
import CreateJobDialog from "@/components/job/CreateJobDialog";
import { Briefcase, Plus } from "lucide-react";

export default async function JobsPage() {

    const session = await auth();

    if (!session?.user?.id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
                <p>Unauthorized access.</p>
            </div>
        );
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
        <div className="min-h-screen bg-zinc-950 px-6 py-12">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/50 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-indigo-500" />
                            Job Postings
                        </h1>
                        <p className="text-zinc-400 mt-2">
                            Manage your open positions and track hiring progress.
                        </p>
                    </div>
                    <CreateJobDialog />
                </div>

                {/* Empty State */}
                {jobs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-xl font-medium text-white">No jobs posted yet</h3>
                        <p className="text-zinc-500 mt-2 max-w-sm text-center">
                            Get started by creating your first job posting to hire candidates.
                        </p>
                    </div>
                )}

                {/* Job Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
                
            </div>
        </div>
    );
}