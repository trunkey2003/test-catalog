const response = {
    success(res, statusCode, data) {
        const response = {success: true, errors: null, data};
        res.status(statusCode).json(response);
    },
    error(res, statusCode, errors) {
        const response = {success: false, errors: errors, data: null};
        res.status(statusCode).json(response);
    }
}

module.exports = response;