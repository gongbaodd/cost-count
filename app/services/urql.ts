import { Client, cacheExchange, gql, fetchExchange } from "@urql/core"

const URL = process.env.GRAPHQL_URL

if (!URL) {
    throw new Error("GRAPHQL_URL in .env is not set")
}

export const client = new Client({
    url: process.env.GRAPHQL_URL as string,
    exchanges: [cacheExchange, fetchExchange],
})