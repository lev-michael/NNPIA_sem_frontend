import fetch from 'node-fetch';
import fs from 'fs';
let movies;
let moviesWithImages = [];


fetch('http://localhost:8080/movie/list?page=0&size=500')
  .then(response => response.json())
  .then(data => {
    movies = data.content.map(m => ({id: m.id, title: m.title, description: m.description, release_date: new Date(m.release_date).toISOString().slice(0,10), runtime: m.runtime}))
    movies.forEach(movie => {
      const title = movie.title.replace(" ", "+")
      console.log(new Date(movie.release_date).toISOString().slice(0,10));
      fetch('https://api.themoviedb.org/3/search/movie?api_key=119bba3b76be0064555af88e9d7402ee&query=' + title)
        .then(response => response.json())
        .then(data => {
          moviesWithImages.push({
            ...movie,
            img: data.results[0].poster_path
          })
        })
        .then(_ => {
          fs.writeFile('Output.json', JSON.stringify(moviesWithImages), (err) => {
            if (err) throw err;
        })
        })
    });
  });


