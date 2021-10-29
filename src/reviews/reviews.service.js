const knex = require("../db/connection");
const addCritic =  require("./reviews.controller")

function read(reviewId){
    return knex("reviews")
    .join("critics", "reviews.critic_id", "critics.critic_id")
    .select("*")
    .where({ review_id : reviewId })
    .first()
}

function update (updatedReview) {
    return knex("reviews")
    .join("critics", "reviews.critic_id", "critics.critic_id")
    .select("*")
    .where({review_id: updatedReview.review_id})
    .update(updatedReview, "*")
    .then(updatedRecords => updatedRecords[0])
}

function destroy (reviewId) {
    return knex("reviews")
    .where({review_id: reviewId})
    .del()   
}

function list (movie_id){
    return knex("reviews")
    .join("critics", "reviews.critic_id", "critics.critic_id")
    .select("*")
    .where({movie_id})
    .then(addCritic)
}
module.exports = {
    read,
    update,
    destroy,
    list,
}