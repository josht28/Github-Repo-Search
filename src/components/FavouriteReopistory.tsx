import { Repository } from '../datatypes';
import {
  Stack,
  Avatar,
  Box,
  Link,
  Rating,
  Button,
  Typography,
} from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import moment from 'moment';

type propType = {
  repository: Repository;
  SetFavouriteRepositories: Dispatch<SetStateAction<Repository[]>>;
  favouriteRepositories: Repository[];
  searchedResults: Repository[];
  SetSearchedResults: Dispatch<SetStateAction<Repository[]>>;
};
export const FavouriteRepository = function ({
  repository,
  SetFavouriteRepositories,
  favouriteRepositories,
  searchedResults,
  SetSearchedResults,
}: propType) {
  const date = moment(repository.node.updatedAt).format('MMM Do');
  const handleSetFavourite = function () {
    const newFavourites = favouriteRepositories.filter(
      (repo) => repo.node.id !== repository.node.id
    );
    SetFavouriteRepositories(newFavourites);
    const newSearchedResults = searchedResults.map((repo) =>
      repo.node.id !== repository.node.id
        ? repo
        : { ...repo, node: { ...repo.node, viewerHasStarred: false } }
    );
    SetSearchedResults(newSearchedResults);
  };

  const handleRating = function (
    event: React.SyntheticEvent,
    newValue: number | null
  ) {
    const updatedFavourites = favouriteRepositories.map((repo) =>
      repo.node.id !== repository.node.id ? repo : { ...repo, rating: newValue }
    );
    SetFavouriteRepositories(updatedFavourites);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#EDF3F5',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: 5,
        }}
      >
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          marginBottom='20px'
        >
          <Stack direction='row' alignItems='center'>
            <Avatar
              src={repository.node.owner.avatarUrl}
              sx={{ marginRight: '10px' }}
            ></Avatar>
            <Link href={repository.node.url} underline='hover' target='_blank'>
              {' '}
              {repository.node.nameWithOwner}
            </Link>
          </Stack>
          <Button
            variant='contained'
            color='error'
            size='small'
            onClick={handleSetFavourite}
          >
            Delete
          </Button>
        </Stack>
        <Typography gutterBottom sx={{ marginBottom: '20px' }}>
          {repository.node.description}
        </Typography>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Stack direction='row' alignItems='center' spacing={2}>
            {' '}
            <Stack direction='row' alignItems='center' spacing={0.5}>
              <Rating max={1}></Rating>
              <Box>{repository.node.stargazerCount}</Box>
            </Stack>
            <Box>Updated on {date}</Box>{' '}
          </Stack>
          <Box>
            {' '}
            {repository.rating ? (
              <Rating
                value={repository.rating}
                onChange={handleRating}
              ></Rating>
            ) : (
              <Rating
                value={repository.rating}
                onChange={handleRating}
              ></Rating>
            )}
          </Box>
        </Stack>
      </Box>
    </>
  );
};
