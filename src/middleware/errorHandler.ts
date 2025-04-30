import { Request, Response, NextFunction } from 'express';

// Custom error interface (optional, but good practice)
interface CustomError extends Error {
    statusCode?: number;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error('Error caught by error handler:', err); // Log the error for debugging

    const statusCode = err.statusCode || 500; // Use custom status code if available, otherwise 500
    const message = err.message || 'Internal Server Error'; // Use custom message if available

    res.status(statusCode).json({
        message: message,
       // Optionally include error details in development, but not in production
        ...(process.env.NODE_ENV === 'development' && { error: err.stack }), 
    });
};
