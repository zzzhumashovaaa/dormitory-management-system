import DashboardLayout from "../layouts/DashboardLayout";
import { QRCodeSVG } from "qrcode.react";

export default function QRAccessPage() {
  const studentName =
    localStorage.getItem("fullName") || "Aizhan Zhumashova";

  const studentId =
    localStorage.getItem("studentId") || "ST-2026-001";

  const qrData = `DORM_ACCESS:${studentId}`;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">QR Access</h1>

        <p className="text-gray-500">
          Use your personal QR code to enter or exit the dormitory.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white p-8 rounded-3xl shadow">
          <h2 className="text-2xl font-bold mb-6">
            My Dormitory QR Code
          </h2>

          <div className="flex items-center gap-10">
            <div className="bg-gray-100 p-8 rounded-3xl flex items-center justify-center">
              <div className="bg-white p-6 rounded-2xl shadow">
                <QRCodeSVG
                  value={qrData}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">
                {studentName}
              </h3>

              <p className="text-gray-500 mb-1">
                Student ID: {studentId}
              </p>

              <p className="text-gray-500 mb-6">
                Access type: Entry / Exit
              </p>

              <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl mb-5">
                Show this QR code at the dormitory entrance.
                The system will automatically register your
                entry and exit time.
              </div>

              <div className="space-y-3">
                <div className="flex justify-between gap-10">
                  <span className="text-gray-500">
                    Dormitory closes:
                  </span>

                  <span className="font-bold">22:00</span>
                </div>

                <div className="flex justify-between gap-10">
                  <span className="text-gray-500">
                    QR Status:
                  </span>

                  <span className="font-bold text-green-600">
                    Active
                  </span>
                </div>

                <div className="flex justify-between gap-10">
                  <span className="text-gray-500">
                    Access level:
                  </span>

                  <span className="font-bold">
                    Student Access
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-7 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-4">
              Today’s Access
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">
                  Last entry
                </p>

                <h3 className="font-bold text-lg">
                  21:42
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Status
                </p>

                <h3 className="font-bold text-green-600">
                  On time
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Dormitory closes at
                </p>

                <h3 className="font-bold text-lg">
                  22:00
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-gray-950 text-white p-7 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-3">
              Access Rule
            </h2>

            <p className="text-gray-300 text-sm">
              Entry after 22:00 may be marked as a late
              entry and saved in the dormitory access history.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow mt-8">
        <h2 className="text-2xl font-bold mb-6">
          Access History
        </h2>

        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Action</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t">
                <td className="p-4">May 17, 2026</td>
                <td className="p-4">21:42</td>
                <td className="p-4">Entry</td>
                <td className="p-4 text-green-600 font-semibold">
                  On time
                </td>
              </tr>

              <tr className="border-t">
                <td className="p-4">May 16, 2026</td>
                <td className="p-4">22:31</td>
                <td className="p-4">Entry</td>
                <td className="p-4 text-red-600 font-semibold">
                  Late
                </td>
              </tr>

              <tr className="border-t">
                <td className="p-4">May 16, 2026</td>
                <td className="p-4">08:15</td>
                <td className="p-4">Exit</td>
                <td className="p-4 text-blue-600 font-semibold">
                  Recorded
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}