import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const roles = ['Admin', 'Sales', 'Sanction', 'Disbursement', 'Collection', 'Borrower'];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    await User.deleteMany();

    const defaultUsers = [
      {
        email: 'admin@test.com',
        role: 'Admin',
        fullName: 'Test Admin',
        dob: new Date('1990-01-01'),
        monthlySalary: 50000,
        pan: 'ABCDE1234F',
        employmentMode: 'Salaried'
      },
      {
        email: 'sales@test.com',
        role: 'Sales',
        fullName: 'Test Sales',
        dob: new Date('1990-01-01'),
        monthlySalary: 50000,
        pan: 'ABCDE1234F',
        employmentMode: 'Salaried'
      },
      {
        email: 'sanction@test.com',
        role: 'Sanction',
        fullName: 'Test Sanction',
        dob: new Date('1990-01-01'),
        monthlySalary: 50000,
        pan: 'ABCDE1234F',
        employmentMode: 'Salaried'
      },
      {
        email: 'disbursement@test.com',
        role: 'Disbursement',
        fullName: 'Test Disbursement',
        dob: new Date('1990-01-01'),
        monthlySalary: 50000,
        pan: 'ABCDE1234F',
        employmentMode: 'Salaried'
      },
      {
        email: 'collection@test.com',
        role: 'Collection',
        fullName: 'Test Collection',
        dob: new Date('1990-01-01'),
        monthlySalary: 50000,
        pan: 'ABCDE1234F',
        employmentMode: 'Salaried'
      },
      {
        email: 'borrower@test.com',
        role: 'Borrower',
        fullName: 'Test Borrower (Eligible)',
        dob: new Date('1992-05-15'),
        monthlySalary: 55000,
        pan: 'ABCDE1234F',
        employmentMode: 'Salaried'
      },
      {
        email: 'borrower_underage@test.com',
        role: 'Borrower',
        fullName: 'Test Underage Borrower',
        dob: new Date('2006-01-01'),
        monthlySalary: 50000,
        pan: 'ABCDE1234F',
        employmentMode: 'Salaried'
      },
      {
        email: 'borrower_overage@test.com',
        role: 'Borrower',
        fullName: 'Test Overage Borrower',
        dob: new Date('1970-01-01'),
        monthlySalary: 50000,
        pan: 'ABCDE1234F',
        employmentMode: 'Salaried'
      },
      {
        email: 'borrower_lowsalary@test.com',
        role: 'Borrower',
        fullName: 'Test Low Salary Borrower',
        dob: new Date('1990-01-01'),
        monthlySalary: 15000,
        pan: 'ABCDE1234F',
        employmentMode: 'Salaried'
      },
      {
        email: 'borrower_invalidpan@test.com',
        role: 'Borrower',
        fullName: 'Test Invalid PAN Borrower',
        dob: new Date('1990-01-01'),
        monthlySalary: 50000,
        pan: 'ABC1234F',
        employmentMode: 'Salaried'
      },
      {
        email: 'borrower_unemployed@test.com',
        role: 'Borrower',
        fullName: 'Test Unemployed Borrower',
        dob: new Date('1990-01-01'),
        monthlySalary: 50000,
        pan: 'ABCDE1234F',
        employmentMode: 'Unemployed'
      }
    ];

    for (const userData of defaultUsers) {
      const user = new User({
        ...userData,
        password: 'password123'
      });
      await user.save();
    }

    console.log('Database seeded successfully with properly hashed passwords!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();