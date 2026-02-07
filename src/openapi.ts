import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export async function configureOpenapi(app: NestFastifyApplication) {
  // TODO: Find a better way or migrate later to ESM
  const { apiReference } = await eval("import('@scalar/nestjs-api-reference')");

  const config = new DocumentBuilder()
    .setTitle("Admin API")
    .setDescription("Admin API documentation")
    .addApiKey({ type: "apiKey", in: "header", name: "x-session-id" }, "x-session-id")
    .setVersion("0.0.1")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true
    },
    jsonDocumentUrl: "/openapi.json",
    customSiteTitle: "Admin OpenAPI"
  });

  app.use("/docs", apiReference({
    url: "/openapi.json",
    withFastify: true,
    metaData: {
      title: "Admin Scalar docs"
    }
  }));
}
