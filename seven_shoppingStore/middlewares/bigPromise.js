// if you dont want to use try,catch,async,await in every controller then use this promise

module.exports = func => (req,res,next) =>
    Promise.resolve(func(req,res,next)).catch(next)