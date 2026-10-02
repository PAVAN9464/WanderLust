# Wanderlust

Wanderlust is a server-rendered travel-listing application built with Node.js, Express 5, MongoDB, Mongoose, and EJS. Visitors can browse travel listings and their details. Registered users can create listings, upload listing images to Cloudinary, and leave star-rated reviews. Listing owners can edit or delete their listings, while review authors can delete their own reviews. The app uses Passport sessions for authentication, Joi for request validation, and a shared EJS error page for application errors.

## Features

- Display all travel listings.
- View the details of an individual listing.
- Add a new listing through an HTML form, including an image upload stored in Cloudinary.
- Edit an existing listing from its details page.
- Delete an existing listing from its details page.
- Add a 1-5-star review using a clickable star picker and a comment.
- Display review ratings as stars and show the review author's username.
- Attribute listings and reviews to their creators.
- Restrict listing edit/delete actions to the listing owner and review deletion to the review author.
- Require login for listing creation, listing edits/deletes, and review creation/deletion.
- Store listing data in MongoDB using Mongoose.
- Associate reviews with listings and remove their reviews when a listing is deleted.
- Seed the database with sample travel listings.
- Validate listing create/update and review submissions with Joi.
- Preserve a user's intended destination and redirect there after login when applicable.
- Render not-found, validation, and other application errors with a shared error page.
- Show one-time success and error flash alerts after listing and review actions.
- Register users with a username, email, and password.
- Authenticate users with Passport's local strategy and session-based login.
- Render pages on the server with EJS templates.
- Display listing images from the nested `image.url` field; new-listing uploads are stored in the `Wanderlust_DEV` Cloudinary folder.
- Use shared layouts with a responsive navbar and footer.
- Provide Bootstrap-based responsive layouts, client-side form validation, and custom styling for listing actions and review stars.

## Technology Stack

- **Node.js**: JavaScript runtime.
- **Express 5**: Web server and routing framework.
- **MongoDB**: Database for storing listings.
- **Mongoose**: MongoDB object modeling library.
- **EJS**: Server-side HTML templating engine.
- **EJS-Mate**: Shared EJS layouts and template support.
- **Joi**: Server-side validation for listing form data.
- **Multer** and **multer-storage-cloudinary**: Receive uploaded listing images and store them in Cloudinary.
- **Cloudinary**: Remote image storage and delivery.
- **dotenv**: Load local development credentials from `.env`.
- **express-session** and **connect-flash**: Session-backed, one-time status messages.
- **Passport**, **passport-local**, and **passport-local-mongoose**: Local username/password authentication and user credential support.
- **Bootstrap 5**: Responsive layout and interface components.
- **method-override**: Enables PATCH and DELETE requests from HTML forms.
- **Nodemon**: Development utility for automatically restarting the server.

## Project Structure

```text
Major_Project/
├── app.js                  # Express application and route definitions
├── controllers/
│   ├── listingController.js # Listing request handlers
│   ├── reviewController.js  # Review request handlers
│   └── userController.js    # Registration and session request handlers
├── middelware.js           # Login, ownership, and request-validation middleware
├── cloudConfig.js          # Cloudinary client and upload storage configuration
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Locked npm dependency versions
├── schema.js               # Joi schema for listing request validation
├── init/
│   ├── data.js             # Sample listing data
│   └── index.js            # Database reset and seed script
├── models/
│   ├── Listing.js          # Mongoose Listing schema and model
│   ├── review.js           # Mongoose Review schema and model
│   └── user.js             # Mongoose user model with local authentication
├── routes/
│   ├── listings.js         # Listing CRUD and image-upload routes
│   ├── review.js           # Nested review create and delete routes
│   └── user.js             # Registration and login routes
├── utils/
│   ├── ExpressError.js     # Custom HTTP error class
│   └── wrapAsync.js        # Async route error wrapper
├── public/
│   ├── css/
│   │   └── style.css       # Shared application styles
│   └── js/
│       └── script.js       # Client-side form validation
├── views/
│   ├── includes/           # Shared navbar, footer, and flash-alert partials
│   ├── layouts/            # Shared EJS layout
│   ├── error.ejs           # Shared application error page
│   ├── listings/
│   │   ├── index.ejs       # All listings page
│   │   ├── edit.ejs        # Edit listing form
│   │   ├── new.ejs         # New listing form
│   │   └── show.ejs        # Individual listing page
│   └── users/
│       ├── login.ejs        # Login form
│       └── signUp.ejs       # Registration form
└── README.md
```

