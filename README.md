# Get to know Lara

## Story

One of your friends suggested that you should get to know Lara well, but you misunderstood and started to learn Laravel, a popular framework for the Web.
You realized your mistake but want to finish what you started...

Your task is to create an `email application` that helps you communicate with Lara.

## What are you going to learn?

- install and use the `Laravel` framework
- how to connect a `React app` with a `PHP based API`
- what is `ORM`
- what is an `API`

## Tasks

1. Install the `Laravel` PHP framework.
    - The command `laravel --version` prints out the installed version of `Laravel Installer`.

2. Create a new project called `get-to-know-lara-backend` using the `Laravel Installer`.
    - The `get-to-know-lara-backend` directory exists.
    - In that directory, the `php artisan inspire` command prints out an inspiring quote.

3. Setup the database connection in the `.env` file.
    - `DB_CONNECTION` is set to `mysql`.
    - `DB_HOST` is set to the address where your database is hosted.
    - `DB_PORT` is set to the configured port of the database server.
    - `DB_DATABASE` contains the name of the database.
    - `DB_USERNAME` contains the name of the user.
    - `DB_PASSWORD` contains the password of the database user.

4. Create a model with migration called `Mail`.
Make sure it has at least the following properties:
  - `id` as the primary key
  - `id_user_from` a nullable foreign key to the User model
  - `id_user_to` a nullable foreign key to the User model
  - `subject` a string containing the subject of the mail
  - `message` a text containing the body of the mail
  - `is_read` logical value to check if the recipient read the mail or not
  - `sent` a nullable timestamp with the date and time the mail was sent
  - `created` a timestamp with the date and time the record was inserted
    - The `Mail` model exists in `app/Models/Mail.php`.
    - The `database/migrations` folder contains a file for the `Mail` model.
    - The migration describes the following properties: `id`, `id_user_from`, `id_user_to`, `subject`, `message`, `is_read`, `sent`, `created`

5. Create a new `React` app in the `get-to-know-lara-frontend` folder.
    - The `get-to-know-lara-frontend` directory exists and contains at least a `src` folder, an `index.html` and a `package.json` file.

6. Install `Laravel Sanctum` using `Composer`.
    - A folder named `sanctum` exists in the `/vendor/laravel/` directory

7. As a user I would like to have the possibility to register a new account into the system.
    - There is a `/registration` page
    - The page is linked from the landing page
    - There is a form on the registration page when a request is issued with `GET` method
    - The form asks for `username`, `email address`, `password` and issues a `POST` request to registration on submit
    - After submitting you are redirected back to the main page and the new user account is saved in the database
    - For a user account we store the `username`, `email`, a `password` and the date/time of the registration
    - The frontend of the page is created with `React`
    - The backend of the page is created with `Laravel`

8. As a registered user, I'd like to be able to login to the system with my previously saved `email` and `password`.
    - There is a `/login` page
    - The page is linked from the front page
    - There is a form on the login page when a request is issued with `GET` method
    - The form asks for `email address`, `password` and issues a `POST` request to login on submit
    - After submitting you are redirected back to the main page and the given user is logged in
    - The login creates a `token` for further authorization
    - The `token` is stored on the frontend side
    - It is only possible to view mails if the user is logged in
    - The frontend of the page is created with `React`
    - The backend of the page is created with `Laravel`

9. As a registered user, I'd like to be able to read the mails sent to me.
    - There is an `/mail/inbox` page
    - The inbox is the landing page after a successful login
    - Load and display the data from `Mail` model
    - Sort the mails by the latest one on top
    - The frontend of the page is created with `React`
    - The backend of the page is created with `Laravel`

10. As a registered user, I'd like to be able to read the mails sent by me.
    - There is a `/mail/sent` page
    - The page is linked from a sidebar
    - Load and display the data from `Mail` model
    - Sort the mails by the latest one on top
    - The frontend of the page is created with `React`
    - The backend of the page is created with `Laravel`

