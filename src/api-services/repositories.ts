export type Repository = {
  cursor: string;
  rating?: number | null;
  node: {
    id: string;
    name: string;
    updatedAt: string;
    nameWithOwner: string;
    stargazerCount: number;
    url: string;
    viewerHasStarred: boolean;
    description: string;
    owner: {
      avatarUrl: string;
    };
  };
};

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
    // TODO: Use a solution like Sentry to track errors
    console.error("error while retrieving results:", error);

    return [];
  }
};

export const searchMoreRepositories = async function (
  searchKey: string,
  cursor: string | null
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
    // TODO: Use a solution like Sentry to track errors
    console.log("error while fetching more results:", error);

    return [];
  }
};

const queryFetch = async function (query: string) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN} `,
    },
    body: JSON.stringify({
      query: query,
    }),
  });

  return response.json();
};
