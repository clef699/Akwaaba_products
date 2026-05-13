import Link from "next/link";

export interface User {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  joined: string;
  status: "Active" | "Suspended";
}

interface UsersTableProps {
  users?: User[];
}

const roleStyles = {
  CUSTOMER: "border border-(--primary) text-(--primary) bg-white",
  VENDOR: "bg-(--primary) text-white",
  ADMIN: "bg-gray-900 text-white",
};

const statusStyles = {
  Active: "text-(--primary)",
  Suspended: "text-gray-400",
};

export default function UsersTable({
  users = [
    {
      id: "1",
      initials: "AA",
      name: "Ama Asante",
      email: "ama.a@example.com",
      role: "CUSTOMER",
      joined: "Mar 12, 2024",
      status: "Active",
    },
    {
      id: "2",
      initials: "KB",
      name: "Kwame Boateng",
      email: "kwame@techhub.gh",
      role: "VENDOR",
      joined: "Jan 04, 2023",
      status: "Active",
    },
    {
      id: "3",
      initials: "SM",
      name: "Sarah Mwangi",
      email: "sarah@admin.akwaaba.com",
      role: "ADMIN",
      joined: "Aug 22, 2022",
      status: "Active",
    },
    {
      id: "4",
      initials: "NO",
      name: "Naomi Osei",
      email: "naomi.o@example.com",
      role: "CUSTOMER",
      joined: "Feb 18, 2025",
      status: "Active",
    },
    {
      id: "5",
      initials: "YO",
      name: "Yaw Owusu",
      email: "yaw@adinkracrafts.com",
      role: "VENDOR",
      joined: "May 30, 2024",
      status: "Active",
    },
    {
      id: "6",
      initials: "EA",
      name: "Esi Amankwah",
      email: "esi.a@example.com",
      role: "CUSTOMER",
      joined: "Sep 09, 2024",
      status: "Suspended",
    },
    {
      id: "7",
      initials: "KT",
      name: "Kojo Tawiah",
      email: "kojo@accrahides.com",
      role: "VENDOR",
      joined: "Nov 14, 2024",
      status: "Active",
    },
  ],
}: UsersTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                User
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Role
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Joined
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-(--primary) rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.initials}
                    </div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-600">{user.email}</td>
                <td className="py-4 px-6">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${roleStyles[user.role]}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600">{user.joined}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        user.status === "Active" ? "bg-(--primary)" : "bg-gray-400"
                      }`}
                    />
                    <span className={`text-sm font-semibold ${statusStyles[user.status]}`}>
                      {user.status}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <Link href="#" className="text-(--primary) font-medium hover:underline">
                      Edit
                    </Link>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-(--primary) transition font-medium"
                    >
                      {user.status === "Active" ? "Suspend" : "Activate"}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
