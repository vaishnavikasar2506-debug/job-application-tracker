# Job Application Tracker

A full-stack web app to track job applications — built with vanilla HTML, CSS, JavaScript on the frontend and PHP + MySQL on the backend.

## Features
- Dashboard with live application statistics
- Add / Edit / Delete applications
- Search by company name
- Filter by application status
- Sort by company name or deadline
- Mark favorite companies
- Light / Dark mode
- Responsive design (mobile + desktop)
- Data persisted in MySQL via a PHP REST-style API

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (fetch API)
- **Backend:** PHP (PDO for database access)
- **Database:** MySQL

## Architecture
The frontend never talks to the database directly. JavaScript sends `fetch()`
requests to PHP endpoints in `/api`, which use prepared statements (PDO) to
safely read/write to MySQL and respond with JSON.

```
Browser (HTML/CSS/JS) → fetch() → PHP API (/api/*.php) → MySQL
```

## Setup

1. Install [XAMPP](https://www.apachefriends.org/) and start Apache + MySQL.
2. Clone this repo into your XAMPP `htdocs` folder:
   ```
   git clone <your-repo-url> C:/xampp/htdocs/job-tracker
   ```
3. Open `http://localhost/phpmyadmin`, go to the **SQL** tab, and run the contents of `database.sql`.
4. Visit `http://localhost/job-tracker/index.html`.

## Project Structure
```
job-tracker/
├── index.html
├── style.css
├── script.js
├── config.php          # DB connection
├── database.sql        # schema + sample data
└── api/
    ├── get_applications.php
    ├── add_application.php
    ├── update_application.php
    ├── delete_application.php
    └── toggle_favorite.php
```

## Screenshots
_Add a screenshot or two here once it's running — recruiters skim these._
