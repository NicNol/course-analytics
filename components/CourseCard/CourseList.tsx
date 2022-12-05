import React, { FC } from "react";
import { Container, Wrap } from "@chakra-ui/react";
import CourseTile from "./CourseTile";
import { ISummary } from "../../util/models/summary";

interface CourseListProps {
  filter: string[];
  jsonData: ISummary[];
}

const CourseList: FC<CourseListProps> = ({ jsonData: data, filter }) => {
  const sortedCourses = data.sort((a, b) => {
    const key = "code";
    const a_title = a[key].split(" ");
    const a_number = parseInt(a_title[1]);
    const b_title = b[key].split(" ");
    const b_number = parseInt(b_title[1]);
    return a_number - b_number;
  });

  const courseTiles = sortedCourses.map((classSummary: ISummary) => {
    const {
      tags,
      code,
      title,
      "review count": reviews,
      "time commitment": time,
      "average difficulty": difficulty,
    } = classSummary;

    const in_filter = classSummary.tags.some((tag) => filter.includes(tag));

    if (in_filter) {
      return (
        <CourseTile
          key={code}
          tags={tags}
          code={code}
          title={title}
          reviews={reviews}
          difficulty={difficulty}
          time={time}
        />
      );
    }
  });

  return (
    <Container maxW="container.xl">
      <Wrap spacing={4} justify="center">
        {courseTiles}
      </Wrap>
    </Container>
  );
};

export default CourseList;
