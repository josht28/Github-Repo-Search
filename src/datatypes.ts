export type Repository = {
  cursor: string;
  rating?:number|null
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
// export type FavouriteRepositoryType = Repository & {rating:number|null}
