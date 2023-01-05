import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const tokenId = request.body.token;
    if(tokenId) {

    } else {
      return false;
    }
  }
}
