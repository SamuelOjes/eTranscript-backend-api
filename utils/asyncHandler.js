/**
 * This is a utility or helper function that helps with passing and receiveing async and await requests 
 */
// @desc Try Catch Middleware
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;