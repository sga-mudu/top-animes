
import { getAllFavorites, removeFromFavorites } from '../javascript files/favorites.js';

document.addEventListener("DOMContentLoaded", () => {
    displayFavorites();
});

function displayFavorites() {
    const favoritesContainer = document.getElementById("favorites-container");
    if (!favoritesContainer) return;

    const favorites = getAllFavorites();
    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
            <p>You haven't liked any anime yet!</p>
        `;
        return;
    }

    favorites.forEach(anime => {
        console.log(anime);
//checks if anime exists or not 
//checks if the object has the required ID property
        if (anime && anime.mal_id) {
            displayAnimeCard(anime);
        }
    });
}

function displayAnimeCard(anime) {
    const favoritesContainer = document.getElementById("favorites-container");
    if (!favoritesContainer || !anime) return;

    const imageUrl = anime.images?.jpg?.image_url;
    const title = anime.title;
    const score = anime.score;
    const episodes = anime.episodes;
    const synopsis = anime.synopsis;

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = anime.mal_id;

    card.innerHTML = `
        <img src="${imageUrl}" 
             alt="${title}"
             class="main-picture">
        <h4>${title}</h4>
        <div class="overlay">
            <div class="details">
                <h4>${title}</h4>
                <span>Rating: ${score}</span>
                <span>Episodes: ${episodes}</span>
                <p>${synopsis}</p>
            </div>
            <button class="like-btn active">
                <img src="../icons/heart-full.svg" alt="">
            </button>
        </div>
    `;

    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
//stops bubbling from other button being clicked
        removeFromFavorites(anime.mal_id);
        card.remove();
        
        // Update display if no favorites left
        if (getAllFavorites().length === 0) {
            displayFavorites();
        }
    });

    card.querySelector(".details")?.addEventListener("click", () => {
        window.location.href = `details.html?id=${anime.mal_id}`;
    });

    favoritesContainer.appendChild(card);
}
