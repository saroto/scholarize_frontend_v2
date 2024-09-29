import { Breadcrumbs, Link, Typography, Stack, Tooltip } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function Breadcrumb({
  groupname,
  section,
  href,
}: {
  groupname: string;
  section: string;
  href: string;
}) {
  return (
    <Stack
      sx={{
        height: "72px",
        width: "100%",
        borderBottom: "1px solid #e0e0e0",
      }}
      spacing={8}
      alignItems={"center"}
      justifyContent={"space-between"}
      direction={"row"}
    >
      <Breadcrumbs
        sx={{
          paddingX: "1rem",
        }}
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          href={href}
          sx={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Typography
            fontWeight={550}
            color="text.primary"
            className="hover:cursor-pointer"
            sx={{
              ":hover": {
                color: "#7200BB",
              },
            }}
          >
            GROUP
          </Typography>
        </Link>
        <Tooltip title={decodeURIComponent(groupname)}>
          <Typography key="3" color="text.secondary" noWrap maxWidth="100px">
            {decodeURIComponent(groupname)}
          </Typography>
        </Tooltip>
        <Typography key="3" color="text.secondary">
          {section}
        </Typography>
      </Breadcrumbs>
    </Stack>
  );
}
