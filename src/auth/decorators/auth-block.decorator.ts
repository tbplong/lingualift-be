import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { CustomDecoratorKey } from 'src/common/custom-decorator-keys';

/**
 * Declares whether a route should block the request if the user is not authenticated.
 * This will override the default behavior of AuthGuard.
 */
export const BlockIfNotManager = (block: boolean = false): CustomDecorator =>
  SetMetadata(CustomDecoratorKey.BLOCK_IF_NOT_MANAGER, block);
