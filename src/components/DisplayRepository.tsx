import { Stack, Avatar, Box, Link, Button, Typography } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import moment from "moment";
import { RepositoryWithFavourite } from "../App";

type Props = {
  repository: RepositoryWithFavourite;
  onFavouritePress: () => void;
};

export const DisplayRepository = function ({
  repository,
  onFavouritePress,
}: Props) {
  const date = moment(repository.node.updatedAt).format("MMM Do");
  return (
    <Stack
      sx={{
        backgroundColor: "primary.light",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: 5,
        minWidth: "350px",
        minHeight: "150px",
      }}
      direction="column"
      justifyContent="space-between"
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="20px"
      >
        <Stack
          sx={{ overflowWrap: "anywhere" }}
          minWidth="215px"
          direction="row"
          alignItems="center"
        >
          <Avatar
            src={repository.node.owner.avatarUrl}
            sx={{ marginRight: "10px" }}
          ></Avatar>
          <Link
            overflow="wrap"
            href={repository.node.url}
            underline="hover"
            target="_blank"
          >
            {" "}
            {repository.node.nameWithOwner}
          </Link>
        </Stack>
        <Button
          sx={{ minWidth: "130px" }}
          variant="contained"
          size="small"
          onClick={onFavouritePress}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {repository.isFavourite ? (
              <StarIcon fontSize="small" />
            ) : (
              <StarOutlineIcon fontSize="small" />
            )}
            <Typography>Favourite</Typography>
          </Stack>
        </Button>
      </Stack>
      <Typography gutterBottom sx={{ marginBottom: "20px" }}>
        {repository.node.description}
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <StarIcon />
          <Box>{repository.node.stargazerCount}</Box>
        </Stack>
        <Box>Updated on {date}</Box>
      </Stack>
    </Stack>
  );
};
