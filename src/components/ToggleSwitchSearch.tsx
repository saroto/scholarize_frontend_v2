import { Box, Typography, IconButton } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { FC } from "react";

interface SemanticSearchToggleProps {
  searchEngine: string;
  onToggle: (
    e: React.MouseEvent<HTMLElement>,
    engine: "meilisearch" | "semantic"
  ) => void;
  onHelpMouseEnter: (e: React.MouseEvent<HTMLElement>) => void;
  onHelpMouseLeave: (e: React.MouseEvent) => void;
}

const ToggleSwitchSearch: FC<SemanticSearchToggleProps> = ({
  searchEngine,
  onToggle,
  onHelpMouseEnter,
  onHelpMouseLeave,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <Typography variant="h5" sx={{ color: "text.secondary" }}>
        Boost my search with Semantic Search
      </Typography>

      <IconButton
        aria-label="semantic search info"
        onMouseEnter={onHelpMouseEnter}
        onMouseLeave={onHelpMouseLeave}
      >
        <HelpIcon fontSize="small" />
      </IconButton>

      <Box className="flex">
        <Box
          className={`relative w-12 h-6 rounded-full transition-all cursor-pointer ${
            searchEngine === "semantic" ? "" : "bg-gray-300"
          }`}
          style={{
            backgroundColor:
              searchEngine === "semantic" ? "#0030aa" : undefined,
          }}
          onClick={(e) =>
            onToggle(
              e,
              searchEngine === "meilisearch" ? "semantic" : "meilisearch"
            )
          }
        >
          <Box
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
              searchEngine === "semantic" ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ToggleSwitchSearch;
