import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import crypto from 'crypto';

@Injectable()
export class EncryptInterceptor implements NestInterceptor {
  private key = 'my-secret-key';

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const json = JSON.stringify(data);

        var encrypted;
        if (process.env.ENABLE_ENCRYPT === 'true') {
          encrypted = CryptoJS.AES.encrypt(json, this.key).toString();
        } else {
          encrypted = json;
        }

        return encrypted;
      }),
    );
  }
}
