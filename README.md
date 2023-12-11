# Restaurant Reservation App - Periodic Tables #

**Link to deployed live application:**

[Live Application](https://restaurant-reservations-xxdy.onrender.com/)

**Link to backend server:**

[Backend Server](https://reservation-mfrf.onrender.com)

### Project Description: ###

The Restaurant Reservation App provides restaurant managers with an easy and effective way to track and manage reservations. The application allows restaurant employees to view reservations by date, update the status of a reservation, and seat a reservation at a table. They are able to view reservations on the dashboard alongside a list of tables, with the current status of the table. Restaurant staff can search for and create new reservations, and they are able to create new tables as well.


<hr>

Some important features include:

1. A dashboard on the homepage lists reservations for the current date and displays a list of tables in the restaurant. The manager can also navigate forward and backward to look at reservations from the previous day and for the next day.
   <br>
   
<img width="1470" alt="reservation-dashboard" src="https://github.com/DevinaG007/restaurant-reservation/assets/137969744/db1ca061-a1cb-4ddd-9267-d62719122fbd">
  <br>
<hr>
  
2. Restaurant managers and employees can create new reservations under the New Reservation tab.


<img width="1470" alt="create-reservation" src="https://github.com/DevinaG007/restaurant-reservation/assets/137969744/82bca69c-bfd8-43b2-9bd2-1a5fc044d1b9">
<hr>

3. New tables can be created under the New Table tab.


<img width="1460" alt="create-table" src="https://github.com/DevinaG007/restaurant-reservation/assets/137969744/08308c7f-28ae-431e-8752-aae3f125c492">
<hr>

4. Restaurant employees can search for existing reservations by inputting a customer's phone number. All matching reservations will be returned, regardless of the reservation's status.

   
   <img width="1470" alt="search-reservations" src="https://github.com/DevinaG007/restaurant-reservation/assets/137969744/10623509-aed3-4848-a239-b7f1db47dd76">

<hr>

### Backend Application ###

The backend of the application implements RESTful API strategies. Files are divided by routes. Both the /tables route and the /reservations route include three main files to maintain clean organization:

-**Router:** Specifies routes that can be used, as well as the available HTTP request methods. There is an error handler in place to prevent request methods that are not authorized.

-**Controller:** Contains method handling functions that send the request to the database. Also contains validation middleware to prevent invalid input from the user. The restaurant's business rules are enforced in the middleware and will be displayed in the UI if the user violates any rules.

-**Service:** Uses Knex to make database queries using CRUDL functions.

### Technologies Used: ###

**Frontend:**

-React.js

-CSS


**Backend:**

-Node.js

-Express

-PostgreSQL

### Installation Instructions ###

Fork and clone repository.


Run ```npm install``` to install project dependencies.
Run ```npm run start:dev``` to start your server in development mode.

To run the application's tests:

Run ```npm test``` to run all tests. 
Run ```npm run test:backend``` to run all the backend tests.
Run ```npm run test:frontend``` to run all of the frontend tests.