import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { ValidationError, UnauthorizedError, ConflictError } from '../utils/errors.js';
import type { RegisterRequest } from '../types/auth.js';

export class AuthService {
  async register(data: RegisterRequest) {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] }
    });

    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    return await prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: { id: true, email: true, username: true, name: true, role: true }
    });
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedError('Invalid credentials');
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}