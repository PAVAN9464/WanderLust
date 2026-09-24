# Wanderlust

Wanderlust is a server-rendered travel-listing application built with Node.js, Express, MongoDB, Mongoose, and EJS. Users can browse available listings, view listing details, add new properties, and manage existing listings through a responsive Bootstrap interface.

## Features

- Display all travel listings.
- View the details of an individual listing.
- Add a new listing through an HTML form.
- Edit an existing listing from its details page.
- Delete an existing listing from its details page.
- Store listing data in MongoDB using Mongoose.
- Seed the database with sample travel listings.
- Render pages on the server with EJS templates.
- Display listing images from the nested `image.url` field.
- Use shared layouts with a responsive navbar and footer.
- Provide Airbnb-inspired styling for edit and update actions.

## Technology Stack

- **Node.js**: JavaScript runtime.
- **Express**: Web server and routing framework.
- **MongoDB**: Database for storing listings.
- **Mongoose**: MongoDB object modeling library.
- **EJS**: Server-side HTML templating engine.
- **method-override**: Enables PATCH and DELETE requests from HTML forms.
- **Nodemon**: Development utility for automatically restarting the server.

## Project Structure

```text
Major_Project/
├── app.js                  # Express application and route definitions
├── package.json            # Project metadata and dependencies
├── init/
│   ├── data.js             # Sample listing data
│   └── index.js            # Database reset and seed script
├── models/
│   └── Listing.js          # Mongoose Listing schema and model
├── public/
│   └── css/
│       └── style.css       # Shared application styles
├── views/
│   ├── includes/           # Shared navbar and footer partials
│   ├── layouts/             # Shared EJS layout
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
| `GET` | `/listings/:id/edit` | Displays a prefilled edit form for one listing. |
| `PATCH` | `/listings/:id` | Updates one listing and redirects to its details page. |
| `DELETE` | `/listings/:id` | Deletes one listing and redirects to `/listings`. |
| `GET` | `/listings/:id` | Fetches and displays one listing by its MongoDB ID. |

Edit and Delete controls are available on each listing's details page. Because standard HTML forms support GET and POST, the forms submit a `_method` field and `method-override` converts those submissions into PATCH or DELETE requests.

## Listing Data Model

Each listing follows the schema defined in `models/Listing.js`:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | String | Yes | Name of the property or accommodation. |
| `description` | String | No | Description of the listing. |
| `image.filename` | String | No | Name associated with the image. |
| `image.url` | String | No | Image URL. A default image URL is provided. |
| `price` | Number | No | Price displayed for the listing. |
| `location` | String | No | City, region, or area of the property. |
| `country` | String | No | Country where the property is located. |

## Creating a Listing

The new-listing form submits URL-encoded fields using the `listing[...]` naming convention. Express parses this body with:

```js
app.use(express.urlencoded({ extended: true }));
```

The create route reads the nested object, saves it through Mongoose, and redirects after a successful save:

```js
const newListing = new Listing(req.body.listing);
await newListing.save();
res.redirect("/listings");
```

## Typical Workflow

1. Start MongoDB.
2. Run `node init/index.js` to load sample data.
3. Run `node app.js`.
4. Visit `/listings` to browse the records.
5. Select **Add new Listing**.
6. Submit the form.
7. Select a listing to open its details page.
8. Use **Edit** to update the listing or **Delete** to remove it.
9. Confirm the changes on the listings page.

## Troubleshooting

### MongoDB connection error

Confirm that MongoDB is running and listening on `127.0.0.1:27017`. The application does not currently read the connection string from an environment variable.

### Port already in use

The server listens on port `8080`. Stop the process using that port or change the port in `app.js`.

### Listing does not appear after submission

Check the terminal for validation or database errors. Confirm that the form includes a title, since `title` is required by the schema.

### Image field behavior

The schema stores images as an object with `filename` and `url` properties. The new and edit forms submit image URLs through `listing[image][url]`, and listing pages render them with `listing.image.url`. Listings without a custom image use the schema's default image URL.

## Current Limitations

- There is no authentication or authorization.
- There is no centralized error-handling middleware.
- Database configuration is fixed to a local MongoDB instance.
- There are no automated tests or test script configured.
- Form validation is basic and relies primarily on the Mongoose schema.
- Images are loaded from external URLs rather than uploaded and stored locally.

## Possible Next Improvements

- Add server-side validation and user-friendly error pages.
- Add a shared header/footer layout and responsive styling.
- Move the MongoDB URL and port into environment variables.
- Add image upload or validated image URL support.
- Add authentication for listing management.
- Add automated route and model tests.

## License

This project does not currently specify a license.