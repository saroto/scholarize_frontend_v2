/** @format */

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  SelectChangeEvent,
  Alert,
  AlertTitle,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
  Radio,
} from "@mui/material";
import { UploadResearchFile } from "../upload-research-file";
import RichText from "@/components/rich-text/rich-text";
import UploadingDialog from "../dialogs/uploading";
import { Department, PaperType, reject_paper } from "@/types";
import DownloadButton from "../download-file";
import { ChooseFile } from "../choosefile";

export default function Form({
  showChooseFile,
  formType,
  uploading,
  isLoading,
  setFile,
  formData,
  readonly,
  reject,
  handleInputChange,
  handleSubmit,
  handleRichTextChange,
  handleSelectChange,
  handleFileChange,
  handleShowButton,
}: {
  formType: "submit" | "rejected";
  showChooseFile?: string;
  formData: {
    department: string;
    manuscriptTitle: string;
    paperType: string;
    abstract: string;
    tags: string;
    author: string;
    advisor: string;
    fullText: string;
    paperTypes: PaperType[];
    departments: Department[];
  };
  handleShowButton?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  reject?: reject_paper;
  uploading: boolean;
  isLoading: boolean;
  handleFileChange?: (file: File | null) => void;
  setFile: (file: File | null) => void;
  readonly: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (
    name: string
  ) => (event: SelectChangeEvent<string>) => void;
  handleRichTextChange: (value: string) => void;
  //   FetchPaperAndDepartment: () => void;
}) {
  return (
    // <Box sx={{ width: "100%" }}>
    <>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth>
          {formType === "rejected" && (
            <Box sx={{ pb: 3 }}>
              <Alert severity="warning">
                <AlertTitle>Rejected Reason</AlertTitle>
                {reject?.rejected_reason}
              </Alert>
            </Box>
          )}
          <TextField
            variant="outlined"
            label="Manuscript Title"
            required
            placeholder="Please Input Manuscript Title"
            name="manuscriptTitle"
            sx={{ marginBottom: 2 }}
            value={formData.manuscriptTitle}
            onChange={handleInputChange}
            InputProps={{
              readOnly: readonly,
            }}
          />

          <FormControl sx={{ marginBottom: 2 }}>
            <InputLabel id="paper-type-label">Paper Type</InputLabel>
            <Select
              labelId="paper-type-label"
              label="Paper Type"
              name="paperType"
              value={formData.paperType}
              onChange={handleSelectChange("paperType")}
              disabled={readonly}
              required
            >
              {formData &&
                formData.paperTypes.map((type) => (
                  <MenuItem key={type.id} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            variant="outlined"
            label="Abstract"
            required
            placeholder="Paste in abstract of your research..."
            multiline
            name="abstract"
            rows={4}
            sx={{ marginBottom: 2 }}
            value={formData.abstract}
            onChange={handleInputChange}
            InputProps={{
              readOnly: readonly,
            }}
          />
          <TextField
            variant="outlined"
            label="Keywords"
            required
            placeholder="Keywords (E.g. Machine Learning, Data Science)"
            name="tags"
            sx={{ marginBottom: 2 }}
            value={formData.tags}
            onChange={handleInputChange}
            InputProps={{
              readOnly: readonly,
            }}
          />
          <TextField
            variant="outlined"
            label="Authors"
            required
            placeholder="Author names (E.g. John Doe, Jane Doe)"
            name="author"
            sx={{ marginBottom: 2 }}
            value={formData.author}
            onChange={handleInputChange}
            InputProps={{
              readOnly: readonly,
            }}
          />
          <TextField
            variant="outlined"
            label="Advisors"
            placeholder="Advisor names (E.g. Dr. John Doe, Prof. Jane Doe), leave blank if none."
            name="advisor"
            sx={{ marginBottom: 2 }}
            value={formData.advisor}
            onChange={handleInputChange}
            InputProps={{
              readOnly: readonly,
            }}
          />

          <FormControl sx={{ marginBottom: 2 }}>
            <InputLabel id="department-label">Departments</InputLabel>
            <Select
              labelId="department-label"
              label="Department(s)"
              variant="outlined"
              name="department"
              multiple
              value={formData.department}
              onChange={handleSelectChange("department")}
              disabled={readonly}
              required
            >
              {formData &&
                formData.departments.map((dept) => (
                  <MenuItem
                    key={dept.id}
                    value={dept.name}
                    sx={{
                      "&:hover": {
                        backgroundColor: "cyan",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#C5C5C5",
                        color: "purple",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    {dept.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {formType === "rejected" && (
            <Stack
              direction="row"
              sx={{
                marginBottom: 2.5,
              }}
            >
              <Box
                width={"100%"}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Box sx={{ display: "flex", marginRight: 3 }}>
                  <FormLabel sx={{ color: "black", fontWeight: "550" }}>
                    EXISTING PDF FILE:
                  </FormLabel>
                </Box>
                <FormControl>
                  <Box width="100%">
                    <DownloadButton submission={reject} />
                  </Box>
                </FormControl>
              </Box>
            </Stack>
          )}
          {formType === "rejected" && (
            <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
              <FormLabel
                component="legend"
                id="select"
                sx={{
                  fontWeight: "550",
                  color: "#777777",
                }}
              >
                UPLOAD NEW RESEARCH PAPER?
              </FormLabel>

              <RadioGroup
                row
                aria-label="Choose file"
                name="choose-file"
                value={showChooseFile}
                onChange={handleShowButton}
              >
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              </RadioGroup>

              {showChooseFile === "yes" && (
                <Stack spacing={2} direction="row">
                  <FormLabel
                    sx={{ display: "flex", paddingTop: 1.5, fontWeight: "550" }}
                    id="choose-file-label"
                  >
                    PDF FILE
                  </FormLabel>
                  <FormControl>
                    {handleFileChange && (
                      <ChooseFile
                        onFileChange={handleFileChange}
                        hidden={true}
                      />
                    )}
                    <FormHelperText id="component-helper-text">
                      Only PDF format is accepted. Maximum file size: 100 MB
                    </FormHelperText>
                  </FormControl>
                </Stack>
              )}
            </FormControl>
          )}

          {formType === "submit" && (
            <Box
              width={"100%"}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: 3,
                mt: 1,
              }}
            >
              <Box sx={{ display: "flex", marginRight: 3 }}>
                <FormLabel sx={{ color: "black", fontWeight: "550" }}>
                  PDF FILE:
                </FormLabel>
              </Box>
              <Box sx={{ display: "flex" }}>
                <FormControl>
                  <UploadResearchFile onFileChange={setFile} />
                </FormControl>
              </Box>
            </Box>
          )}
        </FormControl>

        <Stack direction="column">
          <InputLabel id="rich-text" sx={{ color: "black", fontWeight: "550" }}>
            FULL TEXT
          </InputLabel>
        </Stack>
        {formType === "submit" && (
          <Stack direction="column" sx={{ marginTop: 2 }}>
            <RichText
              onEditorChange={handleRichTextChange}
              rich_text="This is the initial content of the editor."
            />
          </Stack>
        )}
        {formType === "rejected" && (
          <Stack direction="column" sx={{ marginTop: 2 }}>
            <RichText
              onEditorChange={handleRichTextChange}
              rich_text={formData.fullText}
            />
          </Stack>
        )}

        <Box sx={{ justifyContent: "center", display: "flex", marginTop: 2 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#333",
              color: "white",
              "&:hover": { backgroundColor: "#555" },
            }}
            disabled={isLoading}
          >
            Submit
          </Button>
        </Box>
      </form>
      <UploadingDialog isUploading={uploading} />
    </>
  );
}
