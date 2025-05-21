import { showLoading, hideLoading } from "../javascript files/script.js";

export const apiBase = "https://api.jikan.moe/v4";

export const fetchData = async (url) => {
    showLoading();
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetch successful", data);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw the actual error
    } finally {
        hideLoading();
    }
};

export const getAnimeDetails = async (id) => {
    try {
        const response = await fetch(`${apiBase}/anime/${id}/full`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching anime details:", error);
        throw error; // Consistent error handling
    }
};

// Remove the window.load event listener as it's not properly used here