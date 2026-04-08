import { Request, Response, NextFunction } from 'express';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!(req.session as any).userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

export default requireAuth;