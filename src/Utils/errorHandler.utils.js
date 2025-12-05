export const globalError = async (err, req, res, next) => {
const status = err.cause || 500;

return res
    .status(status)
    .json({
        message: "Something Want Wrong",
        stack: err.stack,
        error: err.message,
    });
};
