import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import apiRoutes from './routes/api';

dotenv.config();
connectDB();

// Ensure uploads directory exists
import fs from 'fs';
import path from 'path';
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
	console.log('Created uploads directory at', uploadsDir);
}

const app: Application = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files with an existence check to return JSON 404 when missing
app.use('/uploads', (req, res, next) => {
	const requested = path.join(uploadsDir, decodeURIComponent(req.path));
	if (!fs.existsSync(requested)) {
		return res.status(404).json({ error: 'File not found' });
	}
	next();
});
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api', apiRoutes);

// Global error handler (returns JSON for errors)
app.use((err: any, req: any, res: any, next: any) => {
	console.error('Unhandled error:', err && err.message ? err.message : err);
	const status = err && err.status ? err.status : 500;
	const message = err && err.message ? err.message : 'Internal Server Error';
	res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));