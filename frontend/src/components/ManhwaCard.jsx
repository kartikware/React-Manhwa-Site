import "../css/ManhwaCard.css";
import { useState, useEffect } from "react";
import placeholderImage from "./placeholder.png"; // Import the placeholder image

function ManhwaCard({ manhwa, onClick }) {
    const [isFavorite, setIsFavorite] = useState(false);

    // Check if the manhwa is already in favorites
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const isAlreadyFavorite = savedFavorites.some((fav) => fav.id === manhwa.id);
        setIsFavorite(isAlreadyFavorite);
    }, [manhwa.id]);

    // Toggle favorite status
    const toggleFavorite = () => {
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (isFavorite) {
            const updatedFavorites = savedFavorites.filter((fav) => fav.id !== manhwa.id);
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            setIsFavorite(false);
        } else {
            const updatedFavorites = [...savedFavorites, manhwa];
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            setIsFavorite(true);
        }
    };

    const imageUrl = manhwa.coverFileName
        ? manhwa.coverFileName.startsWith("http")
            ? manhwa.coverFileName
            : `https://uploads.mangadex.org/covers/${manhwa.id}/${manhwa.coverFileName}.256.jpg`
        : placeholderImage; // Use placeholder if no coverFileName is available

    const genres = manhwa.attributes.tags
        ?.filter((tag) => tag.attributes.group === "genre")
        .map((tag) => tag.attributes.name.en)
        .join(", ") || "Unknown Genre";

    return (
        <div className="manhwa-card" onClick={onClick}>
            <div className="manhwa-poster">
                <img
                    src={imageUrl}
                    alt={manhwa.attributes.title.en || "Unknown Title"}
                    onError={(e) => (e.target.src = placeholderImage)} // Fallback to placeholder if loading fails
                />
                <button
                    className={`favorite-btn-corner ${isFavorite ? "favorite" : ""}`}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent click from propagating to the overlay trigger
                        toggleFavorite();
                    }}
                >
                    {isFavorite ? "❤️" : "🤍"}
                </button>
            </div>
            <div className="manhwa-info">
                <h3>{manhwa.attributes.title.en || "Unknown Title"}</h3>
                <p>{genres}</p>
            </div>
        </div>
    );
}

export default ManhwaCard;