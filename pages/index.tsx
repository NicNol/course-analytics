import { GetStaticProps } from "next";
import type { NextPage } from "next";
import { useState } from "react";
import { getSummary } from "../pages/api/summary/index";
import AllFilters from "../components/Menus/AllFilters";
import CourseTable from "../components/CourseTable/CourseTable";
import CourseList from "../components/CourseCard/CourseList";
import PageWrapper from "../components/PageWrapper";
import { ISummaryByDate } from "../util/models/summary";
import PageHead from "../components/PageHead";

export const getStaticProps: GetStaticProps = async (context) => {
  let jsonData = await getSummary();
  /* Reformat to prevent a Next.js error when using getStaticProps */
  jsonData = JSON.parse(JSON.stringify(jsonData));
  return {
    props: { data: jsonData },
    revalidate: 3600, // seconds (1 hour)
  };
};

interface SummaryDataJSON {
  data: ISummaryByDate[];
}

interface IClassFilterMap {
  [key: string]: string[];
}

export enum DateFilter {
  AllTime = "All Time",
  Past2Years = "Past 2 Years",
  Past6Months = "Past 6 Months",
}

const classFilterMap: IClassFilterMap = {
  "All Classes": ["Lower Division", "Upper Division", "Core Class", "Elective"],
  "Lower Division": ["Lower Division"],
  "Upper Division": ["Upper Division"],
  "Core Classes": ["Core Class"],
  Electives: ["Elective"],
};

const Home: NextPage<SummaryDataJSON> = ({ data }) => {
  const [jsonData] = data;
  const [classFilter, setClassFilter] = useState(["Lower Division", "Core Class", "Upper Division", "Elective"]);
  const [layoutView, setLayoutView] = useState("Card View");
  const [dateFilter, setDateFilter] = useState<DateFilter>(DateFilter.AllTime);

  function handleClassFilter(criteria: string) {
    const classFilters = classFilterMap[criteria];
    setClassFilter(classFilters);
  }

  function handleDateFilter(criteria: DateFilter) {
    setDateFilter(criteria);
  }

  return (
    <PageWrapper>
      <PageHead />
      <AllFilters classFilter={handleClassFilter} setLayoutView={setLayoutView} dateFilter={handleDateFilter} />
      {layoutView === "Card View" ? (
        <CourseList filter={classFilter} jsonData={jsonData[dateFilter]} />
      ) : (
        <CourseTable filter={classFilter} jsonData={jsonData[dateFilter]} />
      )}
    </PageWrapper>
  );
};

export default Home;
