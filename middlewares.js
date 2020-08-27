
const errorHandler = async (err, req, res, next) => {
    
    const error = err.response ? err.response.data : { success: false, message: err.message || 'General error' };
    const status = err.response ? err.response.status : 500;

    res.status(status).json(error);
};

module.exports = {
    errorHandler,
};