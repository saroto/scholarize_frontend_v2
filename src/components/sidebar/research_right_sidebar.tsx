/** @format */

"use client";

import {
  Box,
  Typography,
  List,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Divider,
  Tooltip,
  Collapse,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ResearchPaper, SearchOptions, Department, PaperType } from "@/types";
import useSearchStore from "@/stores/useSearchStore";
import { useResearchPaperStore } from "@/stores/StoreResearchPaper";
import ExpandMoreRotate from "@/components/ui/icon/expand_more_rotate";

export default function DashboardRightSideBar() {
  const [uniqueTypes, setUniqueTypes] = useState<PaperType[]>([]);
  const [uniqueDepartments, setUniqueDepartments] = useState<Department[]>([]);
  const [uniqueYears, setUniqueYears] = useState<number[]>([]);

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

  const { filters, updateFilters } = useSearchStore();

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    category: keyof SearchOptions
  ) => {
    const checked = event.target.checked;
    const value = parseInt(event.target.value, 10);
    let newValues = checked
      ? [...(filters[category] as number[]), value]
      : (filters[category] as number[]).filter((item) => item !== value);
    updateFilters({ [category]: newValues });
  };

  const [expandResearchType, setExpandResearchType] = useState(false);
  const [expandDepartment, setExpandDepartment] = useState(false);
  const [expandYear, setExpandYear] = useState(false);

  return (
    <Box
      sx={{
        height: "100%",
        borderLeft: "1px solid #e0e0e0",
        overflowY: "auto",
        px: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          fontWeight: "450",
          pt: "1.2rem",
          pb: "0.7rem",
          borderBottom: "1px solid #000",
          // drop shadow border
          boxShadow: "0 1px 0 0 rgba(0,0,0,0.2)",
        }}
      >
        APPLY FILTER
      </Typography>
      <form>
        <List
          sx={{
            height: "100%",
            textDecoration: "none",
          }}
        >
          <FormGroup
            sx={{
              my: "0.5rem",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <Stack
              sx={{ px: "0.5rem" }}
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <Stack direction={"row"} alignItems={"center"} width={"100%"}>
                <Box
                  onClick={() => setExpandResearchType(!expandResearchType)}
                  sx={{
                    display: "flex",
                    cursor: "pointer",
                    width: "100%",
                    justifyContent: "space-between",
                    "&:hover": {
                      color: "rgb(90,90,90,90)",
                    },
                  }}
                  alignItems="center"
                >
                  <Typography variant="h6">PAPER TYPE</Typography>

                  <ExpandMoreRotate
                    title="Research type"
                    expand={expandResearchType}
                    sx={{
                      display: "flex",
                    }}
                  />
                </Box>
              </Stack>
            </Stack>

            <Collapse in={expandResearchType} timeout="auto" unmountOnExit>
              {uniqueTypes.map((type) => (
                <Tooltip title={type.name} key={type.id}>
                  <label className="flex flex-row align-center w-full cursor-pointer">
                    <Checkbox
                      checked={filters.research_type.includes(type.id)}
                      onChange={(e) => handleCheckboxChange(e, "research_type")}
                      value={type.id.toString()}
                      color="default"
                      sx={{
                        color: "#777",
                        display: "flex",
                      }}
                    />
                    <div className="text-[#333] block w-full my-auto truncate truncate-text">
                      <Typography variant="body1" noWrap>
                        {type.name}
                      </Typography>
                    </div>
                  </label>
                </Tooltip>
              ))}
            </Collapse>
          </FormGroup>

          <Divider />
          <FormGroup
            sx={{
              my: "0.5rem",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <Stack
              sx={{ px: "0.5rem" }}
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <Stack direction={"row"} alignItems={"center"} width={"100%"}>
                <Box
                  onClick={() => setExpandDepartment(!expandDepartment)}
                  sx={{
                    display: "flex",
                    cursor: "pointer",
                    width: "100%",
                    justifyContent: "space-between",
                    "&:hover": {
                      color: "rgb(90,90,90,90)",
                    },
                  }}
                  alignItems="center"
                >
                  <Typography variant="h6">DEPARTMENT</Typography>

                  <ExpandMoreRotate
                    title=""
                    expand={expandDepartment}
                    sx={{
                      display: "flex",
                    }}
                  />
                </Box>
              </Stack>
            </Stack>

            <Collapse in={expandDepartment} timeout="auto" unmountOnExit>
              {uniqueDepartments.map((department) => (
                <Tooltip title={department.name} key={department.id}>
                  <label className="flex flex-row align-center w-full cursor-pointer ">
                    <Checkbox
                      checked={filters.department.includes(department.id)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleCheckboxChange(e, "department")
                      }
                      color="default"
                      value={department.id.toString()}
                      sx={{
                        color: "#777",
                        display: "flex",
                      }}
                    />
                    <div className="text-[#333] block w-full my-auto truncate truncate-text">
                      <Typography
                        variant="body1"
                        // sx={{ width: "100%", whiteSpace: "wrap" }}
                      >
                        {department.name}
                      </Typography>
                    </div>
                  </label>
                </Tooltip>
              ))}
            </Collapse>
          </FormGroup>
          <Divider />
          <FormGroup
            sx={{
              my: "0.5rem",
            }}
          >
            <Stack
              sx={{ px: "0.5rem" }}
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <Stack direction={"row"} alignItems={"center"} width={"100%"}>
                <Box
                  onClick={() => setExpandYear(!expandYear)}
                  sx={{
                    display: "flex",
                    cursor: "pointer",
                    width: "100%",
                    justifyContent: "space-between",
                    "&:hover": {
                      color: "rgb(90,90,90,90)",
                    },
                  }}
                  alignItems="center"
                >
                  <Typography variant="h6">PUBLISH YEAR</Typography>

                  <ExpandMoreRotate
                    title=""
                    expand={expandYear}
                    sx={{
                      display: "flex",
                    }}
                  />
                </Box>
              </Stack>
            </Stack>
            <Collapse in={expandYear} timeout="auto" unmountOnExit>
              {uniqueYears.map((year, index) => (
                <label
                  className="flex flex-row align-center w-full cursor-pointer"
                  key={index}
                >
                  <Checkbox
                    checked={filters.year.toString().includes(year.toString())}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleCheckboxChange(e, "year")
                    }
                    color="default"
                    value={year}
                    sx={{
                      color: "#777",
                      display: "flex",
                    }}
                  />

                  <div className="text-[#333] block w-full my-auto truncate truncate-text">
                    <Typography variant="body1" noWrap>
                      {year}
                    </Typography>
                  </div>
                </label>
              ))}
            </Collapse>
          </FormGroup>
        </List>
      </form>
    </Box>
  );
}
