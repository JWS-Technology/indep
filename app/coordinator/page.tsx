export default function coordinatorDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-4xl font-black text-gray-800">coordinator Dashboard</h1>

            <p className="text-gray-600 mt-4 text-lg">
                Welcome to the coordinator control panel.  
                Use the sidebar to navigate between tools and actions.
            </p>

            {/* Example dashboard cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
                
                <div className="p-6 rounded-3xl bg-white shadow-sm border border-gray-100 hover:shadow-lg transition">
                    <h2 className="text-xl font-bold text-gray-700">Total Students</h2>
                    <p className="text-3xl font-black mt-4 text-blue-600">–––</p>
                </div>

                <div className="p-6 rounded-3xl bg-white shadow-sm border border-gray-100 hover:shadow-lg transition">
                    <h2 className="text-xl font-bold text-gray-700">Pending Registrations</h2>
                    <p className="text-3xl font-black mt-4 text-red-600">–––</p>
                </div>

                <div className="p-6 rounded-3xl bg-white shadow-sm border border-gray-100 hover:shadow-lg transition">
                    <h2 className="text-xl font-bold text-gray-700">Events Assigned</h2>
                    <p className="text-3xl font-black mt-4 text-green-600">–––</p>
                </div>

            </div>
        </div>
    );
}
