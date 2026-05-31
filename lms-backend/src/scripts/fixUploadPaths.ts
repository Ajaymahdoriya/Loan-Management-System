import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Loan from '../models/Loan';
import path from 'path';

dotenv.config();

const fix = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const loans = await Loan.find({});
    let updated = 0;
    for (const loan of loans) {
      const url: any = loan.salarySlipUrl;
      if (!url) continue;
      // If the URL already looks like a public /uploads path, skip
      if (typeof url === 'string' && url.startsWith('/uploads')) continue;

      // If it contains 'uploads' path, normalize to /uploads/<basename>
      if (typeof url === 'string' && url.includes('uploads')) {
        const filename = path.basename(url);
        loan.salarySlipUrl = `/uploads/${filename}`;
        await loan.save();
        updated++;
      }
    }

    console.log(`Updated ${updated} loan(s).`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

fix();
