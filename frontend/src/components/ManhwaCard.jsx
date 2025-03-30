import "../css/ManhwaCard.css";
import { useState, useEffect } from "react";
import placeholderImage from "./placeholder.png"; // Import the local placeholder image

function ManhwaCard({ manhwa, onClick }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Skip non-Korean comics (just in case)
    if (manhwa.attributes.originalLanguage !== "ko") {
        return null;
    }

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

    // Extract the cover_art relationship
    const coverArt = manhwa.relationships?.find((rel) => rel.type === "cover_art");

    // Construct the image URL
    const imageUrl = coverArt
        ? `https://uploads.mangadex.org/covers/${manhwa.id}/${coverArt.attributes.fileName}.256.jpg`
        : placeholderImage; // Use the local placeholder image if cover_art is missing

    const genres = manhwa.attributes.tags
        ?.filter((tag) => tag.attributes.group === "genre")
        .map((tag) => tag.attributes.name.en)
        .join(", ") || "Unknown Genre";

    return (
        <div className="manhwa-card" onClick={onClick}>
            <div className="manhwa-poster">
                {!isImageLoaded && <div className="image-placeholder">Loading...</div>}
                <img
                    src={imageUrl}
                    alt={manhwa.attributes.title.en || "Unknown Title"}
                    onLoad={() => setIsImageLoaded(true)} // Set image as loaded
                    onError={(e) => {
                        e.target.src = placeholderImage; // Fallback to placeholder if loading fails
                        setIsImageLoaded(true);
                    }}
                    style={{ display: isImageLoaded ? "block" : "none" }} // Hide image until loaded
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