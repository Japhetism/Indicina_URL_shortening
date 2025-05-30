# URL Shortener API

This project implements a **URL Shortener API** using **Node.js** and **TypeScript**. It allows users to encode long URLs into short URLs and decode them back to their original form. The API also tracks various statistics related to each shortened URL, such as visit counts and user-agent details.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Run the Application](#run-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)

## Features
- **Shorten URLs**: Converts long URLs into short, easy-to-share links.
- **Redirect to Long URL**: Redirects users from the short URL to the original long URL.
- **Statistics**: Tracks and returns statistics about the visits, including browser, CPU, device, and type stats.
- **Error Handling**: Includes validation for input URLs, handling missing or incorrect URLs.
- **Swagger UI**: Provides API documentation via Swagger.

## Technologies
- **Node.js**: JavaScript runtime environment for building the server.
- **TypeScript**: For type safety and better maintainability.
- **Express**: Web framework for building the API.
- **Swagger**: For API documentation.
- **Jest**: For unit testing.
- **Supertest**: For HTTP assertions in tests.
- **UA-Parser-JS**: For parsing user-agent strings and extracting device/browser info.

## Installation

To get started with the project, clone the repository and install dependencies:

```bash
git clone https://github.com/Japhetism/Indicina_URL_shortening.git
cd src/api
npm install
```

## Run the Application

### Development Mode

To run the application in development mode (with hot reloading), use the following command:

```bash
npm run dev
```

This will start the server on [http://localhost:5000](http://localhost:5000). The server will automatically restart whenever changes are made to the source files.

### Production Mode

To build the TypeScript files and run the application in production, use:

```bash
npm run build
npm start
```

The production server will run on [http://localhsot:5000](http://localhost:5000).

## Testing

This project uses Jest for testing and Supertest for HTTP assertions. To run the tests, use the following command:

```bash
npm test
```

This will run all the test cases in the src directory and output the results to the console.

### Running Specific Tests

To run test for specific files or functions, use Jest's --testNamePattern flag, fr example:

```bash
npm test -- --testNamePattern="POST /api/v1/encode"
```

## API Documentation

The API documented using swagger UI. To access the API documentation, start the server and visit:

```bash
http://localhost:5000/api-docs
```


