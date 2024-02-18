import express from 'express'
import axios from 'axios'
import * as cheerio from 'cheerio'
import cors from 'cors'
import dotenv from "dotenv";

const app = express();
dotenv.config()

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.post('/lana', async (req, res) => {
  const { youtubeLink } = req.body;
  console.log('bearrrrrrrrrrrrrr', youtubeLink)

  try {
    const response = await axios.get(youtubeLink.youtubeLink);
    const html = response.data;
    const $ = cheerio.load(html);

    // Encuentra el elemento que contiene el nombre del canal
    const embedLink = $('meta[property="og:video:url"]').attr('content');

    // Extract video title
    const videoTitle = $('meta[property="og:title"]').attr('content');

    // Extract video thumbnail
    const videoThumbnail = $('meta[property="og:image"]').attr('content');

    // Sending the extracted data as a JSON response
    res.json({embedLink, videoTitle, videoThumbnail });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Hubo un error al extraer la información de YouTube.' });
  }
});

app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'something went wronng'
  return res.status(status).json({
    success: false,
    status,
    message
  })
})
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

