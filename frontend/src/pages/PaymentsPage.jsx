import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function PaymentsPage() {

  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {

      const response = await api.get("/payments/my");

      setPayments(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalDebt = payments
    .filter((p) => p.status !== "PAID")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <DashboardLayout>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Payments
        </h1>

        <p className="text-gray-500">
          View dormitory payment history and debts
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-5">
        <p className="text-sm text-red-500">
          Current Debt
        </p>

        <h2 className="text-4xl font-bold text-red-600">
          ₸ {totalDebt}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100 text-left">
            <tr>

              <th className="p-4">
                Description
              </th>

              <th className="p-4">
                Amount
              </th>

              <th className="p-4">
                Due Date
              </th>

              <th className="p-4">
                Paid At
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {payments.map((payment) => (

              <tr
                key={payment.id}
                className="border-t hover:bg-gray-50 transition"
              >

                <td className="p-4">
                  {payment.description}
                </td>

                <td className="p-4 font-semibold">
                  ₸ {payment.amount}
                </td>

                <td className="p-4">
                  {payment.dueDate}
                </td>

                <td className="p-4">
                  {payment.paidAt || "-"}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      payment.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : payment.status === "OVERDUE"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>

                <td className="p-4">

                  {payment.status !== "PAID" ? (

                    <Link
                      to={`/student/payments/${payment.id}`}
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition"
                    >
                      Pay
                    </Link>

                  ) : (

                    <span className="text-green-600 font-semibold">
                      Completed
                    </span>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}