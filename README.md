# 🔍 [Course Analytics](https://www.osu-cs-ca.com/)

![Preview of Course Analytics Home Page](/public/images/preview-home.png?raw=true)
![Preview of Course Analytics Course Page](/public/images/preview-course.png?raw=true)
Course Analytics was developed for students of Oregon State University's Computer Science program. It provides students with aggregated data and tips to help students understand the difficulty, time commitment, common course pairings. The data has been submitted by real students using [this survey](https://docs.google.com/forms/d/e/1FAIpQLSeAWZa_OWYqwOte5yw4loGgE6hEUqOJOeSpmzStZF_HcufufQ/viewform). Feel free to add your own reviews if you are a current student! The data is scraped from [this spreadsheet](https://docs.google.com/spreadsheets/d/1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU/edit#gid=2042942971).

# 📞 API Calls

At this time, the API does not require an API key. Make requests by making http get requests to the desired URI.

URIs are relative to the hosting domain, currently: `https://www.osu-cs-ca.com`

## Get Course Summary Data

Get all course summaries using:

`/api/summary/`

Get a specific course summary using:

`/api/summary/CS-<number>`

Where `<number>` is the course number. For example, to get the course summary for CS 271, use:

`/api/summary/CS-271`

## Get Course Review Data

Get all course review data using:

`/api/courses/`

Get specific course review data using:

`/api/courses/CS-<number>`

Where `<number>` is the course number. For example, to get the course summary for CS 271, use:

`/api/courses/CS-271`

# ⚙️ Development

## Prerequisites

1. [Node.js](https://nodejs.dev/learn/how-to-install-nodejs), v16.13.1 (recommended) or higher
2. [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), v8.x (recommended) or higher
3. [MongoDB](https://docs.mongodb.com/guides/server/install/) (optional)

## Install

Download the current codebase or create a fork. Navigate to the root of the project directory in your terminal window and call `npm install`. This will install the required node module dependencies into your project folder.

## Configure

Copy `.env.example` to `.env.local` in the root of the project directory and fill in the values. Every command that loads the app (`npm run dev`, `npm run build`, `npm start`) fails with a list of whichever variables are missing.

Running the site locally needs your own database, and the only way to fill it is the scraper. That is why all four variables are required. The Google values come from a service account with access to the survey sheet. `CRON_KEY` is the value `/api/scrape` expects in the `Authorization` header. It can be any string if you only scrape with `npm run scrape-dev`.

The MongoDB URI may be a local instance of MongoDB or the URI for a cloud instance of MongoDB.

For more information on the key/value pairs from Google, additional information is available on the [Develop on Google Workspace](https://developers.google.com/workspace/guides/get-started) product documentation site. This explains how to obtain the data necessary to start developing using Google APIs.

## Run

After setting up the `.env.local` file, call `npm run scrape-dev` to scrape data from the Google Sheets spreadsheet and populate the MongoDB database.

Next, call `npm run dev`. This will start the Next.js server in development mode.

Finally, open a browser window and navigate to `localhost:3000`. This is the Next.JS project running in your browser.

## Testing

Course Analytics uses [Cypress.io](https://www.cypress.io/) to perform end-to-end testing. Cypress is installed as part of the `npm install` command.

To run existing tests, use the `npm run cypress` command.

To modify existing tests or create new tests, use the `npm run cypress-dev` command to run Cypress in its [interactive mode](https://docs.cypress.io/guides/core-concepts/cypress-app). This allows for easier development and debugging of test cases.
