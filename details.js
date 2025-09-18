//  container
const mainContainer = document.getElementById("mainContainer");

//  ottenere i parametri dal url
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        id: urlParams.get("id")
    };
}

//  caricare i dettagli del immagine
async function loadImageDetails() {
    const params = getUrlParams();
    
    // Verifica se id e presente
    if (!params.id) {
        showError("ID immagine non specificato");
        return;
    }
    
    try {
        // fare la richiesta la al server
        const response = await fetch(`/api/photos/${params.id}`);
        
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status}`);
        }
        
        const photo = await response.json();
        
        // Visualizza i dettagli immagine
        displayImageDetails(photo);
        
        // Imposta il colore di sfondo 
        setBackgroundColor(photo.src.medium);
    } catch (error) {
        console.error("Errore durante il caricamento dei dettagli :", error);
        showError(`Errore durante il caricamento dei dettagli : ${error.message}`);
    }
}

//  visualizzare i dettagli del immagine
function displayImageDetails(photo) {
    // Svuota il container
    mainContainer.innerHTML = '';
    
    // Clona il template dei dettagli
    const detailsTemplate = document.getElementById("detailsTemplate").cloneNode(true);
    detailsTemplate.classList.remove("d-none");
    
    // Aggiorna i contenuti
    detailsTemplate.querySelector("#detailImage").src = photo.src.large;
    detailsTemplate.querySelector("#detailImage").alt = photo.alt;
    detailsTemplate.querySelector("#photographerName").textContent = photo.photographer;
    detailsTemplate.querySelector("#imageId").textContent = `ID: ${photo.id}`;
    detailsTemplate.querySelector("#photographerUrl").href = photo.photographer_url;
    
    // Aggiungi al container
    mainContainer.appendChild(detailsTemplate);
}

//  mostrare un errore
function showError(message) {
    // Svuota il container
    mainContainer.innerHTML = '';
    
    // Clona il template di errore
    const errorTemplate = document.getElementById("errorTemplate").cloneNode(true);
    errorTemplate.classList.remove("d-none");
    errorTemplate.querySelector("#errorMessage").textContent = message;
    
    // Aggiungi al container
    mainContainer.appendChild(errorTemplate);
}

//  tornare alla pagina principale
function goBack() {
    window.location.href = "index.html";
}

//  impostare il colore di sfondo basato sull'immagine (funzionalità extra)
function setBackgroundColor(imageUrl) {
    // Nessuna modifica necessaria, il colore è già impostato nel CSS
}

// dettagli del immgaine al caricamento della pagina
window.addEventListener("DOMContentLoaded", loadImageDetails);
