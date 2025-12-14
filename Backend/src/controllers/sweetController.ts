import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { sweetService } from '../services/sweetService';

export const createSweet = async (req: AuthRequest, res: Response) => {
  try {
    const sweet = await sweetService.createSweet(req.body);
    res.status(201).json(sweet);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllSweets = async (req: AuthRequest, res: Response) => {
  try {
    const sweets = await sweetService.getAllSweets();
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchSweets = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const sweets = await sweetService.searchSweets(
      name as string,
      category as string,
      minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice ? parseFloat(maxPrice as string) : undefined
    );
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSweet = async (req: AuthRequest, res: Response) => {
  try {
    const sweet = await sweetService.updateSweet(req.params.id, req.body);
    res.json(sweet);
  } catch (error) {
    res.status(500).json({ error: 'Sweet not found or internal server error' });
  }
};

export const deleteSweet = async (req: AuthRequest, res: Response) => {
  try {
    await sweetService.deleteSweet(req.params.id);
    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Sweet not found or internal server error' });
  }
};

export const purchaseSweet = async (req: AuthRequest, res: Response) => {
  try {
    const sweet = await sweetService.purchaseSweet(req.params.id);
    res.json(sweet);
  } catch (error: any) {
    if (error.message === 'Sweet not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Sweet is out of stock') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const restockSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity required' });
    }
    
    const sweet = await sweetService.restockSweet(req.params.id, quantity);
    res.json(sweet);
  } catch (error: any) {
    if (error.message === 'Sweet not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};