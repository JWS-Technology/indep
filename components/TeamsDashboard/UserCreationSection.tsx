"use client";

import UserCard from "./UserCard";

export default function UserCreationSection({
    teamData,
    refresh,
}: {
    teamData: any;
    refresh: () => void;
}) {
    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <UserCard
                role="faculty"
                isCreated={teamData.membersCreated.faculty}
                teamName={teamData.teamName}
                onSuccess={refresh}
            />

            <UserCard
                role="student"
                isCreated={teamData.membersCreated.student}
                teamName={teamData.teamName}
                onSuccess={refresh}
            />
        </div>
    );
}
