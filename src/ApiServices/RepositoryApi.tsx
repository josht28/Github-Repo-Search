import { Repository } from '../datatypes';

export const searchRepositories = async function (
  searchKey: string
): Promise<Repository[]> {
  const query = `
    {
  search(query: "${searchKey}", type: REPOSITORY, first: 10) {
    edges {
      node {
        ... on Repository {
          owner {
            avatarUrl
          }
          id
          name
          updatedAt
          viewerHasStarred
          url
          nameWithOwner
          stargazerCount
          description
        }
      }
      cursor
    }
  }
}`;
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN} `,
    },
    body: JSON.stringify({
      query: query,
    }),
  });
  const result = await response.json();
  return result.data.search.edges;
};
export const searchMoreRepositories = async function (
  searchKey: string,
  cursor: string|null
): Promise<Repository[]> {
  const query = `
    {
  search(query: "${searchKey}", type: REPOSITORY, after : "${cursor}" first: 10) {
    edges {
      node {
        ... on Repository {
          owner {
            avatarUrl
          }
          id
          name
          updatedAt
          viewerHasStarred
          url
          nameWithOwner
          stargazerCount
          description
        }
      }
      cursor
    }
  }
}`;
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN} `,
    },
    body: JSON.stringify({
      query: query,
    }),
  });
  const result = await response.json();
  return result.data.search.edges;
};
