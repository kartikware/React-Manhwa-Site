import "../css/Home.css";
import ManhwaCard from "../components/ManhwaCard";
import Spinner from "../components/Spinner";
import { useState, useEffect } from "react";
import React from "react";

function Home({ setResetHomeCallback }) {
    const [searchQuery, setSearchQuery] = useState(""); // Search input state
    const [manhwas, setManhwas] = useState([]); // List of manhwas
    const [loading, setLoading] = useState(false); // Loading state
    const [page, setPage] = useState(1); // Page for infinite scrolling
    const [hasMore, setHasMore] = useState(true); // To check if more data is available
    const [showTopButton, setShowTopButton] = useState(false); // Show "Go to Top" button

    // Fetch manhwas from MangaDex API
    const fetchManhwas = async (query = "", page = 1) => {
        setLoading(true);
        console.log(`Fetching manhwas for query: "${query}" and page: ${page}`);
        try {
            const limit = 30; // Number of results per page
            const offset = (page - 1) * limit; // Calculate offset for pagination
            const url = `https://api.mangadex.org/manga?title=${query}&limit=${limit}&offset=${offset}&contentRating[]=safe&contentRating[]=suggestive&originalLanguage[]=ko`;
            console.log("API URL:", url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("API Response:", data);

            if (!data.data || data.data.length === 0) {
                console.log("No more data to load.");
                setHasMore(false); // No more data to load
                return;
            }

            // Fetch cover details for each manhwa
            const manhwasWithCovers = await Promise.all(
                data.data.map(async (manhwa) => {
                    const coverArt = manhwa.relationships.find(
                        (rel) => rel.type === "cover_art"
                    );

                    if (coverArt) {
                        const coverResponse = await fetch(
                            `https://api.mangadex.org/cover/${coverArt.id}`
                        );
                        const coverData = await coverResponse.json();
                        manhwa.coverFileName = coverData.data.attributes.fileName;
                    }

                    return manhwa;
                })
            );

            console.log("Processed Manhwas:", manhwasWithCovers);

            setManhwas((prevManhwas) =>
                page === 1 ? manhwasWithCovers : [...prevManhwas, ...manhwasWithCovers]
            );
        } catch (error) {
            console.error("Error fetching manhwas:", error);
            alert("Failed to fetch manhwas. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch popular manhwas on initial load
    useEffect(() => {
        fetchManhwas("", 1); // Fetch the first 30 manhwas on mount
    }, []);

    // Fetch more manhwas when the page changes
    useEffect(() => {
        if (page > 1) {
            fetchManhwas(searchQuery, page);
        }
    }, [page]);

    // Handle search functionality
    const handleSearch = (e) => {
        e.preventDefault(); // Prevent form submission
        setPage(1); // Reset the page to 1
        setManhwas([]); // Clear the current manhwas
        setHasMore(true); // Reset hasMore for new search
        fetchManhwas(searchQuery, 1); // Fetch search results
    };

    // Infinite scrolling
    const handleScroll = () => {
        console.log("Checking scroll position...");
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100 &&
            !loading &&
            hasMore
        ) {
            console.log("Reached bottom of the page. Loading more...");
            setPage((prevPage) => prevPage + 1); // Increment the page number
        }
    };

    // Attach the scroll event listener
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore]);

    // Debounced search effect
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim()) {
                setPage(1); // Reset the page to 1
                setManhwas([]); // Clear the current manhwas
                setHasMore(true); // Reset hasMore for new search
                fetchManhwas(searchQuery, 1); // Fetch search results
            }
        }, 500); // 500ms debounce delay

        return () => clearTimeout(delayDebounce); // Cleanup timeout on query change
    }, [searchQuery]);

    // Show "Go to Top" button when scrolling down
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowTopButton(true);
            } else {
                setShowTopButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (setResetHomeCallback) {
            setResetHomeCallback(() => resetHome);
        }
    }, [setResetHomeCallback]);

    const resetHome = () => {
        setSearchQuery(""); // Clear the search query
        setPage(1); // Reset the page
        setManhwas([]); // Clear the current manhwas
        setHasMore(true); // Reset hasMore for new search
        fetchManhwas("", 1); // Fetch the initial manhwas
    };

    return (
        <div className="home">
            <form className="search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search for manhwas..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>
            <div className="Manhwas-grid">
                {manhwas.map((manhwa, index) => (
                    <ManhwaCard
                        manhwa={manhwa}
                        key={`${manhwa.id}-${index}`}
                    />
                ))}
            </div>
            {loading && <Spinner />}
            {!hasMore && !loading && <p>No more results to load.</p>}
            {showTopButton && (
                <button
                    className="go-to-top-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    ↑
                </button>
            )}
        </div>
    );
}

export default Home;