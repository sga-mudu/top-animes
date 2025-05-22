
import { getAnimeDetails } from "../javascript files/api.js";
import { addToFavorites, checkIfLiked, removeFromFavorites } from "../javascript files/favorites.js";
import { getAnimeCardStructure } from "../javascript files/structures.js";

const animeID = new URLSearchParams(window.location.search).get("id");
const detailsContainer = document.querySelector(".details-container");
let anime = null;

document.addEventListener("DOMContentLoaded", async () => {
    if(!animeID){
        detailsContainer.innerHTML = `<p>No anime id provided</p>`;
        return;
    }
    console.log("here is animeID", animeID)

    try{
        anime = await getAnimeDetails(animeID);
        
        if(!anime){
            detailsContainer.innerHTML = `<p>Failed to load anime details.</p>`;
            return;
        }

        getAnimeCardStructure(anime);

        const detailsLikeBtn = document.querySelector(".like-btn");
        if(detailsLikeBtn){
            const isLiked = checkIfLiked(anime.mal_id);
            detailsLikeBtn.classList.toggle("active", isLiked);
            detailsLikeBtn.innerHTML = `
                <img src="${isLiked ? '../icons/heart-full.svg' : '../icons/heart-outline.svg'}" alt="">
            `;
            
            detailsLikeBtn.addEventListener("click", buttonClicked);

            // if(isLiked){
            //     addToFavorites(anime);
            // } else{
            //     removeFromFavorites(anime.mal_id);
            // }
        }
        backButton();
    } catch(error){
        console.error("Error in DOMContentLoaded:", error);
        detailsContainer.innerHTML = `<p>An error occurred while loading anime details.</p>`;
    }
});

function buttonClicked(e) {
    e.stopPropagation(); // Prevent event bubbling
    
    const detailsLikeBtn = e.currentTarget; // Better than querySelector again
    const isActive = !detailsLikeBtn.classList.contains("active");
    
    detailsLikeBtn.classList.toggle("active", isActive);
    detailsLikeBtn.innerHTML = `
        <img src="${isActive ? '../icons/heart-full.svg' : '../icons/heart-outline.svg'}" alt="">
    `;
    
    if (anime) {
        if (isActive) {
            addToFavorites(anime);
        } else {
            removeFromFavorites(anime.mal_id);
        }
        setTimeout(() => location.reload(), 100);
    }
}

export function backButton(){
    const backBtn = document.querySelector(".back-btn");
    if(backBtn){
        backBtn.addEventListener("click", ()=>{
            window.location.href = "../index.html";
        });
    }
}
