const theatersService = require("./theaters.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function list(req, res, next){
    const { movieId } = req.params;
    if (movieId){
        const data = await theatersService.listTheaters(movieId)
        return res.json({data})
    }
    const data = await theatersService.listTheaters()
    res.json({data})
}

module.exports = {
list: asyncErrorBoundary(list)
}