import { FastifyRequest } from "fastify";

export function extractFromCookies(request: FastifyRequest, key: string): string | null {
  return request.cookies[key] ?? null;
}
