import { NextFunction, Response, Request } from "express";
import { body, validationResult } from 'express-validator';

export const fileValidationRules = () => {
    return [
        body('name').isAlphanumeric(),
        body('is_directory').isBoolean(),
        body('is_shared').isBoolean(),
        body('user_id').isString().isLength({ min: 1 }),
    ]
}

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


