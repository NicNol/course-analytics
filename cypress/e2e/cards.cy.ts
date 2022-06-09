import { SELECTORS } from "./util/selectors";

describe("Tests that all homepage cards render correctly", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("Tests that all cards have two tags", () => {
        cy.get(SELECTORS.COURSE_TILE).each((courseTile, index, collection) => {
            cy.wrap(courseTile).within(() => {
                cy.get(SELECTORS.COURSE_TAG).should("have.length", 2);
            });
        });
    });

    it("Tests that all cards have a course number", () => {
        const courseNumberRegex = /^(CS [1-4][0-9]{2})|(MTH 231)$/;
        cy.get(SELECTORS.COURSE_TILE).each((courseTile, index, collection) => {
            cy.wrap(courseTile).contains(courseNumberRegex);
        });
    });

    it("Tests that all cards have a course title", () => {
        cy.get(SELECTORS.COURSE_TILE).each((courseTile, index, collection) => {
            cy.wrap(courseTile).within(() => {
                cy.get(SELECTORS.COURSE_TITLE)
                    .invoke("text")
                    .should((courseTitle) => {
                        expect(courseTitle.length).to.be.gte(1);
                    });
            });
        });
    });

    it("Tests that all cards have course statistics", () => {
        cy.get(SELECTORS.COURSE_TILE).each((courseTile, index, collection) => {
            cy.wrap(courseTile).within(() => {
                cy.contains("Reviews");
                cy.contains("Hours per Week");
                cy.contains("Difficulty");
            });
        });
    });

    it("Tests that all cards provide a valid link to a course details page", () => {
        cy.get(SELECTORS.COURSE_TILE).each((courseTile, index, collection) => {
            cy.wrap(courseTile).within(() => {
                cy.intercept("**/courses/*").as("coursePage");
                cy.contains("button", "View Details").then((button) => {
                    cy.request(button[0].getAttribute("data-href") as string);
                });
            });
        });
    });
});
