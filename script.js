/* 
1) Premere sul bottone "Load Images" caricherà il contenuto delle API nella pagina: 
https://api.pexels.com/v1/search?query=hamsters
Questa parte è sufficiente
2) Premere sul bottone "Load Secondary Images" invece dovrà usare una diversa query:
https://api.pexels.com/v1/search?query=tigers
3) Il tasto "Edit" andrà sostituito con un tasto "Hide".
4) Quando si preme "Hide", l'intera card dovrebbe scomparire.
5) Sostituisci il testo "9 mins" del template delle card con l'id dell'immagine corrispondente.
6) Nella sezione principale aggiungi un campo di ricerca. Usa il valore di questo campo per cercare nuove immagini rimpiazzando quelle esistenti.
7) Cliccare l'immagine o il suo nome farà cambiare pagina verso una di dettaglio dell'immagine. Qui dovrai visualizzare immagine, nome artista e linkare la sua pagina personale. Dai la possibilità all'utente di tornare indietro.
https://api.pexels.com/v1/photos/[pexelID]
Documentazione URLSearchParams: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
[EXTRA]
8) Il background della pagina di dettaglio dovrà essere la media dei colori presenti in quella foto.
9) Quando l'utente clicca su bottone "VIEW" della Card, apri l'immagine corrispondente in un modale.
 */



// Elementi DOM
const loadHamstersBtn = document.getElementById("loadHamsters");
const loadTigersBtn = document.getElementById("loadTigers");
const loadHorsesBtn = document.getElementById("loadHorses");
const searchField = document.getElementById("searchField");
const searchButton = document.getElementById("searchButton");
const imagesContainer = document.getElementById("imagesContainer");

// Event listeners
loadHamstersBtn.addEventListener("click", () => loadImages("hamsters"));
loadTigersBtn.addEventListener("click", () => loadImages("tigers"));
loadHorsesBtn.addEventListener("click", () => loadImages("horses"));
searchButton.addEventListener("click", search);
searchField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        search();
    }
});

//  gestire la ricerca
function search() {
    const query = searchField.value.trim();
    if (query) {
        loadImages(query);
    }
}

//  caricare le immagini dall API di Pexels
async function loadImages(query) {
    try {
        // Aggiorna la classe active sui bottoni
        updateActiveButton(query);
        
        // Svuota il container
        imagesContainer.innerHTML = '';
        
        // Mostra l'indicatore di caricamento
        const loadingIndicator = document.getElementById("loadingIndicator").cloneNode(true);
        loadingIndicator.style.display = "block";
        imagesContainer.appendChild(loadingIndicator);
        
        // Effettua la richiesta al nostro server proxy
        const response = await fetch(`/api/search?query=${query}`);
        
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Visualizza le immagini
        displayImages(data.photos);
    } catch (error) {
        console.error("Errore durante il caricamento delle immagini:", error);
        showError(error.message);
    }
}

// Mostrare un messaggio di errore
function showError(message) {
    // Svuota il container
    imagesContainer.innerHTML = '';
    
    // Clona il template di errore
    const errorTemplate = document.getElementById("errorTemplate").cloneNode(true);
    errorTemplate.style.display = "block";
    errorTemplate.querySelector(".error-message").textContent = `Errore durante il caricamento delle immagini: ${message}`;
    
    // Aggiungi al container
    imagesContainer.appendChild(errorTemplate);
}

//  visualizzare le immagini
function displayImages(photos) {
    // Svuota il container
    imagesContainer.innerHTML = "";
    
    if (photos.length === 0) {
        // Clona il template per nessun risultato
        const noResultsTemplate = document.getElementById("noResultsTemplate").cloneNode(true);
        noResultsTemplate.style.display = "block";
        imagesContainer.appendChild(noResultsTemplate);
        return;
    }
    
    // Crea una card per ogni immagine
    photos.forEach(photo => {
        const card = createImageCard(photo);
        imagesContainer.appendChild(card);
    });
}

//  creare una card per un immagine
function createImageCard(photo) {
    // Clona il template della card
    const template = document.getElementById("cardTemplate");
    const column = template.cloneNode(true);
    column.id = `card-${photo.id}`;
    column.style.display = "block";
    column.classList.add("mb-4"); 
    
    // Limita la lunghezza del nome del fotografo
    const photographerName = photo.photographer.length > 15 
        ? photo.photographer.substring(0, 15) + '...' 
        : photo.photographer;
    
    // usa alt come descrizione
    let description = photo.alt;
    
    // Limita la lunghezza della descrizione
    if (description.length > 30) {
        description = description.substring(0, 40) + '...';
    }
    
    // Aggiorna i contenuti
    const img = column.querySelector("img");
    img.src = photo.src.medium;
    img.alt = photo.alt;
    
    column.querySelector(".card-title").textContent = photographerName;
    column.querySelector(".card-text").textContent = description;
    
    // Aggiungi event listeners
    column.querySelector(".image-container").addEventListener("click", () => viewImage(photo.id));
    column.querySelector(".card-title").addEventListener("click", (e) => {
        openImageDetails(photo.id);
        e.stopPropagation();
    });
    column.querySelector(".view-btn").addEventListener("click", () => viewImage(photo.id));
    column.querySelector(".info-btn").addEventListener("click", () => openImageDetails(photo.id));
    column.querySelector(".hide-btn").addEventListener("click", () => hideCard(photo.id));
    
    return column;
}

//  aggiornare il bottone attivo
function updateActiveButton(query) {
    // Rimuovi la classe active da tutti i bottoni
    loadHamstersBtn.classList.remove("active");
    loadTigersBtn.classList.remove("active");
    loadHorsesBtn.classList.remove("active");
    
    // Aggiungi la classe active al bottone 
    if (query === "hamsters") {
        loadHamstersBtn.classList.add("active");
    } else if (query === "tigers") {
        loadTigersBtn.classList.add("active");
    } else if (query === "horses") {
        loadHorsesBtn.classList.add("active");
    }
}

//  nascondere una card
function hideCard(id) {
    const card = document.getElementById(`card-${id}`);
    if (card) {
        card.style.display = "none";
    }
}

//  visualizzare  immagine in un modal
function viewImage(id) {
   
    const modal = document.getElementById("imageModal");
    const modalTitle = document.getElementById("imageModalLabel");
    const modalImage = document.getElementById("modalImage");
    const photographerLink = document.getElementById("photographerLink");
    const detailsLink = document.getElementById("detailsLink");
    
    // Carica i dettagli del immagine
    fetch(`/api/photos/${id}`)
    .then(response => response.json())
    .then(photo => {
        // Aggiorna il content modal
        modalTitle.textContent = photo.photographer;
        modalImage.src = photo.src.large;
        modalImage.alt = photo.alt;
        photographerLink.href = photo.photographer_url;
        detailsLink.href = `details.html?id=${photo.id}`;
        
        // Mostra il modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    })
    .catch(error => {
        console.error("Errore durante il caricamento del immagine:", error);
    });
}

//  aprire la pagina di dettaglio del immagine
function openImageDetails(id) {
    // Salva  ID del immagine nel localStorage
    localStorage.setItem("selectedImageId", id);
    
    // Crea un URL con parametri di query
    const url = new URL("details.html", window.location.href);
    url.searchParams.append("id", id);
    
    // Redirect alla pagina di dettaglio
    window.location.href = url.toString();
}

// Carica le immagini di hamsters 
window.addEventListener("DOMContentLoaded", () => {
    loadImages("hamsters");
});