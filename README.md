# PollApp

PollApp is a responsive web application for creating, managing
and participating in surveys. Users can create custom surveys,
select categories, set deadlines and view voting results.

## Live Demo

https://enes-kurt.developerakademie.net/poll-app/

## Features

- Create and publish custom surveys.
- Add multiple questions and answer options.
- Support single-choice and multiple-choice questions.
- Set optional survey descriptions and deadlines.
- Filter surveys by category.
- Switch between active and past surveys.
- Highlight surveys that are ending soon.
- Display dynamically updated voting results.
- Prevent repeated voting on completed surveys.
- Prevent voting on expired surveys.
- Validate required fields and character limits.
- Prevent invalid survey deadlines.
- Store surveys and voting progress using LocalStorage.
- Responsive design for desktop, tablet and mobile devices.
- Swipeable highlight cards on mobile devices.

## Technologies

- Angular
- TypeScript
- HTML5
- SCSS
- LocalStorage
- Git and GitHub

## Getting Started

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/Enes-1905/poll-app.git
```

Navigate to the project directory:

```bash
cd poll-app
```

Install the required dependencies:

```bash
npm install
```

### Development Server

Start the application:

```bash
npm start
```

Open your browser and navigate to:

http://localhost:4200/

The application automatically reloads when source files
are modified.

### Production Build

To create a production build, run:

```bash
npm run build
```

For deployment in the `/poll-app/` subdirectory, run:

```bash
npm run build -- --base-href /poll-app/
```

The generated build files are stored in the `dist/` directory.

## Data Storage

PollApp uses the browser's LocalStorage to save surveys,
votes and completion states.

Data remains available after refreshing the page.
No backend, database or user account is required.

Survey data and voting results are stored locally and
are not synchronized across different browsers or devices.

## Project Purpose

This project was developed as part of the frontend development
training at Developer Akademie.

The focus is on responsive web design, Angular development,
form validation, interactive user interfaces and clean code.

## Author

Enes Kurt