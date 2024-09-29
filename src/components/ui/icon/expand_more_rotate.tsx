import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}
// interface Prop{
//   expand: "see more" || <ExpandMoreIcon/>;
// }

// credit to component style: https://mui.com/material-ui/react-card/#complex-interaction
const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ExpandMoreRotate({
  expand,
  ...props
}: ExpandMoreProps) {
  return (
    <ExpandMore
      expand={expand}
      aria-expanded={expand}
      aria-label="show more"
      {...props}
    >
      <ExpandMoreIcon />
    </ExpandMore>
  );
}
