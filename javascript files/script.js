import { apiBase, fetchData } from "../javascript files/api.js";
import { checkIfLiked, addToFavorites, removeFromFavorites } from "../javascript files/favorites.js";


const loadingSpinner = document.querySelector(".loading-spinner");

document.addEventListener("DOMContentLoaded", () => {
    const getElement = (selector, isId = false) => {
        const el = isId 
            ? document.getElementById(selector)
            : document.querySelector(selector);
        if (!el) console.error(`${isId ? 'ID' : 'Element'} "${selector}" not found`);
        return el;
    };

    const searchBtn = getElement('.search-button');
    const inputField = getElement('.input-here');
    const animeContainer = getElement('anime-container', true);
    const loadingSpinner = getElement('.loading-spinner');

    // If any critical elements are missing, show error and stop
    if (!searchBtn || !inputField || !animeContainer || !loadingSpinner) {
        if (animeContainer) {
            animeContainer.innerHTML = `
                <div class="error">
                    <h3>Page Loading Error</h3>
                    <p>Required elements missing. Please check:</p>
                    <ul>
                        ${!searchBtn ? '<li>Search button (.search-button)</li>' : ''}
                        ${!inputField ? '<li>Input field (.input-here)</li>' : ''}
                        ${!animeContainer ? '<li>Anime container (#anime-container)</li>' : ''}
                    </ul>
                    <button onclick="window.location.reload()">Refresh Page</button>
                </div>
            `;
        }
        return;
    }

    let debounceTimer;


    async function getInfo() {
        showLoading();
        try {
            const animeData = await fetchData(`${apiBase}/top/anime`);
            const topAnime = animeData.data;
            const animeContainer = document.getElementById("anime-container");

            if (!animeContainer) return;

            animeContainer.innerHTML = "";
            topAnime.forEach(anime => {
                const isLiked = checkIfLiked(anime.mal_id);
                displayAnimeCards(anime, isLiked);
            });
        } catch (error) {
            console.error("Failed to load animes:", error);
            alert("Failed to load animes. Try again.");
        } finally {
            hideLoading();
        }
    }

    async function searchBut() {
        const query = inputField.value.trim();
        if (query !== "") {
            showLoading();
            try {
                const searchResults = await fetchData(`${apiBase}/anime?q=${encodeURIComponent(query)}`);
                animeContainer.innerHTML = "";

                if (searchResults.data?.length > 0) {
                    searchResults.data.forEach(anime => {
                        const isLiked = checkIfLiked(anime.mal_id);
                        displayAnimeCards(anime, isLiked);
                    });
                } else {
                    animeContainer.innerHTML = "<p>No anime found. Try again</p>";
                }
            } catch (error) {
                console.error("Search failed:", error);
                alert("Failed to search. Try again");
            } finally {
                hideLoading();
            }
        } else {
            alert("Please enter an anime name!");
        }
    }

    function preventApiSpam(e) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = e.target.value.trim();
            if (query) searchBut();
        }, 500);
    }

    // Set up event listeners
    function setupEventListeners() {
        // Use event delegation for like buttons
        document.addEventListener("click", (e) => {
            if (e.target.closest(".like-btn")) {
                likeBut(e);
            }
        });

        searchBtn.addEventListener("click", searchBut);
        inputField.addEventListener("input", preventApiSpam);
    }

    setupEventListeners();

    // Initial data load
    getInfo();
});


export const showLoading = () => loadingSpinner.style.display = "flex";
export const hideLoading = () => loadingSpinner.style.display = "none";


function displayAnimeCards(anime, isLiked = false) {
    const cardContainer = document.getElementById("anime-container");
    if (!cardContainer) return;
    
    const div = document.createElement("div");
    div.className = "card";
    div.dataset.id = anime.mal_id;

    div.innerHTML = `
        <img src="${anime.images.jpg.image_url}" 
             alt="${anime.title}"
             class="main-picture">
        <h4>${anime.title}</h4>
        <div class="overlay">
            <div class="details">
                <h4>${anime.title}</h4>
                <span>Rating: ${anime.score || 'N/A'}</span>
                <span>Episodes: ${anime.episodes || 'N/A'}</span>
                <p>${anime.synopsis || 'No synopsis available.'}</p>
            </div>
            <button class="like-btn ${isLiked ? 'active' : ''}">
                <img src="${isLiked ? '../icons/heart-full.svg' : '../icons/heart-outline.svg'}" alt="">
            </button>
        </div>
    `;

    div.querySelector(".details")?.addEventListener("click", () => {
        window.location.href = `./html files/details.html?id=${anime.mal_id}`;
    });

    cardContainer.appendChild(div);
}

function likeBut(e) {
    const likeBtn = e.target.closest(".like-btn");
    if (!likeBtn) return;

    const card = likeBtn.closest(".card");
    const animeId = card?.dataset.id;
    if (!animeId) return;

    const isActive = !likeBtn.classList.contains("active");
    likeBtn.classList.toggle("active", isActive);
    
    // Update path to match actual deployment structure
    likeBtn.innerHTML = `
        <img src="${isActive ? 'icons/heart-full.svg' : 'icons/heart-outline.svg'}" >
    `;
        
    // Get the anime data from the card
    const anime = {
        mal_id: animeId,
        title: card.querySelector("h4")?.textContent,
        images: {
            jpg: {
                image_url: card.querySelector("img.main-picture")?.src
            }
        },
        score: card.querySelector(".details span")?.textContent.replace("Rating: ", ""),
        episodes: card.querySelector(".details span:nth-child(3)")?.textContent.replace("Episodes: ", ""),
        synopsis: card.querySelector(".details p")?.textContent
    };

    
    
    if (isActive) {
        addToFavorites(anime);
        // console.log(anime, "here is ")
    } else {
        removeFromFavorites(animeId);
    }
    
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', likeBut);
});

// EXPORT THEM
export { displayAnimeCards, likeBut };