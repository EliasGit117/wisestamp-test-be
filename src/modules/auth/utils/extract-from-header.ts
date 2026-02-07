import { FastifyRequest } from "fastify";

export function extractFromHeader(request: FastifyRequest, key: string): string | null {
  const fromHeader = request.headers?.[key];
  return Array.isArray(fromHeader) ? fromHeader[0] : fromHeader ?? null;
}
