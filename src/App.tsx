import React, { useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, TextField, Grid, Stack, Tab, Button } from "@mui/material";
import { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { DisplayRepository } from "./components/DisplayRepository";
import { FavouriteRepository } from "./components/FavouriteRepository";
import useDebounce from "./hooks/useDebounce";
import {
  searchRepositories,
  searchMoreRepositories,
  Repository,
} from "./api-services/repositories";

const theme = createTheme({
  palette: {
    primary: {
      main: "#005261",
      light: "#EDF3F5",
    },
    secondary: {
      main: "#31C7AD",
    },
  },
});

export type RepositoryWithFavourite = Repository & { isFavourite: boolean };
type TabName = "search" | "favourite";

type Search = {
  results: RepositoryWithFavourite[];
  cursor: string | null;
};

const EMPTY_SEARCH = {
  results: [],
  cursor: null,
};

const createResultWithFavorite = (
  repositories: Repository[],
  favouriteRepositories: RepositoryWithFavourite[]
) => {
  return repositories.map((repository) => {
    if (
      favouriteRepositories.find(
        (favouriteRepo) => favouriteRepo.node.id === repository.node.id
      )
    ) {
      return {
        ...repository,
        isFavourite: true,
      };
    } else {
      return {
        ...repository,
        isFavourite: false,
      };
    }
  });
};

const updatedCursor = (repositories: Repository[]) => {
  if (repositories.length === 10) {
    return repositories[repositories.length - 1].cursor;
  } else {
    return null;
  }
};

function App() {
  const [searchKey, setSearchKey] = useState<string>("");
  const [search, setSearch] = useState<Search>(EMPTY_SEARCH);
  const [favouriteRepositories, setFavouriteRepositories] = useState<
    RepositoryWithFavourite[]
  >([]);
  const [currentTab, setCurrentTab] = useState<TabName>("search");
  const selectTab = (event: React.SyntheticEvent, tab: TabName) =>
    setCurrentTab(tab);

  const debouncedSearchKey = useDebounce(searchKey, 300);

  useEffect(() => {
    if (debouncedSearchKey) {
      searchRepositories(debouncedSearchKey).then((repositories) => {
        setSearch({
          results: createResultWithFavorite(
            repositories,
            favouriteRepositories
          ),
          cursor: updatedCursor(repositories),
        });
      });
    } else {
      setSearch(EMPTY_SEARCH);
    }
  }, [debouncedSearchKey, favouriteRepositories]);

  const handleLoadMore = async function () {
    const additionalRepositories = await searchMoreRepositories(
      searchKey,
      search.cursor
    );

    const additionalRepositoriesWithFavorite = createResultWithFavorite(
      additionalRepositories,
      favouriteRepositories
    );

    setSearch((prevState) => ({
      results: [...prevState.results, ...additionalRepositoriesWithFavorite],
      cursor: updatedCursor(additionalRepositories),
    }));
  };

  const deleteFavourite = (repositoryId: string) => {
    setFavouriteRepositories((prevState) =>
      prevState.filter((repo) => repo.node.id !== repositoryId)
    );

    const newSearchedResults = search.results.map((repo) =>
      repo.node.id !== repositoryId
        ? repo
        : {
            ...repo,
            isFavourite: false,
          }
    );
    setSearch((prevState) => ({
      ...prevState,
      results: newSearchedResults,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          sx={{
            backgroundColor: "#FFFFFF",
          }}
        >
          <TextField
            variant="standard"
            helperText="Search for your favourite repository"
            sx={{
              paddingLeft: "20px",
              paddingRight: "20px",
              input: {
                color: "primary.main",
              },
            }}
            fullWidth
            value={searchKey}
            onChange={(
              event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => setSearchKey(event.target.value)}
          ></TextField>
        </Stack>
      </Box>
      <Box
        sx={{
          padding: "20px",
        }}
      >
        <Box>
          <TabContext value={currentTab}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <TabList
                aria-label="Tabs"
                onChange={selectTab}
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab label="Search Result" value="search" />
                <Tab label="Favourites" value="favourites" />
              </TabList>
            </Box>
            <TabPanel value="search">
              <Grid
                container
                my={4}
                rowSpacing={4}
                columnSpacing={8}
                justifyContent="center"
              >
                {search.results.length > 0 &&
                  search.results.map((repository) => (
                    <Grid item md={6} sm={8} key={repository.node.id}>
                      <DisplayRepository
                        key={repository.node.id}
                        repository={repository}
                        onFavouritePress={() => {
                          if (!repository.isFavourite) {
                            setFavouriteRepositories((prevState) => [
                              ...prevState,
                              {
                                ...repository,
                                isFavourite: !repository.isFavourite,
                                rating: 0,
                              },
                            ]);
                          }
                        }}
                      />
                    </Grid>
                  ))}
              </Grid>
              {search.cursor && (
                <Stack direction="row" justifyContent="center">
                  <Button onClick={handleLoadMore}>Load more results</Button>
                </Stack>
              )}
            </TabPanel>
            <TabPanel value="favourites">
              <Grid container my={4} rowSpacing={4} columnSpacing={8}>
                {favouriteRepositories.length > 0 &&
                  favouriteRepositories.map((repository) => (
                    <Grid item md={6} sm={8} key={repository.node.id}>
                      <FavouriteRepository
                        key={repository.node.id}
                        repository={repository}
                        onFavoriteDeletePress={() =>
                          deleteFavourite(repository.node.id)
                        }
                        onRatingPress={(rating) => {
                          setFavouriteRepositories((prevState) =>
                            prevState.map((repo) =>
                              repo.node.id !== repository.node.id
                                ? repo
                                : { ...repo, rating }
                            )
                          );
                        }}
                      />
                    </Grid>
                  ))}
              </Grid>
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