The application follows MVC: Mongoose models define persisted data, controllers handle request logic, EJS views render pages, and route modules connect URL patterns to middleware and controller actions.

## Prerequisites

Install the following software before running the project:

- Node.js and npm
- MongoDB Community Server, running locally
- A Cloudinary account with an API key and secret for listing image uploads
- A browser

The application currently connects to this local MongoDB database:

```text
mongodb://127.0.0.1:27017/Wanderlust
```

No manual database or collection creation is required. MongoDB creates them when the first document is inserted.

## Installation

1. Open a terminal in the project directory.

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with your Cloudinary credentials:

   ```dotenv
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   ```

   The `.env` file is excluded by `.gitignore`. Never commit real credentials. In production, provide these values through the hosting provider's environment-variable settings.

4. Make sure MongoDB is running locally.

5. Start the application:

   ```bash
   node app.js
   ```

6. Open the application at [http://localhost:8080](http://localhost:8080).

## Development With Nodemon

Nodemon is included as a dependency. To restart the server automatically when files change, run:

```bash
npx nodemon app.js
```

## Seed the Database

The seed script removes the existing listings and inserts the sample data from `init/data.js`.

Run it from the project root:

```bash
node init/index.js
```

Because the script calls `deleteMany({})`, it deletes all existing documents in the `Listing` collection before inserting the sample records. Use it only when resetting the development database is intended.

## Application Routes

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Displays a basic root-directory message. |
| `GET` | `/signUp` | Displays the registration form. |
| `POST` | `/signUp` | Registers a user with username, email, and password; redirects with a success or error flash alert. |
| `GET` | `/login` | Displays the login form. |
| `POST` | `/login` | Authenticates with Passport's local strategy and starts a session; redirects with a success or failure alert. |
| `GET` | `/logout` | Ends the current Passport session and redirects to `/listings`. |
| `GET` | `/listings` | Fetches and displays all listings. |
| `GET` | `/listings/new` | Displays the new-listing form; requires login. |
| `POST` | `/listings` | Requires login, uploads the selected image to Cloudinary, validates listing fields, and creates a listing assigned to the current user. |
| `GET` | `/listings/:id/edit` | Displays a prefilled edit form; requires login and listing ownership. |
| `PATCH` | `/listings/:id` | Requires login and listing ownership, validates the request, and updates the listing. |
| `DELETE` | `/listings/:id` | Deletes a listing; requires login and listing ownership. |
| `GET` | `/listings/:id` | Fetches and displays one listing by its MongoDB ID; redirects to `/listings` with an error alert if it does not exist. |
| `POST` | `/listings/:id/reviews` | Validates and adds a review attributed to the logged-in user; requires login. |
| `DELETE` | `/listings/:id/reviews/:reviewId` | Deletes a review; requires login and review authorship. |

Edit and Delete controls are available on each listing's details page. Because standard HTML forms support GET and POST, the forms submit a `_method` field and `method-override` converts those submissions into PATCH or DELETE requests.

Listing create and update requests are validated with Joi before database writes. Unmatched routes produce a 404 error page. The create form sends multipart data for its image upload; `method-override` enables edit and delete actions from HTML forms.

### User Accounts

Registration and login forms are available at `/signUp` and `/login`. The user model uses `passport-local-mongoose` to manage local username/password credentials and stores an email address. Passport serializes authenticated users into the Express session. Successful registration and login and failed login attempts use flash alerts.

The navbar shows login/registration links when signed out and a logout link when signed in. Authorization is applied per route: listing creation requires login, listing edit and delete require login and listing ownership, review creation requires login, and review deletion requires login and review authorship.

Review creation is validated separately: each submitted review must include a rating from 1 to 5 and a non-empty comment. The rating form starts with no star selected and requires the user to choose one. Reviews store an `author` reference; listing detail pages populate it to display the author's username and render the rating as filled and unfilled stars. Deleting a listing also deletes its associated review documents.

### Flash Alerts

The application configures `express-session` before `connect-flash`, then exposes `success` and `error` messages as template locals. The shared `views/includes/flash.ejs` partial displays success messages as green Bootstrap alerts and errors as red alerts; each alert can be dismissed. Flash messages are stored in the session and consumed when the next request renders a page. Listing create, update, and delete actions and review create and delete actions set success messages before redirecting. Requests for a missing listing redirect to `/listings` with an error message. Validation and other thrown application errors render the error page directly instead of using a flash redirect.

## Listing Data Model

Each listing follows the Mongoose schema defined in `models/Listing.js`:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | String | Yes | Name of the property or accommodation. |
| `description` | String | No | Description of the listing. Required by Joi for create and update forms. |
| `image.filename` | String | No | Name associated with the image. |
| `image.url` | String | No | Image URL. A default image URL is provided. |
| `price` | Number | No | Price displayed for the listing. Required by Joi and must be zero or greater. |
| `location` | String | No | City, region, or area of the property. Required by Joi for create and update forms. |
| `country` | String | No | Country where the property is located. Required by Joi for create and update forms. |
| `reviews` | ObjectId references | No | Reviews associated with the listing. |
| `owner` | User ObjectId reference | No | User who owns the listing; used for edit/delete authorization. |

Each review is stored separately using the schema in `models/review.js` and referenced by its listing. Reviews contain a rating, comment, creation timestamp, and an `author` reference to the user who submitted it. The form requires a rating from 1 to 5 and a non-empty comment.

## Creating a Listing

The new-listing form submits URL-encoded fields using the `listing[...]` naming convention. Express parses the form body into a nested `req.body.listing` object with:

```js
app.use(express.urlencoded({ extended: true }));
```

The `listingSchema` in `schema.js` validates listing fields for both `POST /listings` and `PATCH /listings/:id`. Title, description, price, location, and country are required; price must be zero or greater. Joi converts the submitted price string to a number before it reaches Mongoose.

The new-listing form uses `multipart/form-data` and sends its image in the `listing[image][url]` file field. Multer passes the file to Cloudinary storage, which accepts PNG, JPG, and JPEG files and stores them in the `Wanderlust_DEV` folder. The controller saves Cloudinary's returned URL and filename on the listing. The edit form instead accepts an image URL as text; it does not upload a replacement file. Seed listings also use their sample external image URLs.

Invalid submissions are passed to the centralized error middleware as HTTP 400 errors. The middleware renders `views/error.ejs` for validation errors and other application errors, using HTTP 500 when an error does not specify a status. The error page uses the shared site layout and links back to `/listings`. Missing listing IDs on the edit and detail routes are handled separately with a redirect and a one-time error flash alert.

## Typical Workflow

1. Start MongoDB.
2. Run `node init/index.js` to load sample data.
3. Run `node app.js`.
4. Visit `/signUp` to create an account, or `/login` to sign in.
5. Visit `/listings` to browse the records.
6. Select **Add new Listing** while signed in and submit the form.
7. Select a listing to open its details page.
8. Add a rating and comment while signed in. Only the author can delete a review.
9. The listing owner can use **Edit** or **Delete**.
10. Confirm the changes on the listing details or listings page.

## Troubleshooting

### MongoDB connection error

Confirm that MongoDB is running and listening on `127.0.0.1:27017`. The application does not currently read the connection string from an environment variable.

### Port already in use

The server listens on port `8080`. Stop the process using that port or change the port in `app.js`.

### Listing does not appear after submission

Check the terminal for validation or database errors. Confirm that the form includes a title, since `title` is required by the schema.

### Cloudinary image upload fails

Confirm that `CLOUD_NAME`, `CLOUD_API_KEY`, and `CLOUD_API_SECRET` are set in the project-root `.env` file and that the Cloudinary account is active. The create form currently accepts PNG, JPG, and JPEG files. The edit form accepts an image URL rather than uploading a replacement file.

### Flash alert does not appear

Flash alerts appear on the page rendered after the action's redirect. Confirm that the session and flash middleware are enabled before the routes, and that the shared layout includes `views/includes/flash.ejs`. The current session store is Express's in-memory default and is intended for local development, not production.

## Current Limitations

- Database configuration is fixed to a local MongoDB instance.
- There is no automated test suite. The `npm test` script is only a placeholder and exits with an error.
- New listing images require Cloudinary credentials and are stored by Cloudinary; seeded listings and image URLs entered in the edit form may point to external hosts.
- `multer-storage-cloudinary@4` declares a peer dependency on Cloudinary `^1.21.0`, while this project declares Cloudinary `^2.11.0`. npm may report a peer-dependency warning; verify uploads with the installed versions and consider a storage adapter that declares Cloudinary 2.x support.
- Sessions use the default in-memory store, and the session secret is configured directly in `app.js`; both should be replaced with production-ready configuration before deployment.
- The MongoDB URL and application port are hard-coded in `app.js` and `init/index.js`. Only Cloudinary credentials currently come from environment variables.

## Possible Next Improvements

- Move the MongoDB URL, port, and session secret into environment variables.
- Support replacing listing images through the Cloudinary upload form on the edit page.
- Add automated route and model tests.

## License

The `package.json` declares the ISC license. There is no separate license file in the project.