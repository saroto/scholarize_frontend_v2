import { useResearchPaperStore } from "@/stores/StoreResearchPaper";
import useSearchStore, { SearchStoreState } from "@/stores/useSearchStore";
import { Department, PaperType, ResearchPaper } from "@/types";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export default function DisplayFilter() {
  const { filters, updateFilters } = useSearchStore();
  const [uniqueTypes, setUniqueTypes] = useState<PaperType[]>([]);
  const [uniqueDepartments, setUniqueDepartments] = useState<Department[]>([]);
  const [uniqueYears, setUniqueYears] = useState<number[]>([]);
  const searchEngineLabelMap: Record<string, string> = {
    meilisearch: "Keyword",
    semantic: "Semantic",
  };
  const getSearchEngineLabel = (engine: string) =>
    searchEngineLabelMap[engine] || engine;

  const [selectedType, setSelectedType] = useState<number[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<string[]>([]);
  const [selectedSearchEngine, setSelectedSearchEngine] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("");

  useEffect(() => {
    setSelectedType(filters.research_type);
    setSelectedDepartment(filters.department);
    setSelectedYear(filters.year);
    setSelectedSearchEngine(filters.search_engine);
    setSelectedSort(filters.sort);
  }, [filters]);

  const selectedTypeLabels = selectedType
    .map((id) => uniqueTypes.find((type) => type.id === id)?.name)
    .filter(Boolean);

  const selectedDepartmentLabels = selectedDepartment
    .map(
      (id) => uniqueDepartments.find((dept) => dept.id === id)?.department_tag
    )
    .filter(Boolean);

  const selectedYearLabels = selectedYear.map((year) => Number(year));

  const { papers, setPapers } = useResearchPaperStore();
  useEffect(() => {
    if (papers) {
      setPapers(papers);
      extractUniqueFilters(papers as any);
    }
  }, [papers]);

  const extractUniqueFilters = (papers: ResearchPaper[]) => {
    const research_types = Array.from(
      papers
        .flatMap((r) => ({
          name: r.research_type.ResearchTypeName,
          id: r.research_type.ResearchTypeID,
        }))
        .reduce((map, item) => map.set(item.name, item), new Map())
        .values()
    );
    const departments = Array.from(
      papers
        .flatMap((d) =>
          d.departments.map((d) => ({
            name: d.department_name,
            department_tag: d.department_tag,
            id: d.department_id,
          }))
        )
        .reduce((map, item) => map.set(item.name, item), new Map())
        .values()
    );
    const years = Array.from(
      papers
        .flatMap((y) => y.published_at.split("-")[0])
        .reduce((map, item) => map.set(item, item), new Map())
        .values()
    );

    setUniqueTypes(
      [...research_types].sort((a, b) => a.name.localeCompare(b.name))
    );
    setUniqueDepartments(
      [...departments].sort((a, b) => a.name.localeCompare(b.name))
    );
    setUniqueYears([...years].sort((a, b) => b - a));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 4,
        flexWrap: "wrap",
        alignItems: "center",
        mt: 2,
      }}
    >
      {selectedSearchEngine.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Search Engine:
          </Typography>
          {renderPill(getSearchEngineLabel(selectedSearchEngine))}
        </Box>
      )}

      {selectedSort.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Sort By:
          </Typography>
          {renderPill(selectedSort)}
        </Box>
      )}

      {selectedTypeLabels.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Types:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {selectedTypeLabels.map((label) => renderPill(label))}
          </Box>
        </Box>
      )}

      {selectedDepartmentLabels.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Departments:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {selectedDepartmentLabels.map((label) => renderPill(label))}
          </Box>
        </Box>
      )}

      {selectedYearLabels.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Years:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {selectedYearLabels.map((year) => renderPill(String(year)))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

const generateRandomColor = () => {
  const colors = [
    "#e0f7fa",
    "#e8f5e9",
    "#f3e5f5",
    "#fff3e0",
    "#ede7f6",
    "#fbe9e7",
    "#e1f5fe",
    "#f9fbe7",
    "#fce4ec",
    "#e8eaf6",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const renderPill = (label?: string) => (
  <Box
    key={label}
    sx={{
      px: 1.5,
      py: 0.5,
      borderRadius: 2,
      backgroundColor: generateRandomColor(),
      color: "black",
    }}
  >
    <Typography
      variant="body2"
      sx={{
        fontWeight: 400,
      }}
    >
      {label}
    </Typography>
  </Box>
);
