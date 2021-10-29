const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js");


async function movieExists(req, res, next){
    const id = req.params.movieId
    const movie = await moviesService.read(id)
    if (movie){
        res.locals.movie = movie
        return next()
    }
    next({ status: 404, message: `Movie cannot be found.` });
}

async function listMovieReviews(req,res,next) {
    res.json({data: await moviesService.getTheatersShowing(req.params.movieId)})
}

function read(req, res) {
    const data = res.locals.movie;
    res.json({ data });
}

async function list(req, res, next) {
    const isShowing = req.query.is_showing
    if (isShowing){
        res.json({data: await moviesService.listAllMoviesShowing()})
    } else {
        return res.json({data: await moviesService.listAllMovies()})
    }
}

module.exports = {
    read: [asyncErrorBoundary(movieExists), read],
    list: asyncErrorBoundary(list),
    listMovieReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listMovieReviews)],
    listTheatersShowing: [asyncErrorBoundary(movieExists), asyncErrorBoundary(list)],
    movieExists,
}