import { GetStaticProps } from "next";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { getSummary } from "../pages/api/summary/index";
import Filter from "../components/Filter";
import CourseTable from "../components/CourseTable/CourseTable";
import CourseList from "../components/CourseList";
import PageWrapper from "../components/PageWrapper";
import { ISummaryByDate } from "../util/models/summary";

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
    <>
      <Head>
        <title>Course Analytics</title>
        <meta charSet="UTF-8" />
        <meta
          name="keywords"
          content="Oregon State University,Online, Computer Science, Post-Bacc, Course, Analytics, Reviews, Data"
        />
        <meta
          name="description"
          content="Course Analytics for Oregon State University's Computer Science Post-Bacc Program"
        />
        <meta name="author" content="Nic Nolan" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <PageWrapper>
        <Filter classFilter={handleClassFilter} setLayoutView={setLayoutView} dateFilter={handleDateFilter} />
        {layoutView === "Card View" ? (
          <CourseList filter={classFilter} jsonData={jsonData[dateFilter]} />
        ) : (
          <CourseTable filter={classFilter} jsonData={jsonData[dateFilter]} />
        )}
      </PageWrapper>
    </>
  );
};

export default Home;
