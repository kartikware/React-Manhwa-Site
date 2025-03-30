import "../css/Favorites.css";
import React, { useState, useEffect } from "react";
import ManhwaCard from "../components/ManhwaCard";

function Favorites() {
    const [favorites, setFavorites] = useState([]);

    // Load favorites from localStorage
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        console.log("Loaded Favorites:", savedFavorites); // Debugging log

        // Normalize the data
        const normalizedFavorites = savedFavorites.map((manhwa) => ({
            id: manhwa.id || manhwa.mal_id || "unknown-id",
            attributes: manhwa.attributes || {
                title: { en: manhwa.title || "Unknown Title" },
                year: manhwa.published?.prop?.from?.year || "Unknown Year",
            },
            coverFileName: manhwa.coverFileName || manhwa.images?.jpg?.image_url || null,
        }));

        setFavorites(normalizedFavorites);
    }, []);

    // Handle favorite toggle
    const handleFavoriteToggle = (id) => {
        const updatedFavorites = favorites.filter((fav) => fav.id !== id);
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    return (
        <div className="Favorites_empty">
            {favorites.length === 0 ? (
                <>
                    <h2>😔 No Favorite Manhwas Yet!</h2>
                    <p>✨ Start exploring and add your favorite Manhwas to this list! 🌟</p>
                </>
            ) : (
                <div className="Manhwas-grid">
                    {favorites.map((manhwa) => (
                        <ManhwaCard
                            key={manhwa.id}
                            manhwa={manhwa}
                            onFavorite={() => handleFavoriteToggle(manhwa.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorites;