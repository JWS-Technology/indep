import UserTable from "@/components/admin/UserTable";

export default function FacultyPage() {
    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <UserTable role="faculty" />
        </div>
    );
}