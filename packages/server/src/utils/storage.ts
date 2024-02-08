import { Env } from "../types";

export function storage(ctx: Env) {
    return ctx.kv;
}