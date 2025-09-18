// DOM
const loadHamstersBtn = document.getElementById("loadHamsters");
const loadTigersBtn = document.getElementById("loadTigers");
const loadHorsesBtn = document.getElementById("loadHorses");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const imagesContainer = document.getElementById("imagesContainer");

// Events
loadHamstersBtn.addEventListener("click", () => loadImages("hamsters"));
loadTigersBtn.addEventListener("click", () => loadImages("tigers"));
loadHorsesBtn.addEventListener("click", () => loadImages("horses"));
searchButton.addEventListener("click", search);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        search();
    }
});

//  La ricerca
function search() {
    const query = searchInput.value;
    if (query) {
        loadImages(query);
    }
}




// Caricare immagini 
function loadImages(query) {
    updateActiveButton(query);
    imagesContainer.innerHTML = "";

    // Mostra caricamento
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.classList.remove("d-none");
    

    fetch("/api/search?query=" + query)
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nella richiesta: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            displayImages(data.photos);
        })
        .catch(error => {
            console.error("Errore durante il caricamento delle immagini:", error);
            showError(error.message);
        })
        .finally(() => {
            loadingSpinner.classList.add("d-none");
        });
}

// Mostra errore
function showError(message) {
    imagesContainer.innerHTML = "";

    const errorTemplate = document.getElementById("errorTemplate").cloneNode(true);
    errorTemplate.classList.remove("d-none");
    errorTemplate.querySelector(".error-message").textContent =
        "Errore durante il caricamento delle immagini: " + message;

    imagesContainer.appendChild(errorTemplate);
}

// Mostra immagini
function displayImages(photos) {
    imagesContainer.innerHTML = "";

    if (!photos || photos.length === 0) {
        const noResultsTemplate = document.getElementById("noResultsTemplate").cloneNode(true);
        noResultsTemplate.classList.remove("d-none");
        imagesContainer.appendChild(noResultsTemplate);
        return;
    }

    photos.forEach(photo => {
        const card = createImageCard(photo);
        imagesContainer.appendChild(card);
    });
}

// Crea una card
function createImageCard(photo) {
    const template = document.getElementById("cardTemplate");
    const column = template.cloneNode(true);
    column.id = "card-" + photo.id;
    column.classList.remove("d-none");
    column.classList.add("mb-4");

    const photographerName = photo.photographer.length > 15
        ? photo.photographer.substring(0, 15) + "..."
        : photo.photographer;

    let description = photo.alt;
    if (description.length > 30) {
        description = description.substring(0, 30) + "...";
    }

    const img = column.querySelector("img");
    img.src = photo.src.medium;
    img.alt = photo.alt;

    column.querySelector(".card-title").textContent = photographerName;
    column.querySelector(".card-text").textContent = description;

    // Eventi
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

// Aggiorna bottone attivo
function updateActiveButton(query) {
    loadHamstersBtn.classList.remove("active");
    loadTigersBtn.classList.remove("active");
    loadHorsesBtn.classList.remove("active");

    if (query === "hamsters") {
        loadHamstersBtn.classList.add("active");
    } else if (query === "tigers") {
        loadTigersBtn.classList.add("active");
    } else if (query === "horses") {
        loadHorsesBtn.classList.add("active");
    }
}

// Nascondi card
function hideCard(id) {
    const card = document.getElementById("card-" + id);
    if (card) {
        card.classList.add("d-none");
    }
}

// Mostra immagine in modal
function viewImage(id) {
    fetch("/api/photos/" + id)
        .then(response => response.json())
        .then(photo => {
            const modal = document.getElementById("imageModal");
            document.getElementById("imageModalLabel").textContent = photo.photographer;
            document.getElementById("modalImage").src = photo.src.large;
            document.getElementById("modalImage").alt = photo.alt;
            document.getElementById("photographerLink").href = photo.photographer_url;
            document.getElementById("detailsLink").href = "details.html?id=" + photo.id;

            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        })
        .catch(error => {
            console.error("Errore durante il caricamento dell'immagine:", error);
        });
}

// Vai alla pagina dettagli
function openImageDetails(id) {
    window.location.href = "details.html?id=" + id;
}

// Carica hamsters by default
window.addEventListener("DOMContentLoaded", function () {
    loadImages("hamsters");
});