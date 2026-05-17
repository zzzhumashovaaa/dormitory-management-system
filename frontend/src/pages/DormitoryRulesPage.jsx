import DashboardLayout from "../layouts/DashboardLayout";

export default function DormitoryRulesPage() {
  const rules = [
    {
      title: "Entry and Exit Time",
      text: "The dormitory closes at 22:00. Students entering after this time may be marked as late in the system.",
    },
    {
      title: "Quiet Hours",
      text: "Quiet hours start at 22:00. Loud music, shouting and disturbing roommates are not allowed.",
    },
    {
      title: "Visitors",
      text: "All visitors must be registered at the reception. Visitors are not allowed to stay overnight.",
    },
    {
      title: "Cleanliness",
      text: "Students must keep their rooms and shared areas clean. Regular inspections may be conducted.",
    },
    {
      title: "Room Safety",
      text: "Students are responsible for room furniture, keys and personal belongings.",
    },
    {
      title: "Complaints and Issues",
      text: "Technical issues, conflicts or complaints should be submitted through the dormitory system.",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dormitory Rules</h1>
        <p className="text-gray-500">
          Read the main rules and regulations of the dormitory.
        </p>
      </div>

      <div className="bg-blue-600 text-white p-8 rounded-3xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-2">
          Main Rule: Dormitory closes at 22:00
        </h2>
        <p className="text-blue-100">
          Entry after 22:00 can be recorded as a late entry through the QR access
          system.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {rules.map((rule, index) => (
          <div key={index} className="bg-white p-7 rounded-3xl shadow">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-4">
              {index + 1}
            </div>

            <h2 className="text-xl font-bold mb-3">{rule.title}</h2>
            <p className="text-gray-600">{rule.text}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}