11. As a registered user, I'd like to be able to send mails to other users.
    - There is a `/mail/compose` page
    - The page is linked from a sidebar
    - There is a `PUT` form with at least `to`, `subject` and `message` fields
    - After sending, you are redirected to "Sent" page
    - The frontend of the page is created with `React`
    - The backend of the page is created with `Laravel`

12. As a registered user, I'd like to be able to read the mails from my inbox and sent lists.
    - There is a `/mail/view/{id}` page
    - There are links to the mail page from every mail lists
    - The page displays the `from`, `subject` and `message` properties of the mail
    - The first display should mark the mail as read
    - The frontend of the page is created with `React`
    - The backend of the page is created with `Laravel`

13. As a registered user, I'd like to be able to mark mails in my `Inbox` as unread.
    - There is a `/mail/mark-as-unread/{id}` endpoint on the backend
    - There should be a deletion link on the mails list
    - Marking a mail as unread will update the `Mail` model

14. [OPTIONAL] As a registered user, I'd like to be able to use `Markdown` syntax in the mail's body.
    - The editor allows the user to use `Markdown` syntax
    - When viewed, the mail is formatted based on the `Markdown` syntax

15. [OPTIONAL] As a registered user, I'd like to be able to delete mails (inbox, sent and draft).
    - There is a `/mail/delete/{id}` endpoint on the backend
    - There should be a deletion link on the mails list
    - Deleting a mail does not redirect you anywhere
    - Deleting a mail does not removes the mail from others' mail boxes
    - Deleted mails are not listed on the inbox page
    - The frontend of the page is created with `React`
    - The backend of the page is created with `Laravel`

16. [OPTIONAL] As a registered user, I'd like to be able to see the mails deleted by me.
    - There is a `/mail/recycle-bin` page
    - The page is linked from a sidebar
    - Load and display the data from `Mail` model
    - Sort the mails by the latest one on top
    - The frontend of the page is created with `React`
    - The backend of the page is created with `Laravel`

## General requirements

- Escape `HTML` tags to prevent `XSS` attacks.

## Hints

- You can create pretty neat UI with [Metro 4 for React](https://react.metroui.org.ua/)
- For every endpoint, use the `HTTP response status code` that fits the most
- Use the most fitting `HTTP request method` for every endpoint
- We recommend to use `Apache` instead of `Laravel's built-in web server` since it's the industry standard and has more capable debugging features
- By default, the port of a `MySQL/MariaDB` server is `3306`
- If one (or more) of your configuration values contains hash marks, you should put that value between double quotes, since hash mark is the commenting character of `.env` files

## Background materials

- <i class="far fa-exclamation"></i> [Laravel Tutorial](https://www.w3schools.in/laravel-tutorial/)
- <i class="far fa-exclamation"></i> [Defining Models with Eloquent](https://riptutorial.com/laravel/example/4292/making-a-model)
- <i class="far fa-video"></i> [Creating a Laravel API](https://youtu.be/mgdMeXkviy8)
- <i class="far fa-book-open"></i> [Introduction to APIs](project/curriculum/materials/pages/general/introduction-to-apis.md)
- <i class="far fa-book-open"></i> [Web Services, URIs, and REST](project/curriculum/materials/pages/msc-advanced-java-pages/5-web-services-uris-and-rest.md)
- <i class="far fa-book-open"></i> [Object-Relational Mapping](project/curriculum/materials/competencies/enterprise-architecture/object-relational-mapping.md.html)
- <i class="far fa-video"></i> [API Authentication with Sanctum](https://youtu.be/P2dfXpUHy6U)
- <i class="far fa-book-open"></i> [Laravel Sanctum Explained](https://dev.to/nicolus/laravel-sanctum-explained-spa-authentication-45g1)
- <i class="far fa-video"></i> [React Markdown Editor](https://youtu.be/YMpI5Ok1Ur8)
- <i class="far fa-book-open"></i> [How to check the database connection in Laravel?](project/curriculum/materials/pages/php/check-database-connection-laravel.md)
