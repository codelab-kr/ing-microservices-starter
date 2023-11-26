import * as dotenv from 'dotenv';
import * as path from 'path';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(private readonly filePath?: string) {
    this.envConfig = dotenv.config({
      path: path.resolve(filePath ?? './.env'),
    }).parsed;
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
