---

**Copilot Instructions for Next.js Backend Setup**

**Goal**: Implement the URL shortening and redirection backend logic within a new Next.js project based on the provided repository structure.

**Assumptions**:
* You have an existing Next.js project created (e.g., using `npx create-next-app`).
* You are comfortable navigating your project directory.

---

**Step 1: Install Backend Dependencies**

* **Instruction**: Open your project's terminal and install the required backend dependencies.
* **Command to execute**:
    ```bash
    npm install mongoose validator dotenv
    ```
* **Explanation**:
    * `mongoose`: ODM for MongoDB.
    * `validator`: For URL validation.
    * `dotenv`: To load environment variables from a `.env.local` file.

---

**Step 2: Configure Environment Variables**

* **Instruction**: Create a `.env.local` file at the root of your Next.js project and add your MongoDB connection string and the base domain for your shortened URLs.
* **File to create**: `.env.local`
* **Content to add**:
    ```dotenv
    MONGODB_URI=your_mongodb_connection_string_here
    BASE_DOMAIN=http://localhost:3000 # Or your deployed domain, e.g., [https://your-app.vercel.app](https://your-app.vercel.app)
    ```
* **Note**: Replace `your_mongodb_connection_string_here` with your actual MongoDB connection URI (e.g., from MongoDB Atlas). The `BASE_DOMAIN` should be your application's base URL.

---

**Step 3: Create Database Connection Utility**

* **Instruction**: Create a `lib` directory at the root of your project (if it doesn't exist) and then create `db.js` inside it for your MongoDB connection.
* **File to create**: `lib/db.js`
* **Content to add**:
    ```javascript
    // lib/db.js
    const mongoose = require('mongoose');

    let isConnected = false;

    const connectDB = async () => {
        if (isConnected) {
            console.log('Using existing database connection');
            return;
        }

        try {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urlshortener');
            isConnected = true;
            console.log('MongoDB connected');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    };

    module.exports = connectDB;
    ```
* **Citations**: The content is derived from `config/db.js` and `api/index.js` in the provided `repomix-output.xml`.

---

**Step 4: Define URL Mongoose Model**

* **Instruction**: Create a `models` directory at the root of your project (if it doesn't exist) and then create `Url.js` inside it to define your Mongoose schema for URLs.
* **File to create**: `models/Url.js`
* **Content to add**:
    ```javascript
    // models/Url.js
    const mongoose = require('mongoose');

    const urlSchema = new mongoose.Schema({
        longUrl: { type: String, required: true },
        shortCode: { type: String, required: true, unique: true },
        createdAt: { type: Date, default: Date.now },
        clicks: { type: Number, default: 0 },
    });

    module.exports = mongoose.models.URL || mongoose.model('URL', urlSchema);
    ```
* **Citations**: The content is derived from `models/url.js` in the provided `repomix-output.xml`.
* **Note**: `mongoose.models.URL || mongoose.model('URL', urlSchema)` is a common pattern in Next.js to prevent `OverwriteModelError`.

---

**Step 5: Create API Endpoint for URL Shortening**

* **Instruction**: Create the directory `pages/api` (if it doesn't exist) and then create `shorten.js` inside it. This will be your API endpoint for shortening URLs.
* **File to create**: `pages/api/shorten.js`
* **Content to add**:
    ```javascript
    // pages/api/shorten.js
    const connectDB = require('../../lib/db');
    const URL = require('../../models/Url');
    const validator = require('validator');

    function generateShortCode() {
        return Math.random().toString(36).substring(2, 8);
    }

    export default async function handler(req, res) {
        await connectDB(); // Ensure DB connection for each request

        if (req.method === 'POST') {
            try {
                const { long_url } = req.body;
                if (!long_url) {
                    return res.status(400).json({ error: 'URL is required' });
                }
                if (!validator.isURL(long_url)) {
                    return res.status(400).json({ error: 'Invalid URL format' });
                }

                let shortCode;
                let isUnique = false;
                while (!isUnique) {
                    shortCode = generateShortCode();
                    const existingUrl = await URL.findOne({ shortCode });
                    if (!existingUrl) {
                        isUnique = true;
                    }
                }

                const newUrl = new URL({ longUrl: long_url, shortCode });
                await newUrl.save();

                const baseDomain = process.env.BASE_DOMAIN;
                const shortUrl = `${baseDomain}/${shortCode}`;

                return res.status(201).json({ shortUrl, longUrl: long_url });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Server error' });
            }
        } else {
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    }
    ```
* **Citations**: This code integrates logic from `controllers/shortenController.js` and `routes/shorten.js` into a Next.js API route structure. It also uses the `connectDB` function from `lib/db.js`.

---

**Step 6: Create Dynamic Page for URL Redirection**

* **Instruction**: Create a file named `[shortCode].js` directly inside the `pages` directory. This will handle the redirection for shortened URLs.
* **File to create**: `pages/[shortCode].js`
* **Content to add**:
    ```javascript
    // pages/[shortCode].js
    const connectDB = require('../lib/db');
    const URL = require('../models/Url');

    export async function getServerSideProps(context) {
        await connectDB(); // Ensure DB connection

        const { shortCode } = context.params;

        if (!shortCode) {
            return {
                notFound: true,
            };
        }

        try {
            const urlEntry = await URL.findOne({ shortCode });

            if (!urlEntry) {
                return {
                    notFound: true,
                };
            }

            // Increment the click counter
            urlEntry.clicks = (urlEntry.clicks || 0) + 1;
            await urlEntry.save();

            // Redirect to the long URL
            return {
                redirect: {
                    destination: urlEntry.longUrl,
                    permanent: true, // Use 301 for permanent redirect
                },
            };
        } catch (error) {
            console.error('Redirection error:', error);
            // In case of a server error, you might want to redirect to a generic error page
            return {
                redirect: {
                    destination: '/error', // Or any other error page you have
                    permanent: false,
                },
            };
        }
    }

    // This component will not be rendered as we are using redirects in getServerSideProps
    export default function ShortCodePage() {
        return (
            <div>
                <h1>Redirecting...</h1>
                <p>If you are not redirected, please check the URL.</p>
            </div>
        );
    }
    ```
* **Citations**: This code adapts the `redirectToLongUrl` logic from `controllers/shortenController.js` for `getServerSideProps` in Next.js. It also uses the `connectDB` function from `lib/db.js`.

---

**Final Backend Structure in Next.js:**