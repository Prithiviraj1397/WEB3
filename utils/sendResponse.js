
exports.sendResponse = (res, statusCode = false, status, message = '', data = false) => {
    const resp = {};
    if (data) {
        resp.data = data;
    }
    resp.status = status;
    resp.message = message;

    res.status(statusCode).json(resp);
}
