import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateSweet = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().valid('CHOCOLATE', 'CANDY', 'GUMMY', 'LOLLIPOP', 'COOKIE', 'CAKE', 'OTHER').required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required(),
    description: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateSweetUpdate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    category: Joi.string().valid('CHOCOLATE', 'CANDY', 'GUMMY', 'LOLLIPOP', 'COOKIE', 'CAKE', 'OTHER').optional(),
    price: Joi.number().positive().optional(),
    quantity: Joi.number().integer().min(0).optional(),
    description: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};