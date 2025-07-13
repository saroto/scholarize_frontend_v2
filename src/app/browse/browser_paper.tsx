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
  Container,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useCallback, useEffect, useState } from "react";
import { getBrowserPaper } from "@/app/api/service/browser-paper";
import { Paper } from "@/types";
import BrowserPaperCard from "./browser_paper_card";
import Promotion from "./promotion";

import Image from "next/image";
import ToggleSwitchSearch from "@/components/ToggleSwitchSearch";
import useSearchStore from "@/stores/useSearchStore";
import CustomPopper from "@/components/CustomPopper";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  border: "1px solid",
  borderColor: "#CFCFCF",
  height: "50px",
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

export default function BrowserPaper() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTryNow, setIsTryNow] = useState(true);
  const { updateFilters } = useSearchStore();
  const [searchEngine, setSearchEngine] = useState<"meilisearch" | "semantic">(
    "meilisearch"
  );

  const fetchPapers = async (term: string) => {
    if (term === "") {
      setSearchResult([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const res = await getBrowserPaper(term, searchEngine);
    setSearchResult(res.papers);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPapers(searchTerm);
  }, [searchEngine]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? "info-popper" : undefined;
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleSearchClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim() !== "") {
      fetchPapers(searchTerm);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // debouncedFetchPapers(event.target.value);
  };

  const handleSearchEngineChange = (value: "meilisearch" | "semantic") => {
    setSearchEngine(value);
    updateFilters({ search_engine: value });
  };

  const handleSearchEngineToggle = (
    _: React.MouseEvent<HTMLElement>,
    newValue: "meilisearch" | "semantic"
  ) => {
    if (newValue !== null) {
      handleSearchEngineChange(newValue);
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
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "100%", md: "60%", lg: "60%" },
            justifyContent: "center",
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
              <Typography
                variant="h1"
                sx={{ textAlign: "center", fontWeight: 500 }}
              >
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
              <Search
                sx={{
                  borderRadius: "0.8rem",
                  display: "flex",
                }}
              >
                <Box
                  sx={{ width: "100%", display: "flex", alignItems: "center" }}
                >
                  <SearchIconWrapper>
                    <SearchIcon sx={{ color: "#707070", scale: "1.2" }} />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Explore research papers..."
                    inputProps={{ "aria-label": "search" }}
                    onChange={handleSearchChange}
                    value={searchTerm}
                    sx={{ width: "100%", color: "#34322D" }}
                  />
                </Box>
              </Search>
            </form>
          </div>
          <ToggleSwitchSearch
            searchEngine={searchEngine}
            onToggle={(e, engine) => handleSearchEngineToggle(e, engine)}
            onHelpMouseEnter={handleMouseEnter}
            onHelpMouseLeave={handleMouseLeave}
          />

          <div className="mt-4">{content}</div>
          {/* {!isTryNow ? (
            <BrowserPaperCard
              key={searchResult[0].public_id}
              paper={searchResult[0]}
            />
          ) : null} */}

          {(searchResult && searchResult.length > 0) || isLoading ? null : (
            <Container
              sx={{
                display: "flex",
                justifyContent: "center",
                paddingBlock: "10px",
                paddingInline: 0,
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "100%",
                    lg: "80%",
                  },
                  height: {
                    xs: "100%",
                    sm: "100%",
                    md: "100%",
                    lg: "80%",
                  },
                }}
              >
                {isTryNow && (
                  <Promotion setIsOpen={setIsTryNow} open={isTryNow} />
                )}
              </Box>
            </Container>
          )}
        </Box>
      </Box>
      <CustomPopper id={id} open={open} anchorEl={anchorEl}>
        <div
          style={{
            padding: "8px",
            maxWidth: "240px",
            fontSize: "0.875rem",
            color: "#555",
          }}
        >
          Configure your result - semantic search power all the results with the
          help of AI
        </div>
      </CustomPopper>
    </>
  );
}
