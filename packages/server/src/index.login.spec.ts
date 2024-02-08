import { describe, expect, it, vi } from "vitest";
import { buildHTTPExecutor } from '@graphql-tools/executor-http'
import { yoga } from "./index"
import { parse } from "graphql";

describe("Login", () => {
    vi.mock('@tsndr/cloudflare-worker-jwt', async () => ({}))

    it("should return 404 when user not found", async () => {
        vi.mock('./utils/storage', async () => ({
            storage: () => ({
                put: () => {},
                get: () => {},
            })
        }))
        const exec = buildHTTPExecutor({ fetch: yoga.fetch });
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

        expect(result).toMatchInlineSnapshot(`
          {
            "data": {
              "login": null,
            },
            "errors": [
              {
                "locations": [
                  {
                    "column": 3,
                    "line": 2,
                  },
                ],
                "message": "User not found",
                "path": [
                  "login",
                ],
              },
            ],
          }
        `)
    })

    it("should return 401 when password incorrect", () => {})

    it("should return token when user found and password correct", () => {})
});