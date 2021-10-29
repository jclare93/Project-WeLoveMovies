const reviewsService = require("./reviews.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const mapProperties = require("../utils/map-properties");
const reduceProperties = require("../utils/reduce-properties")

const reduceCritics =  reduceProperties("critic_id", {
    critic_id : ["critic", "critic_id"],
    preferred_name : ["critic", "preferred_name"],
    surname : ["critic", "surname"],
    organization_name : ["critic", "organization_name"],
    created_at: ["critic", "created_at"],
    updated_at: ["critic", "updated_at"]
})

function validateReview(req, res, next){
    const bodyData = req.body.data
    if (bodyData) {
        return next()
    } else{
        return next({
            status: 400,
            message: "invalid request"
        })
    }
}

const addCritic = mapProperties({
    preferred_name : "critic.preferred_name",
    surname : "critic.surname",
    organization_name : "critic.organization_name",
})

async function reviewExists(req, res, next){
    const foundReview = await reviewsService.read(req.params.reviewId)
    if (foundReview) {
        res.locals.foundReview = foundReview
        return next()
    } 
    next({status: 404, message: 'Review cannot be found.'})
}

async function update (req, res, next){
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.foundReview.review_id,
    }
    console.log("updatedReview", updatedReview)
    await reviewsService.update(updatedReview);
    const updatedData = await reviewsService.read(res.locals.foundReview.review_id)
    console.log("updatedData", updatedData)
    const newData = addCritic(updatedData)
    console.log(newData)
    res.json({data: newData});
}

async function destroy (req, res, next){
   await reviewsService.destroy(res.locals.foundReview.review_id)
   res.sendStatus(204)
}

async function list(req, res, next){
    const { movieId } = req.params;
    const movieData = await reviewsService.list(movieId);
    const newData = reduceCritics(movieData)
    res.json({data: newData})
}

module.exports = {
    update: [asyncErrorBoundary(reviewExists), validateReview, asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
    list: asyncErrorBoundary(list),
}