"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    UserPlus,
    Filter,
    Download,
    Trash2,
    Edit,
    ChevronDown,
    FileText,
    FileSpreadsheet
} from "lucide-react";
import Image from "next/image";
import { jsPDF } from "jspdf";

export default function AllUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [allDepartments, setAllDepartments] = useState<string[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/users", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (res.status === 401) {
                    router.push("/login");
                    return;
                }

                const data = await res.json();
                if (data.role !== "admin") {
                    router.push("/unauthorized");
                    return;
                }

                setUsers(data.users);
                
                // Extract unique departments
                const departments = [...new Set(data.users.map((u: any) => u.department))].filter(Boolean);
                setAllDepartments(departments as string[]);
                setSelectedDepartments(departments as string[]); // Select all by default
            } catch (error) {
                console.error("Failed to load users", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [router]);

    // Filtering
    const filteredUsers = users.filter((u: any) => {
        const search = filter.toLowerCase();

        const matchesSearch =
            u.name.toLowerCase().includes(search) ||
            u.collegeId.toLowerCase().includes(search) ||
            u.department.toLowerCase().includes(search);

        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        const matchesDepartment = selectedDepartments.length === 0 || 
                                 selectedDepartments.includes(u.department);

        return matchesSearch && matchesRole && matchesDepartment;
    });

    // Toggle department selection
    const toggleDepartment = (department: string) => {
        setSelectedDepartments(prev =>
            prev.includes(department)
                ? prev.filter(d => d !== department)
                : [...prev, department]
        );
    };

    // Select all/none departments
    const selectAllDepartments = () => {
        setSelectedDepartments(allDepartments);
    };

    const clearAllDepartments = () => {
        setSelectedDepartments([]);
    };

    // Enhanced PDF Export - Fixed watermark and page issues
    const handleExportPDF = (usersToExport: any[]) => {
        if (!usersToExport.length) {
            alert("No users to export");
            return;
        }

        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Column widths optimized for A4
        const columnWidths = [12, 45, 30, 22, 40, 41]; // Total: 190mm
        const tableHeaders = ["S.No", "Name", "College ID", "Role", "Department", "Email"];
        
        // Function to add watermark - FIXED
        const addWatermark = () => {
            try {
                // Save current state
                const originalTextColor = doc.getTextColor();
                const originalFont = doc.getFont();
                const originalFontSize = doc.getFontSize();
                
                // Set watermark properties
                doc.setTextColor(200, 200, 200); // Light gray
                doc.setFont("helvetica", "bold");
                doc.setFontSize(50);
                
                // Get center position
                const centerX = pageWidth / 2;
                const centerY = pageHeight / 2;
                
                // Apply rotation and transparency
                doc.saveGraphicsState();
                doc.setGState(doc.GState({ opacity: 0.1 })); // 10% opacity
                
                // Draw rotated watermark
                doc.text("SJC-INDEP-2025", centerX, centerY, {
                    align: 'center',
                    angle: 45
                });
                
                // Restore graphics state
                doc.restoreGraphicsState();
                
                // Restore original settings
                doc.setTextColor(originalTextColor);
                doc.setFont(originalFont.fontName, originalFont.fontStyle);
                doc.setFontSize(originalFontSize);
            } catch (error) {
                console.log("Watermark error:", error);
            }
        };

        // Function to add header
        const addHeader = (yPos: number) => {
            // Header background
            doc.setFillColor(30, 58, 138); // Dark blue
            doc.rect(0, yPos, pageWidth, 25, 'F');
            
            // Title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text("SJC-INDEP-2025", pageWidth / 2, yPos + 13, { align: "center" });
            
            // Subtitle
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("User Management Report", pageWidth / 2, yPos + 19, { align: "center" });
            
            // Reset
            doc.setTextColor(0, 0, 0);
            return yPos + 30;
        };

        // Function to add report info
        const addReportInfo = (yPos: number) => {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
            const timeStr = now.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            
            // Report details box
            doc.setDrawColor(203, 213, 225);
            doc.setFillColor(248, 250, 252);
            doc.rect(10, yPos, pageWidth - 20, 30, 'F');
            doc.rect(10, yPos, pageWidth - 20, 30);
            
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105);
            
            // Left column
            doc.text("Generated:", 15, yPos + 8);
            doc.text("Departments:", 15, yPos + 15);
            doc.text("Role Filter:", 15, yPos + 22);
            doc.text("Records:", 15, yPos + 29);
            
            // Right column - values
            const filterText = selectedDepartments.length === allDepartments.length 
                ? 'All Departments' 
                : `${selectedDepartments.length} Department(s)`;
            
            doc.setTextColor(30, 41, 59);
            doc.setFont("helvetica", "bold");
            doc.text(`${dateStr} ${timeStr}`, 50, yPos + 8);
            doc.text(filterText, 50, yPos + 15);
            doc.text(roleFilter === 'all' ? 'All Roles' : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1), 50, yPos + 22);
            doc.text(usersToExport.length.toString(), 50, yPos + 29);
            
            doc.setFont("helvetica", "normal");
            
            return yPos + 40;
        };

        // Function to draw table header
        const drawTableHeader = (yPos: number) => {
            // Draw header background
            doc.setFillColor(30, 58, 138);
            doc.rect(10, yPos, pageWidth - 20, 8, 'F');
            
            // Draw header text
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            
            let xPos = 10;
            tableHeaders.forEach((header, index) => {
                doc.text(header, xPos + 2, yPos + 5);
                xPos += columnWidths[index];
            });
            
            doc.setTextColor(0, 0, 0);
            return yPos + 8;
        };

        // Function to draw table rows
        const drawTableRows = (startY: number) => {
            let yPos = startY;
            const rowHeight = 7;
            
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            
            // Prepare table data
            const tableData = usersToExport.map((user, index) => [
                (index + 1).toString(),
                user.name,
                user.collegeId,
                user.role.charAt(0).toUpperCase() + user.role.slice(1),
                user.department,
                user.email || "N/A"
            ]);
            
            for (let i = 0; i < tableData.length; i++) {
                const row = tableData[i];
                
                // Check if we need a new page
                if (yPos + rowHeight > pageHeight - 20) {
                    doc.addPage();
                    
                    // Add watermark to new page
                    addWatermark();
                    
                    // Add header to new page (smaller)
                    yPos = 10;
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "bold");
                    doc.text("SJC-INDEP-2025 - Continued", pageWidth / 2, yPos, { align: "center" });
                    yPos += 10;
                    
                    // Redraw table header
                    yPos = drawTableHeader(yPos);
                }
                
                // Alternate row colors
                if (i % 2 === 0) {
                    doc.setFillColor(250, 250, 250);
                } else {
                    doc.setFillColor(255, 255, 255);
                }
                
                // Draw row background
                doc.rect(10, yPos, pageWidth - 20, rowHeight, 'F');
                
                // Draw cell content
                let xPos = 10;
                row.forEach((cell, cellIndex) => {
                    // Draw cell border
                    doc.setDrawColor(226, 232, 240);
                    doc.rect(xPos, yPos, columnWidths[cellIndex], rowHeight);
                    
                    // Draw text with word wrap
                    const text = doc.splitTextToSize(cell.toString(), columnWidths[cellIndex] - 3);
                    doc.text(text[0], xPos + 1.5, yPos + 4.5);
                    
                    xPos += columnWidths[cellIndex];
                });
                
                yPos += rowHeight;
            }
            
            return yPos;
        };

        // Function to add footer
        const addFooter = (pageNum: number, totalPages: number) => {
            doc.setFontSize(7);
            doc.setTextColor(100, 100, 100);
            doc.setFont("helvetica", "normal");
            
            // Footer text
            const footerText = `Page ${pageNum} of ${totalPages} | Generated by SJC-INDEP-2025 User Management System`;
            doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });
        };

        // Build the PDF
        try {
            let currentY = 10;
            
            // Add watermark to first page
            addWatermark();
            
            // Add header
            currentY = addHeader(currentY);
            
            // Add report info
            currentY = addReportInfo(currentY);
            
            // Draw table header
            currentY = drawTableHeader(currentY);
            
            // Draw table rows
            drawTableRows(currentY);
            
            // Add footer to all pages
            const totalPages = doc.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                
                // Add watermark to each page
                addWatermark();
                
                // Add footer
                addFooter(i, totalPages);
            }
            
            // Generate filename
            const timestamp = new Date().toISOString().split('T')[0];
            const deptText = selectedDepartments.length === allDepartments.length 
                ? 'all-departments' 
                : selectedDepartments.slice(0, 3).map(d => 
                    d.replace(/\s+/g, '-').substring(0, 10)
                ).join('-');
            
            // Save PDF
            doc.save(`SJC-INDEP-2025_Users_${deptText}_${timestamp}.pdf`);
            
        } catch (error) {
            console.error("PDF generation error:", error);
            alert("Error generating PDF. Please try again.");
        }
    };

    // Enhanced CSV export
    const handleExportCSV = (usersToExport: any[]) => {
        if (!usersToExport.length) {
            alert("No users to export");
            return;
        }

        const headers = ["S.No", "Name", "College ID", "Role", "Department", "Email"];
        
        const csvRows = usersToExport.map((u: any, index) => {
            return [
                index + 1,
                u.name.replace(/"/g, '""'),
                u.collegeId,
                u.role,
                u.department,
                u.email || ""
            ].map(cell => `"${cell}"`).join(",");
        });

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN');
        const timeStr = now.toLocaleTimeString('en-IN', { hour12: true });
        
        const csvContent = [
            "SJC-INDEP-2025 User Export",
            `Generated: ${dateStr} ${timeStr}`,
            `Departments: ${selectedDepartments.length === allDepartments.length ? 'All Departments' : selectedDepartments.join(', ')}`,
            `Role Filter: ${roleFilter === 'all' ? 'All Roles' : roleFilter}`,
            `Total Records: ${usersToExport.length}`,
            "",
            headers.join(","),
            ...csvRows
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const timestamp = new Date().toISOString().split('T')[0];
        const deptText = selectedDepartments.length === allDepartments.length ? 'all' : selectedDepartments.slice(0, 3).join('_');
        link.download = `SJC-INDEP-2025_Users_${deptText}_${timestamp}.csv`;
        link.click();
    };

    // Export all filtered users
    const handleExportAll = (format: 'csv' | 'pdf') => {
        if (format === 'csv') {
            handleExportCSV(filteredUsers);
        } else {
            handleExportPDF(filteredUsers);
        }
    };

    // Export selected departments only
    const handleExportSelectedDepts = (format: 'csv' | 'pdf') => {
        const deptUsers = users.filter((u: any) => selectedDepartments.includes(u.department));
        if (format === 'csv') {
            handleExportCSV(deptUsers);
        } else {
            handleExportPDF(deptUsers);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500 text-sm">View, edit, and manage all registered accounts.</p>
                </div>

                <div className="flex gap-3">
                    {/* Export Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-medium shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Export
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {showExportMenu && (
                            <>
                                {/* Backdrop */}
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setShowExportMenu(false)}
                                />
                                
                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-slate-200 shadow-lg z-50">
                                    <div className="p-4">
                                        <h3 className="text-sm font-semibold text-slate-900 mb-3">Export Options</h3>
                                        
                                        {/* Department Selection */}
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-xs font-medium text-slate-700">Select Departments:</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={selectAllDepartments}
                                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        Select All
                                                    </button>
                                                    <button
                                                        onClick={clearAllDepartments}
                                                        className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                                                    >
                                                        Clear All
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50">
                                                {allDepartments.map(dept => (
                                                    <label key={dept} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedDepartments.includes(dept)}
                                                            onChange={() => toggleDepartment(dept)}
                                                            className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                                                        />
                                                        <span className="text-sm text-slate-700">{dept}</span>
                                                        <span className="text-xs text-slate-500 ml-auto">
                                                            ({users.filter((u: any) => u.department === dept).length})
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Export Buttons */}
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        handleExportSelectedDepts('pdf');
                                                        setShowExportMenu(false);
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Export Selected as PDF
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleExportSelectedDepts('csv');
                                                        setShowExportMenu(false);
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 text-sm font-medium"
                                                >
                                                    <FileSpreadsheet className="w-4 h-4" />
                                                    Export Selected as CSV
                                                </button>
                                            </div>
                                            
                                            <p className="text-xs text-slate-500 text-center mt-2">
                                                Selected: {selectedDepartments.length} of {allDepartments.length} departments
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    
                    {/* Add User */}
                    <button
                        onClick={() => router.push("/admin/create-user")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium shadow-sm"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Department Filter Chips */}
            {selectedDepartments.length > 0 && selectedDepartments.length < allDepartments.length && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Filter className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Filtered by Departments:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {selectedDepartments.map(dept => (
                            <span key={dept} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-200 rounded-full text-sm text-blue-700">
                                {dept}
                                <button
                                    onClick={() => toggleDepartment(dept)}
                                    className="text-blue-500 hover:text-blue-700 ml-1"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Search + Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or department..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <select
                            className="bg-transparent text-sm text-slate-700 focus:outline-none"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            <option value="student">Students</option>
                            <option value="faculty">Faculty</option>
                            <option value="admin">Admins</option>
                            <option value="judge">Judges</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-500">Total Users</p>
                    <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-500">Filtered Users</p>
                    <p className="text-2xl font-bold text-blue-600">{filteredUsers.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-500">Selected Departments</p>
                    <p className="text-2xl font-bold text-red-600">{selectedDepartments.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-500">Export Ready</p>
                    <p className="text-2xl font-bold text-emerald-600">{filteredUsers.length}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">User Profile</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">College ID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u: any) => (
                                    <tr key={u._id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                                    <Image
                                                        src={`https://sjctni.edu/images/SPhotos/${u.collegeId.substring(0, 2)}/${u.collegeId.toLowerCase()}.jpg`}
                                                        alt={u.name}
                                                        fill
                                                        className="object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`;
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{u.name}</p>
                                                    <p className="text-xs text-slate-500">{u.email || "No email"}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium capitalize">
                                                {u.role}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm">{u.department}</td>

                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                {u.collegeId}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1 text-xs text-emerald-600">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                Active
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 hover:opacity-100 transition">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No users found with current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
                    <p className="text-sm text-slate-600">
                        Showing {filteredUsers.length} users from {selectedDepartments.length} departments
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleExportAll('csv')}
                            className="text-xs px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-600"
                        >
                            Export All as CSV
                        </button>
                        <button
                            onClick={() => handleExportAll('pdf')}
                            className="text-xs px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Export All as PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}