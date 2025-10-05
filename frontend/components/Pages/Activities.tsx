import Title from "../title";
import ActivitiesCards from "./ActivitiesCards";

const Activities = () => {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center text-center px-4 py-12 gap-8">
      <Title
        main="اختر تجربتك"
        sub="اختر نشاطًا لعرض الفترات الزمنية المتاحة وحجز جلستك."
      />
      <ActivitiesCards />
    </main>
  );
};

export default Activities;
