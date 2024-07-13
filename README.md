Money Management
This is a project to organize your personal finances, so you can make sure your expenses or income are recorded properly.

Table of Contents
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contribution](#contribution)
- [Contact Information](#contact-information)


## Technologies
- Node.js
- Express.js
- Prisma ORM
- NeonDB

## Installation
1. Clone this repository:
```bash
git clone https://github.com/ViVnV/project-money-management-be.git
```
2. Navigate to the project directory:
```bash
cd project-name
```
3. Instal the dependencies:
```bash
npm install
```
## Usage
After installation, run the application with the following command:
```bash
npm run dev
```

Open http://localhost:3000 in your browser to view the application.

## Features
- Register
    - Endpoint: POST /register
    - Description: This endpoint allows a new user to create an account. The user must provide a unique username, a valid email address, and a password. The system validates the email format and securely hashes the password before storing it in the database.

- Login
    - Endpoint: POST /login
    - Description: This endpoint allows an existing user to log in. The user must provide their registered email and password. The system verifies the email and password, and if they are correct, it generates and returns a JSON Web Token (JWT) for authentication in future requests.

- Create Financial Record
    - Endpoint: POST /financialrecord/create
    - Description: This endpoint allows a user to create a new financial record. The user must provide details such as title, amount, payment method, date, category, and an optional description. The system validates the provided data and stores the new record in the database.

- Get Financial Records
    - Endpoint: GET /financialrecords
    - Description: This endpoint allows a user to retrieve all their financial records. The system fetches the records from the database and returns them in the response. Users can view all their income and expense records.

- Update Financial Record
    - Endpoint: PATCH /financialrecord/:id/update
    - Description: This endpoint allows a user to update an existing financial record by its ID. The user can update the title, amount, payment method, date, category, and description. The system validates the provided data and updates the record in the database.

- Delete Financial Record
    - Endpoint: DELETE /financialrecord/:id/delete
    - Description: This endpoint allows a user to delete an existing financial record by its ID. The system removes the specified record from the database, and the user will no longer see this record in their list of financial records.

## Contribution 
We welcome contributions from anyone! Follow these steps to contribute:

1. Fork this repository.
2. Create a new branch for your feature or fix
```bash
git checkout -b feature-name
```
3. Commit your changes
```bash
git checkout -b feature-name
```
4. Push to your branch 
```bash
git push origin feature-name
```
5. Create a new pull request

## Contact Information 
If you have any questions or suggestions, please contact developer: vincent.ptk17@gmail.com