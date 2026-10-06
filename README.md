# Wanderlust

Wanderlust is a server-rendered travel-listing app built with Node.js, Express, MongoDB, Mongoose, and EJS. Visitors can browse and search accommodation listings, read reviews, and view a listing's location on a map. Registered users can create listings and reviews; listing owners can edit or delete their listings, and review authors can delete their own reviews.

## Features

- Browse listings and open each listing's details, reviews, and map.
- Search from the centered navbar by partial, case-insensitive matches in a listing's title, location, or country.
- Clear a search with the search input's built-in clear (`x`) control.
- Register and sign in with a username and password; user accounts also store an email address.
- Create and edit listings with Cloudinary-hosted image uploads.
- Forward-geocode listing locations with Mapbox and save GeoJSON coordinates.
- Create 1–5 star reviews and comments; delete reviews authored by the signed-in user.
- Restrict listing edits and deletions to the listing owner.
- Show success and error flash messages and a shared application error page.
- Seed the database with sample listings.

## Technology

- Node.js (the package manifest specifies Node `24.12.0`) and Express 5
- MongoDB and Mongoose
- EJS and EJS-Mate
- Passport, `passport-local`, and `passport-local-mongoose`
- Joi request validation
- Multer and `multer-storage-cloudinary` for Cloudinary uploads
- Mapbox Geocoding SDK and Mapbox GL JS
- `express-session`, `connect-mongo`, and `connect-flash`
- Bootstrap 5 and custom CSS

## Project Structure

```text
Major_Project/
├── app.js                    # Express setup, middleware, and application routes
├── cloudConfig.js            # Cloudinary client and upload storage
├── middelware.js             # Authentication, authorization, and Joi validation
├── package.json              # Runtime requirements and dependencies
├── package-lock.json         # Locked npm dependency versions
├── .gitignore                 # Excludes installed dependencies and local environment file
├── schema.js                 # Joi listing and review schemas
├── controllers/
│   ├── listingController.js  # Listing search and CRUD handlers
│   ├── reviewController.js   # Review create and delete handlers
│   └── userController.js     # Registration, login, and logout handlers
├── init/
│   ├── data.js               # Sample listings
│   └── index.js              # Database seed script
├── models/
│   ├── Listing.js            # Listing model and review cleanup hook
│   ├── review.js             # Review model
│   └── user.js               # User model with local authentication
├── public/
│   ├── css/style.css         # Shared styles
│   └── js/
│       ├── map.js            # Listing detail map
│       └── script.js         # Search clear behavior and form validation
├── routes/
│   ├── listings.js           # Listing routes
│   ├── review.js             # Nested review routes
│   └── user.js               # Registration and authentication routes
├── utils/
│   ├── ExpressError.js       # Application HTTP error class
│   └── wrapAsync.js          # Async Express route wrapper
└── views/
    ├── error.ejs             # Shared application error page
    ├── includes/             # Navbar, footer, and flash alerts
    ├── layouts/              # Shared page layout
    ├── listings/             # Listing index, create, edit, and detail pages
    └── users/                 # Sign-up and login pages
```

## Prerequisites

- Node.js and npm. The `package.json` declares Node `24.12.0`.
- A MongoDB deployment (local MongoDB or MongoDB Atlas) reachable by the app and seed script.
- A Cloudinary account for listing image uploads.
- A Mapbox access token with Geocoding API and map-style access.

## Configuration

Create a `.env` file in the project root:

```dotenv
ATLAS_URL=mongodb://127.0.0.1:27017/Wanderlust
SESSION_SECRET=replace_with_a_long_random_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_access_token
```

Set `ATLAS_URL` to your MongoDB connection string. `SESSION_SECRET` is used for Express session signing and Mongo session-store encryption. Cloudinary variables are used for image storage. `MAP_TOKEN` is used by server-side geocoding and is also sent to the browser for Mapbox GL, so use a public token with appropriate URL restrictions for client use.

The `.env` file is excluded by `.gitignore`; do not commit credentials. In production, configure these values in the hosting environment. `app.js` loads dotenv outside production; production deployments must provide environment variables directly. The application listens on port `8080`, which is currently set in `app.js`.

## Install and Run

From the project root:

```bash
npm install
node app.js
```

