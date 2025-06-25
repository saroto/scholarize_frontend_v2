/** @format */

"use client";
import * as React from "react";
import {
  styled,
  alpha,
  MenuItem,
  Select,
  Button,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { SelectChangeEvent } from "@mui/material/Select";
import { useState, useEffect } from "react";
import useSearchStore from "@/stores/useSearchStore";
import DisplayFilter from "./DisplayFilter";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  border: "1px solid",
  borderColor: "#ddd",
  height: "40px",
  backgroundColor: "white",
  "&:hover": {
    backgroundColor: "white",
  },

  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "100%",
  },

  display: "flex",
  // justifyContent: "space-between",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",

  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1rem + ${theme.spacing(4)})`,

    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      minWidth: "90%",
    },
  },
}));
export default function PrimarySearchAppBar() {
  const [sort, setSort] = React.useState("ASC");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchEngine, setSearchEngine] = useState("meilisearch");
  const handleSortSelectChange = (event: SelectChangeEvent<string>) => {
    setSort(event.target.value);
  };

  const { updateFilters } = useSearchStore();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value === "") {
      updateFilters({ search: "", sort, search_engine: searchEngine });
    }
  };

  const handleSearchClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateFilters({ search: searchTerm, sort, search_engine: searchEngine });
  };

  const handleSortChange = (sortOrder: string) => {
    updateFilters({ sort: sortOrder });
  };

  useEffect(() => {
    updateFilters({ search_engine: searchEngine });
    return () => {
      // This function will run when the component unmounts
      setSearchTerm("");
      updateFilters({ search: "", sort, search_engine: searchEngine });
    };
  }, []);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));
  // const value = searchEngine;

  const handleSearchEngineChange = (value: string) => {
    setSearchEngine(value);
    updateFilters({ search_engine: value });
  };
  const handleSearchEngineToggle = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    if (newValue !== null) {
      handleSearchEngineChange(newValue);
    }
  };

  return (
    <>
      {isLargeScreen && (
        <Box className="flex pb-2">
          <Box className="inline-flex rounded-2xl bg-gray-100 p-1">
            <button
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                searchEngine === "meilisearch"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "bg-transparent text-gray-600 hover:bg-gray-50"
              }`}
              onClick={(e) => handleSearchEngineToggle(e, "meilisearch")}
            >
              Keyword
            </button>
            <button
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                searchEngine === "semantic"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "bg-transparent text-gray-600 hover:bg-gray-50"
              }`}
              onClick={(e) => handleSearchEngineToggle(e, "semantic")}
            >
              Semantic
            </button>
          </Box>
        </Box>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {" "}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            width: "100%",
          }}
        >
          {" "}
          {!isLargeScreen && (
            <Box className="flex justify-center">
              <Box className="inline-flex rounded-2xl bg-gray-100 p-1 gap-1">
                <button
                  className={`rounded-xl px-4 py-1 text-sm font-medium transition-all ${
                    searchEngine === "meilisearch"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "bg-transparent text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={(e) => handleSearchEngineToggle(e, "meilisearch")}
                >
                  Keyword
                </button>
                <button
                  className={`rounded-xl px-4 py-1 text-sm font-medium transition-all ${
                    searchEngine === "semantic"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "bg-transparent text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={(e) => handleSearchEngineToggle(e, "semantic")}
                >
                  Semantic
                </button>
              </Box>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              // flex: 1,
              width: "100%",
            }}
          >
            {" "}
            <form onSubmit={handleSearchClick} className="flex w-full">
              <Search
                sx={{
                  borderRadius: "0.8rem",
                  display: "flex",
                  width: "100%",
                  // alignItems: "center",
                }}
              >
                <SearchIconWrapper>
                  <SearchIcon sx={{ color: "text.secondary", scale: "1.2" }} />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder={`Search with ${
                    searchEngine === "meilisearch"
                      ? "Meilisearch"
                      : "SPaRCS-AIM"
                  }...`}
                  inputProps={{ "aria-label": "search" }}
                  onChange={handleSearchChange}
                  value={searchTerm}
                  sx={{ width: "100%", fontSize: "12px" }}
                />
              </Search>
            </form>
          </Box>
          <Select
            value={sort}
            onChange={handleSortSelectChange}
            // inputProps={{ "aria-label": "With label" }}
            sx={{
              fontWeight: "500",
              textAlign: "center",
              border: "1px solid",
              borderColor: "#ddd",
              fontSize: "12px",
              borderRadius: "0.8rem",
              paddingInline: "16px",
              alignItems: "center",
              display: "flex",
              backgroundColor: "background.paper",
            }}
            disableUnderline
            variant="standard"
          >
            <MenuItem
              value="ASC"
              onClick={() => handleSortChange("ASC")}
              sx={{
                fontSize: "12px",
              }}
            >
              {isSmallScreen || isLargeScreen ? "ASC" : "Ascending"}
            </MenuItem>
            <MenuItem
              value="DESC"
              onClick={() => handleSortChange("DESC")}
              sx={{
                fontSize: "12px",
              }}
            >
              {isSmallScreen || isLargeScreen ? "DES" : "Descending"}
            </MenuItem>
          </Select>
        </Box>
        {!isSmallScreen && (
          <Box>
            <DisplayFilter />
          </Box>
        )}
      </Box>
    </>
  );
}
