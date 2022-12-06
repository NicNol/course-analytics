import { SELECTORS } from "../util/selectors";

describe("Tests that homepage filters properly filter cards", () => {
  const lowerDivisionCourseNumberRegex = /(CS [1-2][0-9]{2})|(MTH 231)/;
  const upperDivisionCourseNumberRegex = /CS [3-4][0-9]{2}/;
  const coreClassTag = "Core Class";
  const electiveTag = "Elective";
  const courseNumbersArray: string[] = [];

  before(() => {
    cy.visit("/");

    /* Push Class Numbers to Array */
    cy.get(SELECTORS.COURSE_NUMBER).each((courseNumber, index, collection) => {
      cy.wrap(courseNumber)
        .invoke("text")
        .then((number) => {
          courseNumbersArray.push(number);
        });
    });
  });

  describe("Tests the homepage cards", () => {
    it("Tests that the lower division filter works properly", () => {
      filterOnClassType("Lower Division");

      /* Check only Lower Division Cards are shown*/
      cy.get(SELECTORS.COURSE_TILE).each((courseTile, index, collection) => {
        cy.wrap(courseTile).contains(lowerDivisionCourseNumberRegex);
        cy.wrap(courseTile).contains(upperDivisionCourseNumberRegex).should("not.exist");
      });

      /* Check that all Lower Division Cards are shown */
      const lowerDivisionNumbers = courseNumbersArray.filter((number) => lowerDivisionCourseNumberRegex.test(number));
      cy.get(SELECTORS.COURSE_TILE).its("length").should("eq", lowerDivisionNumbers.length);
    });

    it("Tests that the upper division filter works properly", () => {
      filterOnClassType("Upper Division");

      /* Check only Upper Division Cards are shown*/
      cy.get(SELECTORS.COURSE_TILE).each((courseTile, index, collection) => {
        cy.wrap(courseTile).contains(upperDivisionCourseNumberRegex);
        cy.wrap(courseTile).contains(lowerDivisionCourseNumberRegex).should("not.exist");
      });

      /* Check that all Upper Division Cards are shown */
      const upperDivisionNumbers = courseNumbersArray.filter((number) => upperDivisionCourseNumberRegex.test(number));
      cy.get(SELECTORS.COURSE_TILE).its("length").should("eq", upperDivisionNumbers.length);
    });

    it("Tests that the core classes filter works properly", () => {
      filterOnClassType("Core Classes");

      /* Check only Core Classes are shown*/
      cy.get(SELECTORS.COURSE_TILE).each((courseTile, index, collection) => {
        cy.wrap(courseTile).contains(coreClassTag);
        cy.wrap(courseTile).contains(electiveTag).should("not.exist");
      });
    });

    it("Tests that the elective classes filter works properly", () => {
      filterOnClassType("Electives");

      /* Check only Core Classes are shown*/
      cy.get(SELECTORS.COURSE_TILE).each((courseTile, index, collection) => {
        cy.wrap(courseTile).contains(electiveTag);
        cy.wrap(courseTile).contains(coreClassTag).should("not.exist");
      });
    });

    it("Tests that the date filters work properly", () => {
      const allTimeReviews = [];
      const past2YearsReviews = [];
      const past6MonthsReviews = [];

      filterOnClassType("All Classes");
      cy.get(SELECTORS.COURSE_REVIEW_COUNT).each((count, index, collection) => {
        cy.wrap(count)
          .invoke("text")
          .then((text) => allTimeReviews.push(parseInt(text)));
      });

      filterOnDateString("Past 2 Years");
      cy.get(SELECTORS.COURSE_REVIEW_COUNT).each((count, index, collection) => {
        cy.wrap(count)
          .invoke("text")
          .then((text) => past2YearsReviews.push(parseInt(text)));
      });

      filterOnDateString("Past 6 Months");
      cy.get(SELECTORS.COURSE_REVIEW_COUNT)
        .each((count, index, collection) => {
          cy.wrap(count)
            .invoke("text")
            .then((text) => past6MonthsReviews.push(parseInt(text)));
        })
        .then(() => {
          for (let i = 0; i < allTimeReviews.length; i++) {
            expect(allTimeReviews[i]).to.be.gte(past2YearsReviews[i]);
            expect(past2YearsReviews[i]).to.be.gte(past6MonthsReviews[i]);
          }

          const allTimeReviewCount = allTimeReviews.reduce((prev, current) => prev + current);
          const past2YearsReviewCount = past2YearsReviews.reduce((prev, current) => prev + current);
          const past6MonthsReviewCount = past6MonthsReviews.reduce((prev, current) => prev + current);
          expect(allTimeReviewCount).to.be.gt(past2YearsReviewCount);
          expect(past2YearsReviewCount).to.be.gt(past6MonthsReviewCount);
        });
    });
  });

  describe("Tests the homepage table", () => {
    before(() => {
      filterOnClassType("All Classes");
      filterOnDateString("All Time");
      filterOnViewType("Table View");
    });

    it("Tests that the lower division filter works properly", () => {
      filterOnClassType("Lower Division");

      /* Check only Lower Division Cards are shown*/
      cy.get(SELECTORS.COURSE_ROW).each((courseRow, index, collection) => {
        cy.wrap(courseRow).contains(lowerDivisionCourseNumberRegex);
        cy.wrap(courseRow).contains(upperDivisionCourseNumberRegex).should("not.exist");
      });

      /* Check that all Lower Division Cards are shown */
      const lowerDivisionNumbers = courseNumbersArray.filter((number) => lowerDivisionCourseNumberRegex.test(number));
      cy.get(SELECTORS.COURSE_ROW).its("length").should("eq", lowerDivisionNumbers.length);
    });

    it("Tests that the upper division filter works properly", () => {
      filterOnClassType("Upper Division");

      /* Check only Upper Division classes are shown*/
      cy.get(SELECTORS.COURSE_ROW).each((courseRow, index, collection) => {
        cy.wrap(courseRow).contains(upperDivisionCourseNumberRegex);
        cy.wrap(courseRow).contains(lowerDivisionCourseNumberRegex).should("not.exist");
      });

      /* Check that all Upper Division classes are shown */
      const upperDivisionNumbers = courseNumbersArray.filter((number) => upperDivisionCourseNumberRegex.test(number));
      cy.get(SELECTORS.COURSE_ROW).its("length").should("eq", upperDivisionNumbers.length);
    });

    it("Tests that the date filters work properly", () => {
      const allTimeReviews = [];
      const past2YearsReviews = [];
      const past6MonthsReviews = [];

      filterOnClassType("All Classes");
      cy.contains(/[0-9]+ Reviews/).each((count, index, collection) => {
        cy.wrap(count)
          .invoke("text")
          .then((text) => allTimeReviews.push(parseInt(text.split(" ")[0])));
      });

      filterOnDateString("Past 2 Years");
      cy.contains(/[0-9]+ Reviews/).each((count, index, collection) => {
        cy.wrap(count)
          .invoke("text")
          .then((text) => past2YearsReviews.push(parseInt(text.split(" ")[0])));
      });

      filterOnDateString("Past 6 Months");
      cy.contains(/[0-9]+ Reviews/)
        .each((count, index, collection) => {
          cy.wrap(count)
            .invoke("text")
            .then((text) => past6MonthsReviews.push(parseInt(text.split(" ")[0])));
        })
        .then(() => {
          for (let i = 0; i < allTimeReviews.length; i++) {
            expect(allTimeReviews[i]).to.be.gte(past2YearsReviews[i]);
            expect(past2YearsReviews[i]).to.be.gte(past6MonthsReviews[i]);
          }

          const allTimeReviewCount = allTimeReviews.reduce((prev, current) => prev + current);
          const past2YearsReviewCount = past2YearsReviews.reduce((prev, current) => prev + current);
          const past6MonthsReviewCount = past6MonthsReviews.reduce((prev, current) => prev + current);
          expect(allTimeReviewCount).to.be.gt(past2YearsReviewCount);
          expect(past2YearsReviewCount).to.be.gt(past6MonthsReviewCount);
        });
    });
  });
});

function filterOnClassType(classType: string): void {
  cy.get(SELECTORS.MENU_BUTTON).first().click();
  cy.contains(SELECTORS.MENU_OPTION, classType).click({ force: true });
  cy.get(SELECTORS.MENU_BUTTON).first().should("have.text", classType);
}

function filterOnDateString(dateString: string): void {
  cy.get(SELECTORS.MENU_BUTTON).eq(2).click();
  cy.contains(SELECTORS.MENU_OPTION, dateString).click({ force: true });
  cy.contains(SELECTORS.MENU_BUTTON, dateString).first().should("have.text", dateString);
}

function filterOnViewType(viewType: string): void {
  cy.get(SELECTORS.MENU_BUTTON).eq(1).click();
  cy.contains(SELECTORS.MENU_OPTION, viewType).click({ force: true });
  cy.contains(SELECTORS.MENU_BUTTON, viewType).first().should("have.text", viewType);
}
