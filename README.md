# Wanderlust

Wanderlust is a server-rendered travel-listing application built with Node.js, Express 5, MongoDB, Mongoose, and EJS. Users can browse available listings, view listing details, and create, update, or delete listings through a responsive Bootstrap interface. Listing submissions are validated with Joi, and application errors are rendered through a shared EJS error page.

## Features

- Display all travel listings.
- View the details of an individual listing.
- Add a new listing through an HTML form.
- Edit an existing listing from its details page.
- Delete an existing listing from its details page.
- Add and delete 1-5-star reviews on a listing.
- Store listing data in MongoDB using Mongoose.
- Associate reviews with listings and remove their reviews when a listing is deleted.
- Seed the database with sample travel listings.
- Validate listing create and update submissions with Joi.
- Render not-found, validation, and other application errors with a shared error page.
- Show one-time success and error flash alerts after listing and review actions.
- Render pages on the server with EJS templates.
- Display listing images from the nested `image.url` field.
- Use shared layouts with a responsive navbar and footer.
- Provide Airbnb-inspired styling for edit and update actions.

## Technology Stack

- **Node.js**: JavaScript runtime.
- **Express 5**: Web server and routing framework.
- **MongoDB**: Database for storing listings.
- **Mongoose**: MongoDB object modeling library.
- **EJS**: Server-side HTML templating engine.
- **EJS-Mate**: Shared EJS layouts and template support.
- **Joi**: Server-side validation for listing form data.
- **express-session** and **connect-flash**: Session-backed, one-time status messages.
- **Bootstrap 5**: Responsive layout and interface components.
- **method-override**: Enables PATCH and DELETE requests from HTML forms.
- **Nodemon**: Development utility for automatically restarting the server.

## Project Structure

```text
Major_Project/
├── app.js                  # Express application and route definitions
├── package.json            # Project metadata and dependencies
├── schema.js               # Joi schema for listing request validation
├── init/
│   ├── data.js             # Sample listing data
│   └── index.js            # Database reset and seed script
├── models/
│   ├── Listing.js          # Mongoose Listing schema and model
│   └── review.js           # Mongoose Review schema and model
├── routes/
│   ├── listings.js         # Listing CRUD routes
│   └── review.js           # Nested review create and delete routes
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
│   ├── layouts/             # Shared EJS layout
│   ├── error.ejs            # Shared application error page
│   └── listings/
│       ├── index.ejs       # All listings page
│       ├── edit.ejs        # Edit listing form
│       ├── new.ejs         # New listing form
│       └── show.ejs        # Individual listing page
└── README.md
```

## Prerequisites

Install the following software before running the project:

- Node.js and npm
- MongoDB Community Server, running locally
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

3. Make sure MongoDB is running locally.

4. Start the application:

   ```bash
   node app.js
   ```

5. Open the application at [http://localhost:8080](http://localhost:8080).

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
| `GET` | `/listings` | Fetches and displays all listings. |
| `GET` | `/listings/new` | Displays the form for creating a listing. |
| `POST` | `/listings` | Creates a listing from submitted form data, saves it, and redirects to `/listings`. |
| `GET` | `/listings/:id/edit` | Displays a prefilled edit form; redirects to `/listings` with an error alert if the listing does not exist. |
| `PATCH` | `/listings/:id` | Updates one listing, flashes a success alert, and redirects to its details page. |
| `DELETE` | `/listings/:id` | Deletes one listing, flashes a success alert, and redirects to `/listings`. |
| `GET` | `/listings/:id` | Fetches and displays one listing by its MongoDB ID; redirects to `/listings` with an error alert if it does not exist. |
| `POST` | `/listings/:id/reviews` | Validates and adds a review, flashes a success alert, and redirects to the listing details page. |
| `DELETE` | `/listings/:id/reviews/:reviewId` | Removes a review, flashes a success alert, and redirects to its listing's details page. |

Edit and Delete controls are available on each listing's details page. Because standard HTML forms support GET and POST, the forms submit a `_method` field and `method-override` converts those submissions into PATCH or DELETE requests.

The create and update routes validate their submitted listing data before writing it to MongoDB. Unmatched routes produce a 404 error page.

Review creation is validated separately: each submitted review must include a rating from 1 to 5 and a non-empty comment. Listing detail pages populate and display their reviews. Deleting a listing also deletes its associated review documents.

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

Each review is stored separately using the schema in `models/review.js` and referenced by its listing. Reviews contain a rating, comment, and creation timestamp. The form requires a rating from 1 to 5 and a non-empty comment.

## Creating a Listing

The new-listing form submits URL-encoded fields using the `listing[...]` naming convention. Express parses the form body into a nested `req.body.listing` object with:

```js
app.use(express.urlencoded({ extended: true }));
```

The `listingSchema` in `schema.js` validates this object for both `POST /listings` and `PATCH /listings/:id`. Title, description, price, location, and country are required; price must be zero or greater. The image URL is optional, but a non-empty value must be a valid URI. Joi converts the submitted price string to a number before it reaches Mongoose.

Invalid submissions are passed to the centralized error middleware as HTTP 400 errors. The middleware renders `views/error.ejs` for validation errors and other application errors, using HTTP 500 when an error does not specify a status. The error page uses the shared site layout and links back to `/listings`. Missing listing IDs on the edit and detail routes are handled separately with a redirect and a one-time error flash alert.

## Typical Workflow

1. Start MongoDB.
2. Run `node init/index.js` to load sample data.
3. Run `node app.js`.
4. Visit `/listings` to browse the records.
5. Select **Add new Listing**.
6. Submit the form.
7. Select a listing to open its details page.
8. Add a rating and comment in the review form, or delete an existing review.
9. Use **Edit** to update the listing or **Delete** to remove it.
10. Confirm the changes on the listing details or listings page.

## Troubleshooting

### MongoDB connection error

Confirm that MongoDB is running and listening on `127.0.0.1:27017`. The application does not currently read the connection string from an environment variable.

### Port already in use

The server listens on port `8080`. Stop the process using that port or change the port in `app.js`.

### Listing does not appear after submission

Check the terminal for validation or database errors. Confirm that the form includes a title, since `title` is required by the schema.

### Flash alert does not appear

Flash alerts appear on the page rendered after the action's redirect. Confirm that the session and flash middleware are enabled before the routes, and that the shared layout includes `views/includes/flash.ejs`. The current session store is Express's in-memory default and is intended for local development, not production.

### Image field behavior

The schema stores images as an object with `filename` and `url` properties. The new and edit forms submit image URLs through `listing[image][url]`, and listing pages render them with `listing.image.url`. Listings without a custom image use the schema's default image URL.

## Current Limitations

- There is no authentication or authorization; listing and review actions are available to all visitors.
- Database configuration is fixed to a local MongoDB instance.
- There is no automated test suite. The `npm test` script is only a placeholder and exits with an error.
- Images are loaded from external URLs rather than uploaded and stored locally.
- Sessions use the default in-memory store, and the session secret is configured directly in `app.js`; both should be replaced with production-ready configuration before deployment.

## Possible Next Improvements

- Move the MongoDB URL and port into environment variables.
- Add image uploads instead of relying only on external image URLs.
- Add authentication for listing management.
- Add automated route and model tests.

## License

The `package.json` declares the ISC license. There is no separate license file in the project.