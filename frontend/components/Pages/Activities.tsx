import Title from "../title";
import ActivitiesCards from "./ActivitiesCards";

const Activities = () => {
  return (
    <main className="w-full screen-full flex flex-col items-center justify-center text-center px-4 py-12 gap-8">
      <Title
        main="Choose Your Experience"
        sub="Select an activity to view available time slots and book your session."
      />
      <ActivitiesCards />
    </main>
  );
};

export default Activities;
