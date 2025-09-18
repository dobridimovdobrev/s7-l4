import express from "express";
import fetch from "node-fetch";
import "dotenv/config";

const app = express();
const PORT = 3000;

// Servi file statici dalla directory corrente
app.use(express.static("./"));

// Endpoint proxy per l'API di Pexels
app.get("/api/search", async (req, res) => {
  const query = req.query.query || "nature";

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=12`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Errore fetch da Pexels" });
  }
});

// Endpoint per ottenere i dettagli di una foto specifica
app.get("/api/photos/:id", async (req, res) => {
  const id = req.params.id;
  
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/photos/${id}`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Errore fetch da Pexels" });
  }
});

app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});
