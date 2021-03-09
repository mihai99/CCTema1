class BadRequestError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.status = 400;
        this.name = "bad request"
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.status = 404;
        this.name = "Not found"
    }
}


class InternalServerError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.status = 500;
        this.name = "Internal server error"
    }
}


module.exports.BadRequestError = BadRequestError;
module.exports.InternalServerError = InternalServerError;
module.exports.NotFoundError = NotFoundError;