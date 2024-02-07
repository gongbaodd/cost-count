import { GRAPHQL_URL as URL } from "@env"
import { Client, cacheExchange, gql, fetchExchange } from "@urql/core"

let token = ""

const client = new Client({
  url: URL,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    }
  },
})

const loginMutation = gql`
  #graphql
  mutation loginMutation($email: EmailAddress!, $password: String!) {
    login(email: $email, password: $password) {
      email
      id
      token
    }
  }
`
export async function login(email: string, password: string) {
  const result = await client.mutation(loginMutation, { email, password }).toPromise()
  const data = result.data.login as { email: string; id: string; token: string }

  if (data) {
    token = data.token
    return data
  }

  throw new Error("Invalid login")
}

const listCategoriesQuery = gql`
  #graphql
  query listCategoriesQuery {
    categories {
      id
      name
    }
  }
`

export async function listCategories() {
  const result = await client.query(listCategoriesQuery, {}).toPromise()
  return result.data.categories as { id: string; name: string }[]
}

const addCategoryMutation = gql`
  #graphql
  mutation addCategoryMutation($name: String!) {
    addCategory(name: $name) {
      id
      name
    }
  }
`

export async function addCategory(name: string) {
  const result = await client.mutation(addCategoryMutation, { name }).toPromise()
  return result.data.addCategory as { id: string; name: string }
}

const listItemsQuery = gql`
  #graphql
  query listItemsQuery {
    records {
      date
      id
      name
      price
      type
    }
  }
`

export async function listItems() {
  const result = await client.query(listItemsQuery, {}).toPromise()
  return result.data.records as {
    date: number
    id: string
    name: string
    price: number
    type: string
  }[]
}

const addItemMutation = gql`
  #graphql
  mutation addItemMutation($name: String!, $price: Float!, $type: String!) {
    addRecord(name: $name, price: $price, type: $type) {
      date
      id
      name
      price
      type
    }
  }
`

export async function addItem(name: string, price: number, type: string) {
  const result = await client.mutation(addItemMutation, { name, price, type }).toPromise()
  return result.data.addRecord as {
    date: number
    id: string
    name: string
    price: number
    type: string
  }
}

const mutItemMutation = gql`
  #graphql
  mutation changeItemDateMutation($id: String!, $date: String, $type: String) {
    mutRecord(id: "", date: $date, type: $type) {
      date
      id
      name
      price
      type
    }
  }
`
export async function mutItem(id: string, rest: { date: number; type: string }) {
  const result = await client.mutation(mutItemMutation, { id, ...rest }).toPromise()
  return result.data.mutRecord as {
    date: number
    id: string
    name: string
    price: number
    type: string
  }
}

const delItemMutation = gql`
  #graphql
  mutation delItemMutation($id: String!) {
    delRecord(id: $id) {
      date
      id
      name
      price
      type
    }
  }
`

export async function delItem(id: string) {
  const result = await client.mutation(delItemMutation, { id }).toPromise()
  return result.data.delRecord as {
    date: number
    id: string
    name: string
    price: number
    type: string
  }
}
