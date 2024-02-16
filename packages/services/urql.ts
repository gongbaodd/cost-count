import { GRAPHQL_URL as URL } from "@env";
import { Client, gql, fetchExchange } from "@urql/core";
import { UserStore } from "../models";

let token = "";
loadToken();

const client = new Client({
  url: URL,
  exchanges: [fetchExchange],
  fetchOptions: () => {
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  },
});

const loginMutation = gql`
  #graphql
  mutation loginMutation($email: EmailAddress!, $password: String!) {
    login(email: $email, password: $password) {
      email
      id
      token
    }
  }
`;

export async function login(email: string, password: string) {
  try {
    const data = await _login(email, password);
    return data;
  } catch (error) {
    console.error("Error logging in", error);
    return null;
  }
}

async function _login(email: string, password: string) {
  const result = await client
    .mutation<
      {
        login: {
          email: string;
          id: string;
          token: string;
        };
      },
      {
        email: string;
        password: string;
      }
    >(loginMutation, { email, password })
    .toPromise();
  const data = result.data?.login;

  if (data) {
    token = data.token;
    return data;
  }

  throw new Error("Invalid login");
}

async function loadToken() {
  const user = UserStore.getSnapshot();

  token = user?.token ?? token;
}

const listCategoriesQuery = gql`
  #graphql
  query listCategoriesQuery {
    categories {
      id
      name
    }
  }
`;

export async function listCategories() {
  try {
    return await _listCategories();
  } catch (error) {
    console.error("Error loading categories", error);
    return [];
  }
}

async function _listCategories() {
  await loadToken();

  if (!token) {
    throw new Error("Not logged in");
  }

  const result = await client
    .query<{
      categories: { id: string; name: string }[];
    }>(listCategoriesQuery, {})
    .toPromise();
  return result.data?.categories ?? [];
}

const addCategoryMutation = gql`
  #graphql
  mutation addCategoryMutation($name: String!) {
    addCategory(name: $name) {
      id
      name
    }
  }
`;

export async function addCategory(name: string) {
  try {
    return await _addCategory(name);
  } catch (error) {
    console.error("Error adding category", error);
    return null;
  }
}

async function _addCategory(name: string) {
  await loadToken();

  if (!token) {
    throw new Error("Not logged in");
  }

  const result = await client
    .mutation<
      {
        addCategory: { id: string; name: string };
      },
      { name: string }
    >(addCategoryMutation, { name })
    .toPromise();
  return result.data?.addCategory;
}

const listItemsQuery = gql`
  #graphql
  query listItemsQuery {
    records {
      date
      id
      name
      price
      type {
        id
        name
      }
    }
  }
`;

export async function listItems() {
  try {
    return await _listItems();
  } catch (error) {
    console.error("Error loading items", error);
    return [];
  }
}

async function _listItems() {
  await loadToken();

  if (!token) {
    throw new Error("Not logged in");
  }

  const result = await client
    .query<{
      records: {
        date: number;
        id: string;
        name: string;
        price: number;
        type: {
          id: string;
          name: string;
        };
      }[];
    }>(listItemsQuery, {})
    .toPromise();

  return result.data?.records ?? [];
}

const getItemQuery = gql`
  #graphql
  query getItemQuery($id: UUID!) {
    record(id: $id) {
      date
      id
      name
      price
      type
    }
  }
`;
export async function getItem(id: string) {
  try {
    return await _getItem(id);
  } catch (error) {
    console.error("Error loading item", error);
    return null;
  }
}

async function _getItem(id: string) {
  await loadToken();

  if (!token) {
    throw new Error("Not logged in");
  }

  const result = await client
    .query<{
      record: {
        date: number;
        id: string;
        name: string;
        price: number;
        type: string;
      };
    }>(getItemQuery, { id })
    .toPromise();
  return result.data?.record;
}

const addItemMutation = gql`
  #graphql
  mutation addItemMutation($name: String!, $price: Float!, $type: UUID!) {
    addRecord(name: $name, price: $price, type: $type) {
      date
      id
      name
      price
      type {
        id
        name
      }
    }
  }
`;

export async function addItem(name: string, price: number, type: string) {
  try {
    return await _addItem(name, price, type);
  } catch (error) {
    console.error("Error adding item", error);
    return null;
  }
}

async function _addItem(name: string, price: number, type: string) {
  await loadToken();

  if (!token) {
    throw new Error("Not logged in");
  }

  const result = await client
    .mutation<
      {
        addRecord: {
          date: number;
          id: string;
          name: string;
          price: number;
          type: {
            id: string;
            name: string;
          };
        };
      },
      {
        name: string;
        price: number;
        type: string;
      }
    >(addItemMutation, { name, price, type })
    .toPromise();
  return result.data?.addRecord;
}

const mutItemMutation = gql`
  #graphql
  mutation changeItemDateMutation($id: String!, $date: String, $type: String) {
    mutRecord(id: "", date: $date, type: $type) {
      date
      id
      name
      price
      type {
        id
        name
      }
    }
  }
`;

export async function mutItem(
  id: string,
  rest: { date: number; type: string }
) {
  try {
    return await _mutItem(id, rest);
  } catch (error) {
    console.error("Error changing item", error);
    return null;
  }
}

async function _mutItem(id: string, rest: { date: number; type: string }) {
  await loadToken();

  if (!token) {
    throw new Error("Not logged in");
  }

  const result = await client
    .mutation<
      {
        mutRecord: {
          date: number;
          id: string;
          name: string;
          price: number;
          type: {
            id: string;
            name: string;
          };
        };
      },
      {
        id: string;
        date: number;
        type: string;
      }
    >(mutItemMutation, { id, ...rest })
    .toPromise();
  return result.data?.mutRecord;
}

const delItemMutation = gql`
  #graphql
  mutation delItemMutation($id: UUID!) {
    delRecord(id: $id) {
      date
      id
      name
      price
      type {
        id
        name
      }
    }
  }
`;

export async function delItem(id: string) {
  try {
    return await _delItem(id);
  } catch (error) {
    console.error("Error deleting item", error);
    return null;
  }
}

async function _delItem(id: string) {
  await loadToken();

  if (!token) {
    throw new Error("Not logged in");
  }

  const result = await client
    .mutation<
      {
        delRecord: {
          date: number;
          id: string;
          name: string;
          price: number;
          type: {
            id: string;
            name: string;
          };
        };
      },
      { id: string }
    >(delItemMutation, { id })
    .toPromise();
  return result.data?.delRecord;
}
