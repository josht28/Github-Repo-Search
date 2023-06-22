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
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { Dispatch, SetStateAction } from 'react';
import moment from 'moment';
type propType = {
  repository: Repository;
  SetFavouriteRepositories: Dispatch<SetStateAction<Repository[]>>;
};
export const DisplayRepository = function ({
  repository,
  SetFavouriteRepositories,
}: propType) {
  const date = moment(repository.node.updatedAt).format('MMM Do');
  const handleSetFavourite = function () {
    if (!repository.node.viewerHasStarred) {
      SetFavouriteRepositories((prevState) => [
        ...prevState,
        { ...repository, rating: 0 },
      ]);
      repository.node.viewerHasStarred = !repository.node.viewerHasStarred;
    }
  };
  return (
    <>
      <Box
        sx={{
          backgroundColor: '#EDF3F5',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: 5,
          minWidth: '350px',
          minHeight: '150px',
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
          <Button variant='contained' size='small' onClick={handleSetFavourite}>
            <Stack direction='row' spacing={1} alignItems='center'>
              {repository.node.viewerHasStarred ? (
                <StarIcon fontSize='small' />
              ) : (
                <StarOutlineIcon fontSize='small' />
              )}
              <Typography>Favourite</Typography>
            </Stack>
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
          <Stack direction='row' alignItems='center' spacing={0.5}>
            <Rating max={1}></Rating>
            <Box>{repository.node.stargazerCount}</Box>
          </Stack>
          <Box>Updated on {date}</Box>
        </Stack>
      </Box>
    </>
  );
};
