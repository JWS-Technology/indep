"use client";
import { MouseEventHandler, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, CheckSquare, ClipboardList, LogOut } from "lucide-react";

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const activeBg = "bg-teal-500";
  const activeText = "text-white";
  const defaultText = "text-gray-700";
  const hoverBg = "hover:bg-cyan-100";

  const linkClass = (href: string) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors duration-150 ${pathname === href ? `${activeBg} ${activeText} shadow-md` : `${defaultText} ${hoverBg}`
    }`;

  const buttonData = [
    { href: "/event-managers", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/event-managers/attendance/on-stage", icon: CheckSquare, label: "Mark Attendance" },
    { href: "/event-managers/attendance-record", icon: ClipboardList, label: "Attendance Record" }
  ];

  const renderNavLinks = (closeMenu: MouseEventHandler<HTMLAnchorElement> | undefined) => (
    <nav className="space-y-2 flex-grow">
      {buttonData.map((item) => (
        <Link key={item.href} href={item.href} className={linkClass(item.href)} onClick={closeMenu}>
          <item.icon size={20} />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  const LogoutButton = () => (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-3 mt-8 px-4 py-3 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition"
    >
      <LogOut size={20} />
      Logout
    </button>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-white shadow-lg p-4 flex justify-between items-center sticky top-0 z-40">
        <h2 className="text-xl font-extrabold text-teal-600">Event Manager</h2>
        <button onClick={() => setOpen(true)} className="text-gray-600 hover:text-teal-600">
          <Menu size={26} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl p-5 flex flex-col transition-transform duration-300 lg:hidden z-50 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-teal-600">Menu</h2>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-teal-600">
            <X size={26} />
          </button>
        </div>

        {renderNavLinks(() => setOpen(false))}
        <LogoutButton />
      </div>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white shadow-2xl p-6">
        <h1 className="text-2xl font-extrabold text-teal-600 mb-10 border-b border-gray-200 pb-3">
          Event Manager
        </h1>

        {renderNavLinks(undefined)}

        <div className="mt-auto pt-6 border-t border-gray-200">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