Open [http://localhost:8080](http://localhost:8080). The root path `/` redirects to `/listings`.

For development with automatic restarts:

```bash
npx nodemon app.js
```

## Seed Sample Listings

With `ATLAS_URL` and `MAP_TOKEN` configured, run:

```bash
node init/index.js
```

The script connects to MongoDB and geocodes every sample listing before deleting existing listing documents. If geocoding fails, it exits before deleting the existing listings. If geocoding succeeds, it deletes all listings and inserts the sample set; do not run it on a database whose listings you need to keep. The script assigns seeded listings a fixed owner ID and does not create that user account, so the seeded owner reference may not correspond to a user in your database.

## Browse and Search

The navbar search submits a GET request to `/listings` with a `location` query parameter. The controller trims the term, limits it to 100 characters, escapes regular-expression characters, and searches `title`, `location`, and `country` with case-insensitive partial matching. For example:

```text
/listings?location=Goa
```

Search results retain the query in the input and display a search-results heading. Clearing the input with its built-in `x` control returns to `/listings` without a query and shows all listings. If there are no matches, the page displays a no-results message.

## Application Routes

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Redirects to `/listings`. |
| `GET` | `/listings` | Displays all listings or searches by the optional `location` query. |
| `GET` | `/listings/new` | Displays the new-listing form; login required. |
| `POST` | `/listings` | Uploads the image, validates listing fields, geocodes the location, and creates a listing; login required. |
| `GET` | `/listings/:id` | Displays one listing, its reviews, and its map when geometry is available. |
| `GET` | `/listings/:id/edit` | Displays the edit form; login and listing ownership required. |
| `PATCH` | `/listings/:id` | Validates and updates a listing, geocoding its location and optionally replacing its image; login and ownership required. |
| `DELETE` | `/listings/:id` | Deletes a listing and its associated review documents; login and ownership required. |
| `POST` | `/listings/:id/reviews` | Creates a validated review for a listing; login required. |
| `DELETE` | `/listings/:id/reviews/:reviewId` | Deletes a review; login and review authorship required. |
| `GET` | `/signUp` | Displays registration. |
| `POST` | `/signUp` | Registers and signs in a user. |
| `GET` | `/login` | Displays login. |
| `POST` | `/login` | Authenticates with Passport and redirects to the saved destination or listings page. |
| `GET` | `/logout` | Logs out the current user and redirects to `/listings`. |

The navbar footer includes `/privacy` and `/terms` links, but those routes are not currently implemented.

## Listings, Images, and Maps

Listing fields include a required title and GeoJSON `Point` geometry, plus description, image metadata, price, location, country, owner, and review references. The Joi schema requires a non-empty title, description, location, and country and a non-negative price.

Listing forms use multipart encoding. Multer stores uploaded images in the Cloudinary `Wanderlust_DEV` folder, allows PNG/JPG/JPEG formats through Cloudinary storage, and limits uploads to 5 MB. The edit form preserves the current image when no replacement is chosen. A too-large upload is reported as HTTP 413.

When creating or updating a listing, the server geocodes the submitted location and country with Mapbox and saves the returned GeoJSON `Point`. Coordinates are ordered `[longitude, latitude]`. On the detail page, listings with valid coordinates and a configured map token show a Mapbox GL map and marker. If an older listing has no valid geometry, the detail handler attempts to geocode and persist it when the token and address are available.

## Reviews and User Access

Reviews are separate MongoDB documents referenced by their listing. Each review has an author, a rating from 1 to 5, a comment, and a creation date. The detail page shows review authors and star ratings. Users must be signed in to create reviews and can delete only their own reviews. Listing edit and delete actions are restricted to the listing owner.

Passport local authentication stores user credentials through `passport-local-mongoose`. Sessions are stored in MongoDB using `connect-mongo`; `connect-flash` provides one-time success and error messages. When login is required for a page or action, the intended URL is saved and used as the post-login redirect.

## Errors and Validation

Listing and review request bodies are validated with Joi before database writes. Async route errors are forwarded through the shared error middleware, which renders `views/error.ejs`. Missing listing and review records use 404 errors where handled by the route/controller. The middleware also maps oversized image uploads to HTTP 413.

## Tests

There is currently no automated test suite. The `npm test` script in `package.json` is a placeholder that exits with an error.

## Known Limitations

- The MongoDB URL and server port are configured through the source/environment as described above; the port is fixed at `8080`.
- The seed script replaces every listing and assigns a fixed owner ID; it is intended for development data only.
- The footer's Privacy and Terms links point to routes that are not implemented.
- The application supports listing and review management but does not currently implement booking or payment flows.
- Session cookies and credentials should be reviewed and hardened for the production hosting environment.

## License

`package.json` declares the ISC license. There is no separate license file in the project.
