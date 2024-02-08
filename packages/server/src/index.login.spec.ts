import { describe, it, vi } from "vitest";
import { buildHTTPExecutor } from '@graphql-tools/executor-http'
import { yoga } from "./index"
import { parse } from "graphql";

describe("Login", () => {
    vi.mock('@tsndr/cloudflare-worker-jwt', async () => ({}))
    vi.mock('./utils/storage', async () => ({
        storage: () => ({
            put: () => {},
            get: () => {},
        })
    }))
    const exec = buildHTTPExecutor({ fetch: yoga.fetch });


    it("should return 404 when user not found", async () => {
        const result = await exec({
            document: parse(`#graphql
                mutation {
                    login(email: "gongbaodd@xxx.com", password: "123456") {
                        token
                        id
                        email
                    }
                }
            `) as any
        })
    })

    it("should return 401 when password incorrect", () => {})

    it("should return token when user found and password correct", () => {})
});