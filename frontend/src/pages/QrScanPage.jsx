import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function QrScanPage() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const scan = async () => {
      try {
        const studentId = searchParams.get("studentId");

        const response = await api.post("/access/scan", {
          studentId,
        });

        setResult(response.data);
      } catch (error) {
        console.log(error);

        setResult({
          error: true,
        });
      } finally {
        setLoading(false);
      }
    };

    scan();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Scanning QR...
      </div>
    );
  }

  if (result?.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-10 rounded-3xl">
          QR Scan Failed
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-3xl shadow max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-5">
          Access Registered
        </h1>

        <div className="space-y-3 text-left">
          <div>
            <span className="text-gray-500">
              Student:
            </span>

            <p className="font-bold">
              {result.studentName}
            </p>
          </div>

          <div>
            <span className="text-gray-500">
              Room:
            </span>

            <p className="font-bold">
              {result.roomNumber || "-"}
            </p>
          </div>

          <div>
            <span className="text-gray-500">
              Action:
            </span>

            <p className="font-bold text-blue-600">
              {result.action}
            </p>
          </div>

          <div>
            <span className="text-gray-500">
              Status:
            </span>

            <p className="font-bold text-green-600">
              {result.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}