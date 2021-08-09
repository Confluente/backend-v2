# backend-v2

This repository stores the second iteration of the backend of the website of H.S.A. Confluente. This backend is written
in TypeScript. Similar to the previous backend, it uses an sqlite3 database and uses Sequelize to interact with it.
However, in contrast to the previous backend version, this backend employs several libraries which make using Sequelize
a lot easier.

## How to set up

#### Prep work
Make sure to have NodeJs and NPM installed. NPM comes with NodeJs. NodeJs is downloadable 
[here](https://nodejs.org/en/download/).

#### Setting up the backend

1. Clone the repository
2. Load up the project in your IDE of choice
3. Open a terminal and change directories to the project folder 
4. Run `npm install`
5. Run `npm run tests` to check if all tests pass, and the that the backend is installed correctly.   
6. Generate an initial database by running `npm run gendb`
7. Run the backend by running `npm run start`

All the aforementioned scripts are defined in the `package.json` file.

![H.S.A. Confluente](backend_flavour.png)
