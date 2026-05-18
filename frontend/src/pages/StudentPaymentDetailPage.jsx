import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function StudentPaymentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [method, setMethod] = useState("KASPI");
  const [loading, setLoading] = useState(false);

  const fetchPayment = async () => {
    try {
      const response = await api.get(`/payments/${id}`);
      setPayment(response.data);
    } catch (error) {
      console.log("PAYMENT DETAIL ERROR:", error);
      alert("Failed to load payment");
    }
  };

  const payPayment = async () => {
    try {
      setLoading(true);

      await api.put(`/payments/${id}/pay`, {
        method,
      });

      alert("Payment completed successfully");
      navigate("/student/payments");
    } catch (error) {
      console.log("PAYMENT ERROR:", error);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayment();
  }, []);

  if (!payment) {
    return (
      <DashboardLayout>
        <div className="bg-white p-8 rounded-3xl shadow">
          Loading payment...
        </div>
      </DashboardLayout>
    );
  }

  const isPaid = payment.status === "PAID";

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Payment Details</h1>
        <p className="text-gray-500">
          Complete your dormitory payment
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white p-8 rounded-3xl shadow">
          <h2 className="text-2xl font-bold mb-6">
            {payment.description || "Dormitory Payment"}
          </h2>

          <div className="bg-gray-50 p-6 rounded-2xl mb-6">
            <p className="text-gray-500">Amount</p>
            <h3 className="text-4xl font-bold text-red-600">
              ₸ {Number(payment.amount || 0).toLocaleString()}
            </h3>

            <div className="grid grid-cols-2 gap-5 mt-6">
              <div>
                <p className="text-gray-500 text-sm">Due Date</p>
                <p className="font-bold">{payment.dueDate || "-"}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <p
                  className={`font-bold ${
                    isPaid ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {payment.status}
                </p>
              </div>
            </div>
          </div>

          {!isPaid && (
            <>
              <h3 className="text-xl font-bold mb-4">
                Choose payment method
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {["KASPI", "CARD", "HALYK"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setMethod(item)}
                    className={`p-5 rounded-2xl border font-bold ${
                      method === item
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    {item === "KASPI" && "Kaspi"}
                    {item === "CARD" && "Bank Card"}
                    {item === "HALYK" && "Halyk"}
                  </button>
                ))}
              </div>

              <button
                onClick={payPayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-60"
              >
                {loading
                  ? "Processing..."
                  : `Pay ₸ ${Number(payment.amount || 0).toLocaleString()}`}
              </button>
            </>
          )}

          {isPaid && (
            <div className="bg-green-50 text-green-700 p-5 rounded-2xl font-bold">
              This payment has already been paid.
            </div>
          )}
        </div>

        <div className="bg-gray-950 text-white p-7 rounded-3xl shadow h-fit">
          <h2 className="text-xl font-bold mb-4">Payment Logic</h2>
          <p className="text-gray-300 text-sm">
            After payment, the system saves the paid date and changes the
            payment status to PAID.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}