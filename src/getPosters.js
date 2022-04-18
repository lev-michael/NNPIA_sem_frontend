import fetch from 'node-fetch';
import fs from 'fs';
import { act } from '@testing-library/react';

const cast = [
  {
    "adult": false,
    "gender": 2,
    "id": 10859,
    "known_for_department": "Acting",
    "name": "Ryan Reynolds",
    "original_name": "Ryan Reynolds",
    "popularity": 28.401,
    "profile_path": "/4SYTH5FdB0dAORV98Nwg3llgVnY.jpg",
    "cast_id": 1,
    "character": "Adam Reed",
    "credit_id": "5ea34c3a3faba00020453c8e",
    "order": 0
  },
  {
    "adult": false,
    "gender": 2,
    "id": 2867506,
    "known_for_department": "Acting",
    "name": "Walker Scobell",
    "original_name": "Walker Scobell",
    "popularity": 7.836,
    "profile_path": "/8hLsKlvCZxhSPgxOyLgg2Z0n5uK.jpg",
    "cast_id": 24,
    "character": "Young Adam",
    "credit_id": "5fbc0b0d271ca500414fa0a6",
    "order": 1
  },
  {
    "adult": false,
    "gender": 2,
    "id": 103,
    "known_for_department": "Acting",
    "name": "Mark Ruffalo",
    "original_name": "Mark Ruffalo",
    "popularity": 9.165,
    "profile_path": "/z3dvKqMNDQWk3QLxzumloQVR0pv.jpg",
    "cast_id": 22,
    "character": "Louis Reed",
    "credit_id": "5fbc0ad8271ca5003f4f9ffc",
    "order": 2
  },
  {
    "adult": false,
    "gender": 1,
    "id": 9278,
    "known_for_department": "Acting",
    "name": "Jennifer Garner",
    "original_name": "Jennifer Garner",
    "popularity": 11.63,
    "profile_path": "/ftymEXqdTnXfaI6dGd9qrJoFOSE.jpg",
    "cast_id": 12,
    "character": "Ellie Reed",
    "credit_id": "5fb47e6cd55e4d003ed6f35c",
    "order": 3
  },
  {
    "adult": false,
    "gender": 1,
    "id": 8691,
    "known_for_department": "Acting",
    "name": "Zoe Saldana",
    "original_name": "Zoe Saldana",
    "popularity": 14.088,
    "profile_path": "/aGb3JzoumA89gRFwbJYAxFm5Qdk.jpg",
    "cast_id": 11,
    "character": "Laura",
    "credit_id": "5fb47e510d5d85004041f48a",
    "order": 4
  },
  {
    "adult": false,
    "gender": 1,
    "id": 2229,
    "known_for_department": "Acting",
    "name": "Catherine Keener",
    "original_name": "Catherine Keener",
    "popularity": 14.56,
    "profile_path": "/n4CTwGszs6cwS1wJRlDQ5Mlh7Ex.jpg",
    "cast_id": 23,
    "character": "Maya Sorian",
    "credit_id": "5fbc0aeb263462003b0d385c",
    "order": 5
  },
  {
    "adult": false,
    "gender": 2,
    "id": 1020687,
    "known_for_department": "Acting",
    "name": "Alex Mallari Jr.",
    "original_name": "Alex Mallari Jr.",
    "popularity": 2.355,
    "profile_path": "/7rypBTal9cGPhExAzLpYSALJ3Px.jpg",
    "cast_id": 25,
    "character": "Christos",
    "credit_id": "5fbc0b1a2dc9dc00433b6dc6",
    "order": 6
  },
  {
    "adult": false,
    "gender": 2,
    "id": 2004111,
    "known_for_department": "Acting",
    "name": "Braxton Bjerken",
    "original_name": "Braxton Bjerken",
    "popularity": 7.744,
    "profile_path": "/3fQA8q4L7320p3pqWq1rVLXqQsa.jpg",
    "cast_id": 38,
    "character": "Ray Dollarhyde",
    "credit_id": "605fb6ce1b7c590028845e3e",
    "order": 7
  },
  {
    "adult": false,
    "gender": 2,
    "id": 3047827,
    "known_for_department": "Acting",
    "name": "Kasra Wong",
    "original_name": "Kasra Wong",
    "popularity": 1.018,
    "profile_path": "/yjzYzjt2MDNupAhVNH47K0A1KT6.jpg",
    "cast_id": 73,
    "character": "Chuck",
    "credit_id": "622b144da579f90046df0cf4",
    "order": 8
  },
  {
    "adult": false,
    "gender": 1,
    "id": 172428,
    "known_for_department": "Acting",
    "name": "Lucie Guest",
    "original_name": "Lucie Guest",
    "popularity": 7.241,
    "profile_path": "/vIqTpvWUFuYVVwCMMEj4kWe6btj.jpg",
    "cast_id": 39,
    "character": "Young Sorian Body Double",
    "credit_id": "605fb6f8f056d500529b795b",
    "order": 9
  },
  {
    "adult": false,
    "gender": 2,
    "id": 1882899,
    "known_for_department": "Acting",
    "name": "Donald Sales",
    "original_name": "Donald Sales",
    "popularity": 2.278,
    "profile_path": "/6wSOvzVyxY2F6gX3SG6XqsX6eQh.jpg",
    "cast_id": 74,
    "character": "Paul the Bartender",
    "credit_id": "622b14629a358d001c9cb2d0",
    "order": 10
  },
  {
    "adult": false,
    "gender": 1,
    "id": 2560616,
    "known_for_department": "Acting",
    "name": "Esther Ming Li",
    "original_name": "Esther Ming Li",
    "popularity": 1.012,
    "profile_path": "/u7rWUZZAINzqag1SxgShVSBk6qJ.jpg",
    "cast_id": 75,
    "character": "Sophie",
    "credit_id": "622b146ea579f9001c81daa5",
    "order": 11
  },
  {
    "adult": false,
    "gender": 2,
    "id": 51940,
    "known_for_department": "Acting",
    "name": "Ben Wilkinson",
    "original_name": "Ben Wilkinson",
    "popularity": 4.233,
    "profile_path": "/nTIJfyQMv25m0IKtubtgYRsYeEF.jpg",
    "cast_id": 42,
    "character": "Derek",
    "credit_id": "61960555bc2cb300427733e5",
    "order": 12
  },
  {
    "adult": false,
    "gender": 2,
    "id": 1674262,
    "known_for_department": "Acting",
    "name": "Milo Shandel",
    "original_name": "Milo Shandel",
    "popularity": 2.387,
    "profile_path": "/eTDJSZ50ZXJlkQrWI4darETJjgH.jpg",
    "cast_id": 40,
    "character": "Professor",
    "credit_id": "605fb703f056d5002827dce5",
    "order": 13
  },
  {
    "adult": false,
    "gender": 0,
    "id": 3487782,
    "known_for_department": "Acting",
    "name": "Isaiah Haegert",
    "original_name": "Isaiah Haegert",
    "popularity": 0.6,
    "profile_path": null,
    "cast_id": 77,
    "character": "8-year-old Adam",
    "credit_id": "6246097df2883800676443f1",
    "order": 14
  }
]


const persons = [];


fetch(`http://localhost:8080/movie/list?sort=release_date,desc`, {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
  }, body: JSON.stringify({ query: "" })
}).then(res => res.json())
  .then(res => res.content.forEach(movie => {
    fetch(`http://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=119bba3b76be0064555af88e9d7402ee`)
      .then(res => res.json())
      .then(res => {
        res.crew.forEach(actor => {
          fetch(`http://api.themoviedb.org/3/person/${actor.id}?api_key=119bba3b76be0064555af88e9d7402ee`)
            .then(response => response.json())
            .then(d => {
              if (d) {
                if(actor.job === "Producer" || actor.job === "Director" || actor.job === "Screenplay" || actor.job == "Editor"){
                  console.log(actor.job + ", "+movie.id+", "+ d.id);
                }
                persons.push({
                  id: d.id,
                  name: d.name,
                  gender: d.gender === 1 ? "FEMALE" : "MALE",
                  biography: d.biography,
                  birthday: d.birthday ?? null,
                  img: d.profile_path
                })
              }
            })
            .catch(err => console.log(err))
            .then(_ => {
              fs.writeFile('Output.json', JSON.stringify(persons), (err) => {
                if (err) throw err;
              })
            })
        })
      })
  }))

