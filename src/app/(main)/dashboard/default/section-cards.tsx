import { ClientsCard } from "@/modules/main/_components/default/_stats/clients-stats";
import { EmployeesCard } from "@/modules/main/_components/default/_stats/employees-stats";
import { ProjectsCard } from "@/modules/main/_components/default/_stats/projects-stats";
import { ServicesCard } from "@/modules/main/_components/default/_stats/services-stats";

export function SectionCards() {

  return (
    <div className="*:data-[slot=card]:from-primary/5 max-w-[1440px] mx-auto container *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <ClientsCard />
      <ProjectsCard />
      <EmployeesCard />
      <ServicesCard />
    </div>
  );
}