# GoStack Challenge 03

> Objective: Enhance the Meetapp started in the previous challenge by implementing new features. [See full requirements](https://github.com/Rocketseat/bootcamp-gostack-desafio-03 "See full requirements")

Used tools:
- Sucrase + Nodemon;
- ESLint + Prettier + EditorConfig;
- Sequelize (PostgresSQL);
- Docker (postgres and sentry);
- Multer (file upload);
- Nodemailer (for sending emails);
- Mailtrap (test sending emails in development environment);
- Redis + Bee Queue (manage email queue);
- Sentry (monitor production errors) + Youch (prettier error json);
- Dotenv (environment variables);

## Application
The MeetApp is an app  that aggregates events for developers (Meetup + App).

In this challenge were created some basic features that I have learned throughout the classes so far.

## Features

### Image upload
Create a meetup with a picture. Was created a route to upload an image using the Multer library.

### Sending e-mails
Whenever a user signs up to meetup, an email will be sent to the organizer containing the data related to the registered user. Multer library was used to send emails to a test e-mail (MailTrap).

### E-mail Queue
An e-mail queue system (Redist + Bee Queue) was used preventing it from interfering with application performance. 

### Error handling
To monitor errors in production, the Sentry library was used. The Youch was used to return a json containing error details in development environment.

### Enviorment variables
The library Dotenv was used to creating and using a file containing all environment variables.
