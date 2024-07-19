import { ConfigService } from "@nestjs/config";
import { createCipheriv, randomBytes, createDecipheriv, createHash } from "crypto";

export class EncryptionUtil {

  private cipherKey;
  private algorithm = 'aes-256-cbc';
  private iv = randomBytes(16);

  constructor(private configService: ConfigService) {
    this.cipherKey = createHash('sha512')
      .update(this.configService.get("ENCRYPTION_KEY"))
      .digest('hex')
      .substring(0,32);
  };

  getEncryptedValue (plainValue: any) {
        const cipher = createCipheriv(this.algorithm, this.cipherKey, this.iv);
        const ciphertext = cipher.update(plainValue, 'utf8', 'hex') + cipher.final('hex'); 
        return `${this.iv.toString('base64')}.${ciphertext}`;
  }

  getDecryptedValue(encryptedValue: any) {
      const split = encryptedValue.split('.');
      const iv = split[0];
      encryptedValue = split[1];
      const decipher = createDecipheriv(this.algorithm, this.cipherKey, Buffer.from(iv, 'base64'));
      return decipher.update(encryptedValue, 'hex', 'utf8') + decipher.final('utf8'); 
  }
}