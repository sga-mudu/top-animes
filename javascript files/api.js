import { showLoading, hideLoading } from "./script.js";

export const apiBase =  "https://api.jikan.moe/v4";

export const fetchData = async (url) => {
    showLoading();
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw error;
        }
        const data = await response.json();
        console.log("success", data);
        return data;
    } catch(error){
        console.log("error");
        throw error;
    } finally {
        hideLoading();
    }

}

export const getAnimeDetails = async (id) => {
    try {
        const response = await fetch(`${apiBase}/anime/${id}/full`);
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching anime details:", error);
        return null;
    }
};


window.addEventListener("load", fetchData);







