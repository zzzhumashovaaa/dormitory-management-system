import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");

  const [form, setForm] = useState({
    studentId: "",
    amount: "",
    dueDate: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      const role = localStorage.getItem("role");

const studentsEndpoint =
  role === "ADMIN"
    ? "/admin/students"
    : "/users/students";

const [paymentsResponse, studentsResponse] = await Promise.all([
  api.get("/payments"),
  api.get(studentsEndpoint),
]);

      setPayments(paymentsResponse.data || []);
      setStudents(studentsResponse.data || []);
    } catch (error) {
      console.log("PAYMENTS LOAD ERROR:", error);
      alert("Failed to load payments or students");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedStudent = students.find(
    (student) => student.id === form.studentId
  );

  const filteredStudents = useMemo(() => {
    const query = studentSearch.toLowerCase().trim();

    if (!query) {
      return students;
    }

    return students.filter((student) => {
      return (
        student.fullName?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query) ||
        student.studentId?.toLowerCase().includes(query) ||
        student.faculty?.toLowerCase().includes(query)
      );
    });
  }, [students, studentSearch]);

  const createPayment = async () => {
    if (!form.studentId) {
      alert("Please select a student");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!form.dueDate) {
      alert("Please select due date");
      return;
    }

    try {
      await api.post(`/payments/create/${form.studentId}`, {
        amount: Number(form.amount),
        dueDate: form.dueDate,
        description: form.description,
        status: "UNPAID",
      });

      setForm({
        studentId: "",
        amount: "",
        dueDate: "",
        description: "",
      });

      setStudentSearch("");
      fetchData();
    } catch (error) {
      console.log("CREATE PAYMENT ERROR:", error);
      alert("Failed to create payment");
    }
  };

  const markAsPaid = async (id) => {
    try {
      await api.put(`/payments/${id}/pay`);
      fetchData();
    } catch (error) {
      console.log("MARK PAID ERROR:", error);
      alert("Failed to mark payment as paid");
    }
  };

  const debtors = payments.filter((p) => p.status !== "PAID");
  const paid = payments.filter((p) => p.status === "PAID");
  const totalDebt = debtors.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-gray-500">
          Manage dormitory debts and student payments
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-5 mb-5">
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Total Payments</p>
          <h2 className="text-4xl font-bold">{payments.length}</h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-red-500">Debtors</p>
          <h2 className="text-4xl font-bold text-red-600">{debtors.length}</h2>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <p className="text-green-600">Paid</p>
          <h2 className="text-4xl font-bold text-green-700">{paid.length}</h2>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
          <p className="text-orange-600">Total Debt</p>
          <h2 className="text-3xl font-bold text-orange-700">
            ₸ {totalDebt.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-5 mb-5">
        <h2 className="text-xl font-bold mb-4">Create Payment</h2>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative md:col-span-1">
            <input
              type="text"
              placeholder="Search student by name, email, ID..."
              className="border rounded-xl p-3 w-full"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />

            <div className="mt-2 border rounded-xl max-h-56 overflow-y-auto bg-white">
              {filteredStudents.length === 0 && (
                <p className="p-3 text-gray-500 text-sm">No students found</p>
              )}

              {filteredStudents.map((student) => (
                <button
                  type="button"
                  key={student.id}
                  onClick={() => {
                    setForm({
                      ...form,
                      studentId: student.id,
                    });
                    setStudentSearch(student.fullName || "");
                  }}
                  className={`w-full text-left p-3 border-b last:border-b-0 hover:bg-blue-50 ${
                    form.studentId === student.id ? "bg-blue-100" : ""
                  }`}
                >
                  <p className="font-semibold">{student.fullName || "No name"}</p>
                  <p className="text-xs text-gray-500">
                    {student.email || "-"} {student.studentId ? `• ${student.studentId}` : ""}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <input
            type="number"
            placeholder="Amount"
            className="border rounded-xl p-3 h-fit"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value,
              })
            }
          />

          <input
            type="date"
            className="border rounded-xl p-3 h-fit"
            value={form.dueDate}
            onChange={(e) =>
              setForm({
                ...form,
                dueDate: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Description"
            className="border rounded-xl p-3 h-fit"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />
        </div>

        {selectedStudent && (
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-700">Selected student</p>
            <p className="font-bold">
              {selectedStudent.fullName} — {selectedStudent.email}
            </p>
          </div>
        )}

        <button
          onClick={createPayment}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
        >
          Create Payment
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Description</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t">
                <td className="p-4">
                  <p className="font-semibold">
                    {payment.student?.fullName || "-"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {payment.student?.email || payment.student?.studentId || "-"}
                  </p>
                </td>

                <td className="p-4 font-semibold">
                  ₸ {Number(payment.amount || 0).toLocaleString()}
                </td>

                <td className="p-4">{payment.dueDate || "-"}</td>

                <td className="p-4">{payment.description || "-"}</td>

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
                    <button
                      onClick={() => markAsPaid(payment.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                    >
                      Mark Paid
                    </button>
                  ) : (
                    <span className="text-gray-400">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <p className="p-6 text-center text-gray-500">No payments found</p>
        )}
      </div>
    </DashboardLayout>
  );
}