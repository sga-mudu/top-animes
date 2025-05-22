// favorites.js - CORRECTED VERSION
const FAVORITES_KEY = "likedAnime";

// Helper function for safe storage access
const getFavoritesStore = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || {};
  } catch (error) {
    console.error("Error parsing favorites:", error);
    return {};
  }
};

export function checkIfLiked(animeId) {
  const store = getFavoritesStore();
  // Convert to string for consistent type comparison
  return store.hasOwnProperty(String(animeId));
}

export function addToFavorites(anime) {
  if (!anime?.mal_id) {
    console.error("Invalid anime object:", anime);
    return;
  }

  const store = getFavoritesStore();
  const stringId = String(anime.mal_id);
  store[stringId] = anime;
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(store));
}

export function removeFromFavorites(animeId) {
  const store = getFavoritesStore();
  const stringId = String(animeId);
  
  if (store.hasOwnProperty(stringId)) {
    delete store[stringId];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(store));
  }
}

export function getAllFavorites() {
  const store = getFavoritesStore();
  return Object.values(store).filter(anime => 
    anime && typeof anime === 'object' && anime.mal_id
  );
}