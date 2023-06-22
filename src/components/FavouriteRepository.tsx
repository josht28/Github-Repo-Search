import {
  Stack,
  Avatar,
  Box,
  Link,
  Rating,
  Button,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import moment from "moment";
import { Repository } from "../api-services/repositories";

type Props = {
  repository: Repository;
  onFavoriteDeletePress: () => void;
  onRatingPress: (rating: Repository["rating"]) => void;
};

export function FavouriteRepository({
  repository,
  onFavoriteDeletePress,
  onRatingPress,
}: Props) {
  const date = moment(repository.node.updatedAt).format("MMM Do");

  const handleRating = (event: React.SyntheticEvent, newValue: number | null) =>
    onRatingPress(newValue);

  return (
    <Stack
      sx={{
        backgroundColor: "#EDF3F5",
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
          />
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
          color="error"
          size="small"
          onClick={onFavoriteDeletePress}
        >
          Delete
        </Button>
      </Stack>
      <Typography gutterBottom sx={{ marginBottom: "20px" }}>
        {repository.node.description}
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={2}>
          {" "}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <StarIcon />
            <Box>{repository.node.stargazerCount}</Box>
          </Stack>
          <Box>Updated on {date}</Box>{" "}
        </Stack>
        <Box>
          {" "}
          {repository.rating ? (
            <Rating value={repository.rating} onChange={handleRating}></Rating>
          ) : (
            <Rating value={repository.rating} onChange={handleRating}></Rating>
          )}
        </Box>
      </Stack>
    </Stack>
  );
}
