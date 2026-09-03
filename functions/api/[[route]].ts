/**
 * Cloudflare Pages Functions Handler
 * Redirige todas las solicitudes /api/* al Worker central de CORSSEN
 */
import worker from "../../src/cloudflare-worker";

export const onRequest = async (context: { request: Request; env: any; [key: string]: any }) => {
    return worker.fetch(context.request, context.env, context);
};
