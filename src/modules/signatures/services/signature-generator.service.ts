import { SignatureTemplateId } from "../entities/signature.entity";
import { Injectable } from "@nestjs/common";
import * as Handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";


@Injectable()
export class SignatureGeneratorService {
  private readonly templates: Map<SignatureTemplateId, Handlebars.TemplateDelegate>;

  constructor() {
    this.templates = new Map();
    this.loadTemplates();
  }

  generateHtml(templateId: SignatureTemplateId, payload: Record<string, string>): string {
    const template = this.templates.get(templateId);
    if (!template)
      throw new Error(`Template not found: ${templateId}`);


    return template(payload);
  }

  generateText(payload: Record<string, string>,): string {
    return Object.values(payload)
      .filter((v) => v && v.trim().length > 0)
      .join("\n");
  }

  private loadTemplates(): void {
    this.registerTemplate(SignatureTemplateId.SimpleGreen, "simple-green.hbs",);

    this.registerTemplate(SignatureTemplateId.LightSquared, "light-squared.hbs",);
  }

  private registerTemplate(id: SignatureTemplateId, filename: string,): void {
    const filePath = path.join(process.cwd(), "src/modules/signatures/templates", filename,);

    const source = fs.readFileSync(filePath, "utf8");
    const compiled = Handlebars.compile(source, { noEscape: true });

    this.templates.set(id, compiled);
  }
}