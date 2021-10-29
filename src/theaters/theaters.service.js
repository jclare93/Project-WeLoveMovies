const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties")

const addMovies =  reduceProperties("theater_id", {   
    title : ["movies", null, "title"],
    runtime_in_minutes : ["movies", null, "runtime_in_minutes"],
    rating  : ["movies", null, "rating"],
    theater_id: ["movies",null, "theater_id"]
})

function listTheaters(movieId){
    if (movieId){
        return knex("theaters as t")
        .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
        .join("movies as m", "mt.movie_id", "m.movie_id")
        .select("*")
        .where({"m.movie_id": movieId})
        .then(addMovies)

    }
    return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .select("t.*", "m.title", "m.runtime_in_minutes", "m.rating", "mt.*", "m.movie_id")
    .where({is_showing: true})
    .then(addMovies)
}

module.exports = {
    listTheaters
}