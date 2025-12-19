import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { CustomDecoratorKey } from 'src/common/custom-decorator-keys';

/**
 * Allows completely bypassing auth for a given route.
 * This is different from `BlockIfUnauthorized` in that we don't waste any time
 * trying to authenticate the user (example use case is on proxy routes).
 */
export const Public = (): CustomDecorator => SetMetadata(CustomDecoratorKey.PUBLIC, true);
