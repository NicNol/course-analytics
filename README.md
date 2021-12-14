# 🔍 [Course Analytics](https://course-analytics.herokuapp.com/)

![Preview of Course Analytics](/public/images/preview.jpg?raw=true)
Course Analytics was developed for students of Oregon State University's online Computer Science program. It provides students with aggregated data and tips to help students understand the difficulty, time commitment, common course pairings. The data has been submitted by real students using [this survey](https://docs.google.com/forms/d/e/1FAIpQLSeAWZa_OWYqwOte5yw4loGgE6hEUqOJOeSpmzStZF_HcufufQ/viewform). Feel free to add your own reviews if you are a current student! The data is scraped from [this spreadsheet](https://docs.google.com/spreadsheets/d/1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU/edit#gid=2042942971).

# 📞 API Calls

At this time, the API does not require an API key. Make requests by making http get requests to the desired URI.

URIs are relative to the hosting domain, currently: `https://course-analytics.herokuapp.com`

## Get Course Summary Data

Get all course summaries using:

`/api/summaries/`

Get a specific course summary using:

`/api/summaries/CS <number>`

Where `<number>` is the course number. For example, to get the course summary for CS 271, use:

`/api/summaries/CS 271`

## Get Course Review Data

Get all course review data using:

`/api/courses/`

Get specific course review data using:

`/api/courses/CS <number>`

Where `<number>` is the course number. For example, to get the course summary for CS 271, use:

`/api/courses/CS 271`

# ⚙️ Development 

## Prerequisites

1. [Node.js](https://nodejs.dev/learn/how-to-install-nodejs), v16.13.1 (recommended) or higher
2. [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), v8.x (recommended) or higher
3. [MongoDB](https://docs.mongodb.com/guides/server/install/)

## Install

Download the current codebase or create a fork. Navigate to the root of the project directory in your terminal window and call `npm install`. This will install the required node module dependencies into your project folder.

## Configure

Within MongoDB, create a new database called `specs`. Inside the database, create a new collection called `bac`.

From the root of the project directory, open `config.js`. Set the URI of the `specs` database using the format provided.

This will allow BAC specification data to be scraped and saved to the database, as well as searched by users using the API.

## Run

Call `node run dev`. This will start the Next.js server in development mode.

The previous call should open a browser window and navigate to `localhost:3000`. This is the project running locally on your machine. 🎉🎉🎉
