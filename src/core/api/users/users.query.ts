export const SEARCH_USERS = `
    query {
        usersCollection {
            edges {
                node {
                    id
                    username
                    email
                    active
                    created_at
                    last_login
                }
            }
        }
    }
  `;
