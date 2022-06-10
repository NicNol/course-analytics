import { SELECTORS } from "../util/selectors";

describe("Tests that a course page renders correctly", () => {
    const courseNumbersArray = [
        "CS 161",
        "CS 162",
        "CS 225",
        "MTH 231",
        "CS 261",
        "CS 271",
        "CS 290",
        "CS 325",
        "CS 340",
        "CS 344",
        "CS 352",
        "CS 361",
        "CS 362",
        "CS 372",
        "CS 373",
        "CS 427",
        "CS 464",
        "CS 467",
        "CS 475",
        "CS 492",
        "CS 493",
    ];

    for (const courseNumber of courseNumbersArray) {
        it(`Tests course ${courseNumber}`, () => {
            /* Test page loads */
            cy.visit(`/courses/${courseNumber}`);

            /* Test for elements on page */
            cy.get(SELECTORS.COURSE_TAG).should("have.length", 2);
            cy.contains(SELECTORS.COURSE_NUMBER, courseNumber);
            cy.get(SELECTORS.COURSE_TITLE)
                .invoke("text")
                .should((courseTitle) => {
                    expect(courseTitle.length).to.be.gte(1);
                });
            cy.get(SELECTORS.COURSE_STATS).within(() => {
                cy.contains("Reviews");
                cy.contains("Hours per Week");
                cy.contains("Difficulty");
                cy.contains("Common Pairings");
            });
            cy.get(SELECTORS.COURSE_REVIEWS).within(() => {
                cy.contains("Tips from Students");
            });
        });
    }
});
