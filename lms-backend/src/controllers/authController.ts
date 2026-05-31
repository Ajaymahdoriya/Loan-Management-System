import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const registerBorrower = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, pan, dob, monthlySalary, employmentMode } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const user = new User({ email, password, role: 'Borrower', fullName, pan, dob, monthlySalary, employmentMode });
    await user.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error: any) { res.status(500).json({ error: error.message }); }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    res.status(200).json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        role: user.role,
        fullName: user.fullName,
        pan: user.pan,
        dob: user.dob,
        monthlySalary: user.monthlySalary,
        employmentMode: user.employmentMode
      } 
    });
  } catch (error: any) { res.status(500).json({ error: error.message }); }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ 
      id: user._id, 
      email: user.email, 
      role: user.role,
      fullName: user.fullName,
      pan: user.pan,
      dob: user.dob,
      monthlySalary: user.monthlySalary,
      employmentMode: user.employmentMode
    });
  } catch (error: any) { res.status(500).json({ error: error.message }); }
};