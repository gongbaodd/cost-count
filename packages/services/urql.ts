import { GRAPHQL_URL as URL } from "@env";
import { Client, cacheExchange, gql, fetchExchange } from "@urql/core";
import AsyncStorage from "@react-native-async-storage/async-storage";

let token = "";
loadToken();

const client = new Client({
  url: URL,
  exchanges: [
    // cacheExchange, 
    fetchExchange
  ],
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
    .mutation(loginMutation, { email, password })
    .toPromise();
  const data = result.data.login as {
    email: string;
    id: string;
    token: string;
  };

  if (data) {
    token = data.token;

    await Promise.all([AsyncStorage.setItem("token", token)]);

    return data;
  }

  throw new Error("Invalid login");
}

async function loadToken() {
  token = (await AsyncStorage.getItem("token")) || "";
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

export async function listCategories(){
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

  const result = await client.query(listCategoriesQuery, {}).toPromise();
  return result.data.categories as { id: string; name: string }[];
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
    .mutation(addCategoryMutation, { name })
    .toPromise();
  return result.data.addCategory as { id: string; name: string };
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

  const result = await client.query(listItemsQuery, {}).toPromise();
  return result.data.records as {
    date: number;
    id: string;
    name: string;
    price: number;
    type: {
      id: string
      name: string
    }
  }[];
}

const getItemQuery = gql`#graphql
  query getItemQuery($id: UUID!) {
    record(id: $id) {
      date
      id
      name
      price
      type
    }
  }
`
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

  const result = await client.query(getItemQuery, { id }).toPromise();
  return result.data.record as {
    date: number;
    id: string;
    name: string;
    price: number;
    type: string;
  };
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
    .mutation(addItemMutation, { name, price, type })
    .toPromise();
  return result.data.addRecord as {
    date: number;
    id: string;
    name: string;
    price: number;
    type: {
      id: string
      name: string
    };
  };
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

async function _mutItem(
  id: string,
  rest: { date: number; type: string }
) {
  await loadToken();

  if (!token) {
    throw new Error("Not logged in");
  }

  const result = await client
    .mutation(mutItemMutation, { id, ...rest })
    .toPromise();
  return result.data.mutRecord as {
    date: number;
    id: string;
    name: string;
    price: number;
    type: {
      id: string
      name: string
    };
  };
}

const delItemMutation = gql`
  #graphql
  mutation delItemMutation($id: UUID!) {
    delRecord(id: $id) {
      date
      id
      name
      price
      type
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

  const result = await client.mutation(delItemMutation, { id }).toPromise();
  return result.data.delRecord as {
    date: number;
    id: string;
    name: string;
    price: number;
    type: string;
  };
}
