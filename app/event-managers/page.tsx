export default function EventManagerDashboard() {
  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-600 mt-1 text-sm md:text-base">Welcome to Event Manager Panel</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-8">
        <div className="bg-white p-5 rounded-xl shadow-md border hover:shadow-lg transition">
          <h2 className="text-lg md:text-xl font-semibold text-blue-700">Total Events</h2>
          <p className="text-2xl md:text-3xl font-bold mt-3">12</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border hover:shadow-lg transition">
          <h2 className="text-lg md:text-xl font-semibold text-green-700">Attendance Marked</h2>
          <p className="text-2xl md:text-3xl font-bold mt-3">458</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border hover:shadow-lg transition">
          <h2 className="text-lg md:text-xl font-semibold text-purple-700">Active Managers</h2>
          <p className="text-2xl md:text-3xl font-bold mt-3">8</p>
        </div>
      </div>
    </div>
  );
}
