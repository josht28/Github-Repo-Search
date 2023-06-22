import React, { useEffect } from 'react';
import './App.css';
import { Box, TextField, Grid, Stack, Tab, Button } from '@mui/material';
import { useState } from 'react';
import { Repository } from './datatypes';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { DisplayRepository } from './components/DisplayRepository';
import { FavouriteRepository } from './components/FavouriteReopistory';
import useDebounce from './hooks/useDebounce';
import {
  searchRepositories,
  searchMoreRepositories,
} from './ApiServices/RepositoryApi';

function App() {
  const [searchKey, SetSearchKey] = useState<string>('');
  const [searchedResults, SetSearchedResults] = useState<[] | Repository[]>([]);
  const [favouriteRepositories, SetFavouriteRepositories] = useState<Repository[]|[]>([]);
  const [currentTab, SetCurrentTab] = useState('search');
  const [cursor, setCursor] = useState<string | null>(null);
  const selectTab = function (event: React.SyntheticEvent, newValue: string) {
    SetCurrentTab(newValue);
  };
  const debouncedSearchKey = useDebounce(searchKey, 300);

  useEffect(() => {
    if (debouncedSearchKey) {
      searchRepositories(debouncedSearchKey).then((result) => {
        let finalResult = result.map((repository) => {
          if (
            favouriteRepositories.find(
              (repo) => repo.node.id === repository.node.id
            )
          ) {
            return {
              ...repository,
              node: { ...repository.node, viewerHasStarred: true },
            };
          } else {
            return repository;
          }
        });
        SetSearchedResults(finalResult);
        let lastCursor = result[result.length - 1].cursor;
        setCursor(lastCursor);
      });
    } else {
      SetSearchedResults([]);
    }
  }, [debouncedSearchKey]);

  const handleLoadMore = async function () {
    console.log(cursor);
    const additionalRepositories = await searchMoreRepositories(
      searchKey,
      cursor
    );
    if (additionalRepositories.length > 0) {
      let lastCursor =
        additionalRepositories[additionalRepositories.length - 1].cursor;
      setCursor(lastCursor);
      SetSearchedResults((prevState) => [
        ...prevState,
        ...additionalRepositories,
      ]);
    } else {
      setCursor(null);
    }
  };
  return (
    <>
      <Box>
        <Stack
          direction='row'
          justifyContent='space-around'
          alignItems='center'
          sx={{
            backgroundColor: '#FFFFFF',
          }}
        >
          <TextField
            variant='standard'
            helperText='Search for your favourite repository'
            sx={{
              paddingLeft: '20px',
              paddingRight: '20px',
              input: {
                color: '#005261',
              },
            }}
            fullWidth
            value={searchKey}
            onChange={(event) => {
              SetSearchKey(event.target.value);
            }}
          ></TextField>
        </Stack>
      </Box>
      <Box
        sx={{
          padding: '20px',
        }}
      >
        <Box>
          <TabContext value={currentTab}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <TabList aria-label='Tabs' onChange={selectTab}>
                <Tab label='Search Result' value='search' />
                <Tab label='Favourites' value='favourites' />
              </TabList>
            </Box>
            <TabPanel value='search'>
              <>
                <Grid container my={4} rowSpacing={4} columnSpacing={8}>
                  {searchedResults.length > 0 &&
                    searchedResults.map((repository) => (
                      <Grid item md={6} key={repository.node.id}>
                        <DisplayRepository
                          key={repository.node.id}
                          repository={repository}
                          SetFavouriteRepositories={SetFavouriteRepositories}
                        />
                      </Grid>
                    ))}
                </Grid>
              </>
              {cursor && (
                <Stack direction='row' justifyContent='center'>
                  <Button onClick={handleLoadMore}>Load more results</Button>
                </Stack>
              )}
            </TabPanel>
            <TabPanel value='favourites'>
              <>
                <Grid container my={4} rowSpacing={4} columnSpacing={8}>
                  {favouriteRepositories.length > 0 &&
                    favouriteRepositories.map((repository) => (
                      <Grid item sm={6} key={repository.node.id}>
                        <FavouriteRepository
                          key={repository.node.id}
                          repository={repository}
                          SetFavouriteRepositories={SetFavouriteRepositories}
                          favouriteRepositories={favouriteRepositories}
                          searchedResults={searchedResults}
                          SetSearchedResults={SetSearchedResults}
                        />
                      </Grid>
                    ))}
                </Grid>
              </>
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </>
  );
}

export default App;
