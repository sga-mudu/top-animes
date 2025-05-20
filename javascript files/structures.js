import { checkIfLiked } from "../javascript files/favorites.js";

export const getAnimeCardStructure = (anime) => {
    const detailsContainer = document.querySelector(".details-container");

    const imageSection = imageSec(anime);
    detailsContainer.appendChild(imageSection);

    const contentSection = contentSec(anime);
    detailsContainer.appendChild(contentSection);
};

export const imageSec = (anime) =>{
  const old = document.createElement("div");
    old.className = "image-section";
    old.innerHTML = `
            <div>
                <img src="${anime.images.jpg.image_url}" class="bckground">
            </div>
            
            <button class="back-btn">
                <span>&larr;</span> 
                Back
            </button>
      `
    return old;
}
export const contentSec = (anime ) =>{
    const huu = document.createElement("div");
    const favorited = checkIfLiked(anime.mal_id);
    console.log(favorited);
    huu.className = "content-section";
    huu.innerHTML = `
            <div class="header-section">
                <h2>${anime.title}</h2>
                <button class="like-btn ${favorited ? 'active' : ''}">
                    <img src="${favorited ? '../icons/heart-full.svg' : '../icons/heart-outline.svg'}" alt="">
                </button>
            </div>
            <div class="info-section">
                <h5 class="anime-rating">Rating: ${anime.score}</h5>
                <h5 class="anime-genres">Genres: ${anime.genres?.map(g => g.name).join(', ')}</h5>
            </div>

            <div class="description-section">
                <p>${anime.synopsis}</p>
            </div>
        `
    return huu;
}