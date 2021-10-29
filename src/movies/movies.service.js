const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");



const addCritic =  mapProperties({
    critic_id : "critic.critic_id",
    preferred_name : "critic.preferred_name",
    surname : "critic.surname",
    organization_name : "critic.organization_name",
    created_at: "critic.created_at",
    updated_at: "critic.updated_at"
})

function listAllMovies(){
    return knex("movies as m")
    .select("*")
}

function listAllMoviesShowing(){
    return knex("movies as m")
    .join("movies_theaters", "m.movie_id", "movies_theaters.movie_id")
    .select("m.movie_id as id", 
    "m.title", 
    "m.runtime_in_minutes", 
    "m.rating", 
    "m.description", 
    "m.image_url",
    "movies_theaters.is_showing")
    .where({"movies_theaters.is_showing": true})
    .distinct()

}
//movie_id as id
function read(movieId){
    return knex("movies")
    .select("*")
    .where({ "movie_id": movieId })
    .first()
}

function getTheatersShowing(movieId){
    return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("mt.*", "theaters.*")
    .where({movie_id: movieId})
    .where({is_showing: true})
}

function getMovieReviews(movieId) {
    return knex("reviews")
    .select("*")
    .where({movie_id: movieId})
    .then(addCritic)
}

module.exports= {
    read,
    getTheatersShowing,
    getMovieReviews,
    listAllMovies,
    listAllMoviesShowing,
}