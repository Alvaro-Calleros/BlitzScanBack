module.exports = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true 
        });
        if (error) {
            return res.status(400).json({
                message: "Error de validación",
                detalles: error.details.map(err => err.message)
            });
        }
        req.body = value; 
        next();
    };
};
