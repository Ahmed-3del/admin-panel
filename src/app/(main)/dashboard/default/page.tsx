/* eslint-disable sonarjs/no-commented-code */
// import { ChartAreaInteractive } from "./chart-area-interactive";
// import { DataTable } from "./data-table";
import DataTable from "./data-table";
// import data from "./data.json";
import { SectionCards } from "./section-cards";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-full">
          <SectionCards />
          <DataTable />
        </div>
      </div>
    </div>
  );
}
