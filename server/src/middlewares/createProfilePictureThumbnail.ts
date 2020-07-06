import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';


export default function createProfilePictureThumbnail(req: Request, res: Response, next: NextFunction) {
  
  if(!req.file) return next();

  const thumbnailName = `thumbnail-${req.file.filename}`;
  
  sharp(path.resolve(__dirname, '..', '..', 'uploads', req.file.filename))
    .resize(100, 100, {
      fit: 'inside',
    })
    .toFile(path.resolve(__dirname, '..', '..', 'uploads', thumbnailName));

  res.locals.thumbnailName = thumbnailName;
  
  return next();
}
