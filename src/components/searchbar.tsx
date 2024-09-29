/** @format */

"use client";
import * as React from "react";
import { styled, alpha, MenuItem, Select, Button, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { SelectChangeEvent } from "@mui/material/Select";
import { useState, useEffect } from "react";
import useSearchStore from "@/stores/useSearchStore";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  // borderRadius: "14px",
  border: "1px solid black",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
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
      width: "58rem",
    },
  },
}));

export default function PrimarySearchAppBar() {
  const [sort, setSort] = React.useState("ASC");
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSort(event.target.value);
  };

  const { updateFilters } = useSearchStore();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value === "") {
      updateFilters({ search: "", sort });
    }
  };

  const handleSearchClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateFilters({ search: searchTerm, sort });
  };

  const handleSortChange = (sortOrder: string) => {
    updateFilters({ sort: sortOrder });
  };

  useEffect(() => {
    return () => {
      // This function will run when the component unmounts
      setSearchTerm("");
      updateFilters({ search: "", sort });
    };
  }, []);

  return (
    <div className="flex w-[100%] p-4 justify-between">
      <form onSubmit={handleSearchClick} className="flex m-0 p-0 w-10/12">
        <Search sx={{ borderRadius: "0.8rem", display: "flex" }}>
          <Box sx={{ width: "100%" }}>
            <SearchIconWrapper sx={{ padding: "0.5rem" }}>
              <SearchIcon sx={{ color: "black", scale: "1.2" }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={handleSearchChange}
              value={searchTerm}
              sx={{ width: "100%" }}
            />
          </Box>
        </Search>
      </form>

      <div className="m-0 p-0 w-2/12 flex justify-center pl-4">
        <Select
          value={sort}
          onChange={handleChange}
          // inputProps={{ "aria-label": "With label" }}
          sx={{
            fontWeight: "500",
            textAlign: "center",
            border: "1px solid black",
            fontSize: "1rem",
            borderRadius: "0.8rem",
            width: "100%",
          }}
          disableUnderline
          autoWidth
          variant="standard"
        >
          <MenuItem value="ASC" onClick={() => handleSortChange("ASC")}>
            Ascending
          </MenuItem>
          <MenuItem value="DESC" onClick={() => handleSortChange("DESC")}>
            Descending
          </MenuItem>
        </Select>
      </div>
    </div>
  );
}
