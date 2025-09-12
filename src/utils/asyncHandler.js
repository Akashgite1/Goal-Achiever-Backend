// used to handle async/await errors in Express routes 
// Purpose: Wrap async controllers so you don’t need repetitive try/catch.


const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        const rawStatus = error.statusCode || error.status || error.code || 500;
        const status = (typeof rawStatus === 'number' && rawStatus >= 100 && rawStatus <= 599) ? rawStatus : 500;

        res.status(status).json({
            success: false,
            message: error.message || 'Internal Server Error',
            error: error.stack || error
        });
    }
}

export { asyncHandler };