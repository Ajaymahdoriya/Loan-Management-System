import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /pdf|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) return cb(null, true);
  const err: any = new Error('Only PDF, JPG, and PNG files are allowed');
  err.status = 400;
  return cb(err);
};

export const uploadSalarySlip = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

// Wrapper to ensure errors from multer are forwarded to Express error handler
export const uploadSalarySlipSingle = (fieldName: string) => {
  return (req: any, res: any, next: any) => {
    const middleware = uploadSalarySlip.single(fieldName);
    middleware(req, res, (err: any) => {
      if (err) return next(err);
      next();
    });
  };
};