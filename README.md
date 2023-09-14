This is a practice project for Volenday

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Database Set-up

Database is MySQL

1. Create the database:

```
CREATE DATABASE Employees;

```

2. Use the database:
```
USE Employees;

```

3. Create the employees table:
```
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  birthday DATE,
  age INT
);

```

4. Enable the MySQL event scheduler:
```
SET GLOBAL event_scheduler = ON;

```

5. Create an event to update employee ages:
```
CREATE EVENT update_employee_ages
ON SCHEDULE EVERY 1 DAY
STARTS TIMESTAMP(CURRENT_DATE, '00:00:00')
DO
UPDATE employees SET age = TIMESTAMPDIFF(YEAR, birthday, CURDATE());

```

## Enviroment variables

Create a .env.local file:

```
MYSQL_HOST=<Name of your host>
MYSQL_USER=<Name of your User>
MYSQL_PASSWORD=<Your user password>
MYSQL_DATABASE=Employees

```

## About the app

1. The homepage displays the employees added to the database.
2. To add a new employee, click on the "Create Employee" button.
3. You can delete an employee by clicking on the "Delete" button.
4. View all details of an employee by clicking on the "Details" button.
5. From the details page, you can modify employee data by changing the inputs and clicking on the "Update Employee" button.
6. Alternatively, you can return to the homepage by clicking on the "Back to Home" button.
