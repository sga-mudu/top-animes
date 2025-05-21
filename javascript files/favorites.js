
// favorites.js
export function checkIfLiked(animeId) {
    const likedAnime = JSON.parse(localStorage.getItem("likedAnime") || "{}");
    return !!likedAnime[animeId];
}

// favorites.js
export function addToFavorites(anime) {
    const likedAnime = JSON.parse(localStorage.getItem("likedAnime") || {});
    
    // Only store if we have a valid anime object with mal_id
    if (anime && anime.mal_id) {
        likedAnime[anime.mal_id] = anime;
        localStorage.setItem("likedAnime", JSON.stringify(likedAnime));
    }
}

export function removeFromFavorites(animeId) {
    const likedAnime = JSON.parse(localStorage.getItem("likedAnime") || {});
    delete likedAnime[animeId];
    localStorage.setItem("likedAnime", JSON.stringify(likedAnime));
}

export function getAllFavorites() {
    const likedAnime = JSON.parse(localStorage.getItem("likedAnime") || "{}");
    
    // Filter out invalid entries (false values, etc.)
    return Object.values(likedAnime).filter(anime => 
        anime && typeof anime === 'object' && anime.mal_id
    );
}
// Add this to your favorites.js
// export function showToast(message) {
//     const toast = document.createElement("div");
//     toast.className = "toast";
//     toast.textContent = message;
//     document.body.appendChild(toast);
    
//     setTimeout(() => {
//         toast.remove();
//     }, 3000);
// }
