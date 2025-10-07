import RegisteredGuests from "@/components/admin/dashboard/RegisteredGuests";
import Statistics from "@/components/admin/statistics";
import RegisterForm from "@/components/auth/register";

const page = () => {
  return (
    <div className="container px-8 mt-8">
      <RegisterForm />
      <Statistics />
      <RegisteredGuests />
    </div>
  );
};

export default page;
