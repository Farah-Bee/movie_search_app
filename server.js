require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static('public'));

// Home route
app.get('/', (req, res) => {
    res.render('index', { movies: null, error: null });
});

// Search movies
app.get('/search', async (req, res) => {
    const query = req.query.movie;
    const apiKey = process.env.OMDB_API_KEY;

    if (!query) {
        return res.render('index', { movies: null, error: 'Please enter a movie name' });
    }

    try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`);
        const movies = response.data.Search;

        if (!movies) {
            return res.render('index', { movies: null, error: 'No movies found' });
        }

        res.render('index', { movies, error: null });
    } catch (error) {
        res.render('index', { movies: null, error: 'Error fetching data' });
    }
});

// Movie details route
app.get('/movie/:id', async (req, res) => {
    const movieId = req.params.id;
    const apiKey = process.env.OMDB_API_KEY;

    try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`);
        const movie = response.data;
        res.render('movie', { movie });
    } catch (error) {
        res.render('index', { movies: null, error: 'Error fetching movie details' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
