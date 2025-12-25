import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SwaggerConfigService {
  constructor(private readonly config: ConfigService) {}

  build(): Omit<OpenAPIObject, 'paths'> {
    const authOptions = {
      type: 'http' as const,
      scheme: 'bearer' as const,
      bearerFormat: 'JWT',
    }

    const apiKeyOptions = {
      type: 'apiKey' as const,
      in: 'header' as const,
      name: 'X-Api-Key',
      description: 'Enter your API key to access this endpoint',
    }

    return new DocumentBuilder()
      .setTitle(this.config.get<string>('APP_TITLE') || 'EduVerse')
      .setDescription(this.config.get<string>('APP_DESCRIPTION') || 'An advanced elearning platform backend')
      .setVersion(this.config.get<string>('APP_VERSION') || '1.0')
      .addBearerAuth(authOptions, 'JWT-Auth')
      .addApiKey(apiKeyOptions, 'Api-Key-Auth')
      .addServer(this.config.get<string>('SWAGGER_SERVER_DEV') || 'http://localhost:8080', 'Development')
      .addServer(this.config.get<string>('SWAGGER_SERVER_PROD') || 'https://eduverseapi-production.up.railway.app', 'Production')
      .build()
  }
}
