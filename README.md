# 🔍 [Course Analytics](https://course-analytics.vercel.app/)

![Preview of Course Analytics Home Page](/public/images/preview-home.png?raw=true)
![Preview of Course Analytics Course Page](/public/images/preview-course.png?raw=true)
Course Analytics was developed for students of Oregon State University's Computer Science program. It provides students with aggregated data and tips to help students understand the difficulty, time commitment, common course pairings. The data has been submitted by real students using [this survey](https://docs.google.com/forms/d/e/1FAIpQLSeAWZa_OWYqwOte5yw4loGgE6hEUqOJOeSpmzStZF_HcufufQ/viewform). Feel free to add your own reviews if you are a current student! The data is scraped from [this spreadsheet](https://docs.google.com/spreadsheets/d/1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU/edit#gid=2042942971).

# 📞 API Calls

At this time, the API does not require an API key. Make requests by making http get requests to the desired URI.

URIs are relative to the hosting domain, currently: `https://course-analytics.vercel.app`

## Get Course Summary Data

Get all course summaries using:

`/api/summaries/`

Get a specific course summary using:

`/api/summaries/CS-<number>`

Where `<number>` is the course number. For example, to get the course summary for CS 271, use:

`/api/summaries/CS-271`

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

To scrape data from the original Google Sheet, you will need to save a `.env.local` file in the root of the project directory. The `.env.local` file should have the following key/value pairs:

```
MONGODB_URI=<MongoDB URI>

GOOGLE_CLIENT_EMAIL=<Service Account Email from Google APIs>

GOOGLE_PROJECT_ID=<Project ID from Google APIs>

GOOGLE_PRIVATE_KEY=<Private Key from Google APIs>

GOOGLE_PRIVATE_KEY_ID=<Private Key ID from Google APIs>

GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth

GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token

GOOGLE_CLIENT_X509_CERT_URL=<URL from Google APIs>
```

The MongoDB URI may be a local instance of MongoDB or the URI for a cloud instance of MongoDB.

For more information on the key/value pairs from Google, additional information is available on the [Develop on Google Workspace](https://developers.google.com/workspace/guides/get-started) product documentation site. This explains how to obtain the data necessary to start developing using Google APIs.

## Run

After setting up the `.env.local` file, call `node run scrape-dev` to scrape data from the Google Sheets spreadsheet and populate the MongoDB database.

Next, call `node run dev`. This will start the Next.js server in development mode.

Finally, open a browser window and navigate to `localhost:3000`. This is the Next.JS project running in your browser.

## Testing

Course Analytics uses [Cypress.io](https://www.cypress.io/) to perform end-to-end testing. Cypress is installed as part of the `npm install` command.

To run existing tests, use the `npm run cypress` command.

To modify existing tests or create new tests, use the `npm run cypress-dev` command to run Cypress in its [interactive mode](https://docs.cypress.io/guides/core-concepts/cypress-app). This allows for easier development and debugging of test cases.
