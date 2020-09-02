/**
 * This is a utility or helper class that handles the error passing it the error message and the error code
 */

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    }
}

module.exports = ErrorResponse;