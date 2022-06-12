import { SELECTORS } from "../util/selectors";

describe("Tests that homepage Table renders correctly", () => {
    beforeEach(() => {
        cy.visit("/");

        cy.get(SELECTORS.MENU_BUTTON).eq(1).click();
        cy.contains("Table View").click({ force: true });
        cy.get(SELECTORS.MENU_BUTTON).eq(1).should("have.text", "Table View");
    });

    it("Tests that all rows have a course number", () => {
        const courseNumberRegex = /(CS [1-4][0-9]{2})|(MTH 231)/;
        cy.get("tbody tr").each((courseRow, index, collection) => {
            cy.wrap(courseRow).contains(courseNumberRegex);
        });
    });

    it("Tests that all rows have course statistics", () => {
        cy.get("tbody tr").each((courseRow, index, collection) => {
            cy.wrap(courseRow).within(() => {
                cy.contains(/[0-9]+ Reviews/);
                cy.contains(/[1]*[0-9] Hours/);
                cy.contains(/[1-5].[0-9] \/ 5.0/);
            });
        });
    });

    it("Tests that all rows provide a valid link to a course details page", () => {
        cy.get("tbody tr a").each((courseLink, index, collection) => {
            cy.wrap(courseLink).then((courseLink) => {
                cy.intercept("**/courses/*").as("coursePage");
                cy.request(courseLink[0].getAttribute("href") as string);
            });
        });
    });

    //TODO: Test that each column is sortable and sorts correctly
});
