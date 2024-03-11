// Crée une nouvelle erreur lorsque aucune route correspondant
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  // Gère toutes les erreurs qui se produisent
      // Vérifie si le statut de la réponse est 200 sinon le statut => 500
  const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
  
    // Si CastError de Mongoose n'est pas trouvé avec err.kind (un ID qui n’est pas valide),
    // alors “Définir le statut à 404 et changer le message
    if (err.name === "CastError" && err.kind === "ObjectId") {
      statusCode = 404;
      message = "Resource not found";
    }
  
    res.status(statusCode).json({
      message: message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };
  
  export { notFound, errorHandler };
  