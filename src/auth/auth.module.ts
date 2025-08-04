import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthGuard } from './auth.gurd';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => UserModule), // Fix circular dependency
  ],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
