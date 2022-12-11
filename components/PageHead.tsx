import React, { FC } from "react";
import Head from "next/head";

interface PageHeadProps {
  pageTitle?: string;
}

const PageHead: FC<PageHeadProps> = ({ pageTitle }) => {
  const fullPageTitle = pageTitle ? `Course Analytics | ${pageTitle}` : "Course Analytics";
  return (
    <Head>
      <html lang="en" />
      <title>{fullPageTitle}</title>
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
  );
};

export default PageHead;
