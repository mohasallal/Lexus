import EventTimeSlots from "@/components/admin/dashboard/EventTimeSlots";
import RegisteredGuests from "@/components/admin/dashboard/RegisteredGuests";
import Statistics from "@/components/admin/statistics";
import RegisterForm from "@/components/auth/register";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, events, and registrations
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <RegisterForm />
          </div>
          <div>
            <Statistics />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <RegisteredGuests />
          </div>
          <div>
            <EventTimeSlots />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
