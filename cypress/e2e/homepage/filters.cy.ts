import { SELECTORS } from "../util/selectors";

describe("Tests that all homepage filters properly filter cards", () => {
    const lowerDivisionCourseNumberRegex = /^(CS [1-2][0-9]{2})|(MTH 231)$/;
    const upperDivisionCourseNumberRegex = /^CS [3-4][0-9]{2}$/;
    const coreClassTag = "Core Class";
    const electiveTag = "Elective";
    const courseNumbersArray: string[] = [];

    before(() => {
        cy.visit("/");

        /* Push Class Numbers to Array */
        cy.get(SELECTORS.COURSE_NUMBER).each(
            (courseNumber, index, collection) => {
                cy.wrap(courseNumber)
                    .invoke("text")
                    .then((number) => {
                        courseNumbersArray.push(number);
                    });
            }
        );
    });

    it("Tests that the lower division filter works properly", () => {
        filterOnClassType("Lower Division");

        /* Check only Lower Division Cards are shown*/
        cy.get(SELECTORS.COURSE_TILE).each((courseTile, index, collection) => {
            cy.wrap(courseTile).contains(lowerDivisionCourseNumberRegex);
            cy.wrap(courseTile)
                .contains(upperDivisionCourseNumberRegex)
                .should("not.exist");
        });

        /* Check that all Lower Division Cards are shown */
        const lowerDivisionNumbers = courseNumbersArray.filter((number) =>
            lowerDivisionCourseNumberRegex.test(number)
        );
        cy.get(SELECTORS.COURSE_TILE)
            .its("length")
            .should("eq", lowerDivisionNumbers.length);
    });

    it("Tests that the upper division filter works properly", () => {
        filterOnClassType("Upper Division");

        /* Check only Upper Division Cards are shown*/
        cy.get(SELECTORS.COURSE_TILE).each((courseTile, index, collection) => {
            cy.wrap(courseTile).contains(upperDivisionCourseNumberRegex);
            cy.wrap(courseTile)
                .contains(lowerDivisionCourseNumberRegex)
                .should("not.exist");
        });

        /* Check that all Upper Division Cards are shown */
        const upperDivisionNumbers = courseNumbersArray.filter((number) =>
            upperDivisionCourseNumberRegex.test(number)
        );
        cy.get(SELECTORS.COURSE_TILE)
            .its("length")
            .should("eq", upperDivisionNumbers.length);
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
});

function filterOnClassType(classType: string): void {
    cy.get(SELECTORS.MENU_BUTTON).first().click();
    cy.contains(classType).click({ force: true });
    cy.get(SELECTORS.MENU_BUTTON).first().should("have.text", classType);
}
