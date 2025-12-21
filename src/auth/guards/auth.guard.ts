import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { CustomDecoratorKey } from 'src/common/custom-decorator-keys';

import { TokenService } from '../services';

/**
 * Provides authentication for routes that it is applied to.
 * Requests must provide a valid Bearer token in the Authorization header.
 * By default, applying this guard to a route will block the request if the user is not authenticated.
 * To bypass this (only authenticate if possible), declare a route with `@BlockIfUnauthorized(false)`.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.getPublic(context)) {
      return true;
    }
    try {
      const request: Request = context.switchToHttp().getRequest();
      const { token } = this.extractCredentialFromHeader(request);
      const { tokenId } = this.tokenService.readAccessToken(token);

      await this.tokenService.getValidToken(tokenId);

      const user = await this.tokenService.getUserByTokenId(tokenId);
      if (!user) {
        throw new UnauthorizedException('Không tìm thấy người dùng với mã đăng nhập');
      }
      if (user.isBanned) {
        throw new ForbiddenException(
          'Tài khoản của bạn hiện đang bị khóa. Vui lòng liên hệ với bộ phận Chăm sóc Khách hàng để được hỗ trợ thêm thông tin.',
        );
      }

      const shouldBlockIfNotManager = this.getShouldBlockByDecoratorKey(
        context,
        CustomDecoratorKey.BLOCK_IF_NOT_MANAGER,
      );
      if (shouldBlockIfNotManager && !user.isManager) {
        throw new ForbiddenException();
      }

      request.user = {
        tokenId,
        email: user.email,
        userId: user._id,
      };
    } catch {
      const shouldBlock = this.getShouldBlockIfNotManager(context);
      if (shouldBlock) {
        throw new ForbiddenException();
      }
    }
    return true;
  }

  private extractCredentialFromHeader(request: Request): {
    token: string;
  } {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Xác thực thất bại, chưa đăng nhập');
    }
    return {
      token,
    };
  }

  private getPublic(content: ExecutionContext): boolean {
    const shouldSkipAuthMetadata: boolean | undefined = this.reflector.get(
      CustomDecoratorKey.PUBLIC,
      content.getHandler(),
    );
    if (shouldSkipAuthMetadata === undefined) {
      return false;
    }
    return shouldSkipAuthMetadata;
  }

  private getShouldBlockIfNotManager(context: ExecutionContext): boolean {
    const shouldBlockMetadata: boolean | undefined = this.reflector.get(
      CustomDecoratorKey.BLOCK_IF_NOT_MANAGER,
      context.getHandler(),
    );

    if (shouldBlockMetadata === undefined) {
      return false;
    }

    return shouldBlockMetadata;
  }

  private getShouldBlockByDecoratorKey(context: ExecutionContext, decoratorKey: string): boolean {
    const shouldBlockMetadata: boolean | undefined = this.reflector.get(
      decoratorKey,
      context.getHandler(),
    );

    if (shouldBlockMetadata === undefined) {
      return false;
    }

    return shouldBlockMetadata;
  }
}
