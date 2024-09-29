/** @format */

"use client";
import Navbar from "@/app/(landing)/navbar";
import {
  alpha,
  Box,
  InputBase,
  styled,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useCallback, useState } from "react";
import { getBrowserPaper } from "@/app/api/service/browser-paper";
import { Paper } from "@/types";
import BrowserPaperCard from "./browser_paper_card";

import Image from "next/image";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
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
      minWidth: "90%",
    },
  },
}));

export default function BrowserPaper() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchPapers = async (term: string) => {
    if (term === "") {
      setSearchResult([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const res = await getBrowserPaper(term);
    setSearchResult(res.papers);
    setIsLoading(false);
  };

  // Use useCallback to memoize the debounced function
  // const debouncedFetchPapers = useCallback(debounce(fetchPapers, 300), []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // debouncedFetchPapers(event.target.value);
  };
  const handleSearchClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim() !== "") {
      fetchPapers(searchTerm);
    }
  };

  // Extract the nested ternary operation into an independent statement
  let content;
  if (isLoading) {
    content = (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  } else if (searchResult && searchResult !== null) {
    content = searchResult.map((paper) => (
      <BrowserPaperCard key={paper.research_paper_id} paper={paper} />
    ));
  } else {
    content = (
      <Box sx={{ justifyContent: "center", textAlign: "center" }}>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#777777",
            fontStyle: "italic",
            marginTop: 4,
          }}
        >
          No papers found
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#ECECEC",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            width: "60%",
            justifyContent: "center",
            backgroundColor: "#ECECEC",
            minHeight: "100vh",
            px: "1rem",
          }}
        >
          {/* Logo Block Box */}
          <Box
            sx={{
              width: "100%",
              justifyContent: "center",
              mt: "6rem",
              mb: "2rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "3rem",
                alignItems: "center",
              }}
            >
              <Image
                src="/logo.png"
                alt="Scholarize"
                width={100}
                height={100}
              />
              <Typography variant="h3" sx={{ textAlign: "center" }}>
                Scholarize Repository
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Scholarize Brings Researchers Together
              </Typography>
            </Box>
          </Box>

          {/* Search Box */}
          <div className="flex w-[100%] justify-center">
            <form
              onSubmit={handleSearchClick}
              className="flex m-0 p-0 w-[100%] justify-center"
            >
              <Search sx={{ borderRadius: "0.8rem", display: "flex" }}>
                <Box sx={{ width: "100%" }}>
                  <SearchIconWrapper sx={{ padding: "0.5rem" }}>
                    <SearchIcon sx={{ color: "black", scale: "1.2" }} />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Explore research papers..."
                    inputProps={{ "aria-label": "search" }}
                    onChange={handleSearchChange}
                    value={searchTerm}
                    sx={{ width: "100%" }}
                  />
                </Box>
              </Search>
            </form>
          </div>

          <div className="mt-4">{content}</div>
        </Box>
      </Box>
    </>
  );
}
