const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5001; // Change the port to 5001 or any other available port

// Enable CORS
app.use(cors());

// Proxy route for the MangaDex API
app.get("/api/manga", async (req, res) => {
    console.log("Received query parameters:", req.query);

    const fixedQuery = {
        title: req.query.title || "",
        limit: req.query.limit || 30,
        offset: req.query.offset || 0,
        contentRating: Array.isArray(req.query.contentRating)
            ? req.query.contentRating
            : [req.query.contentRating].filter(Boolean),
        originalLanguage: ["ko"], // Filter for manhwas (Korean comics)
    };

    console.log("Fixed query parameters:", fixedQuery);

    try {
        // Fetch the list of manhwas
        const response = await axios.get("https://api.mangadex.org/manga", {
            params: fixedQuery,
        });

        const mangaList = response.data.data;

        // Fetch relationships for each manhwa
        const mangaWithRelationships = await Promise.all(
            mangaList.map(async (manga) => {
                const mangaDetails = await axios.get(
                    `https://api.mangadex.org/manga/${manga.id}`,
                    {
                        params: {
                            "includes[]": ["cover_art", "author", "artist"],
                        },
                    }
                );
                return { ...manga, relationships: mangaDetails.data.data.relationships };
            })
        );

        res.json({ data: mangaWithRelationships });
    } catch (error) {
        console.error("Error fetching data from MangaDex API:", error.response?.data || error.message);
        res.status(500).send("Error fetching data");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});