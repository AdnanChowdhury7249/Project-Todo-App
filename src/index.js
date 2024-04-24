import './style.css';
import { sidebarUI, maincontentUI, loadFromLocalStorage, refreshUI } from './interface.js';


// Example usage
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    sidebarUI();
    maincontentUI();
    refreshUI();
    // Set minimum date input
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    document.getElementById("dateInput").setAttribute("min", formattedToday);
});



