import { Repository } from '../datatypes';

export const searchRepositories = async function (
  searchKey: string
): Promise<Repository[]> {
  try {
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
    const result = await queryFetch(query);
    return result.data.search.edges;

  } catch (error) {
    console.log('error while retrieving results:', error);
    throw (error);
  }
};

export const searchMoreRepositories = async function (
  searchKey: string,
  cursor: string|null
): Promise<Repository[]> {
  try {
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
    const result = await queryFetch(query);
    return result.data.search.edges;

  } catch (error) {
    console.log('error while fetching more results:',error)
  throw(error)
  }
};
const queryFetch = async function (query:string) {
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
  return result

}
