import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import ChatInput from "./ChatInput";
import TextMessage from "./TextMessage";

export default function ChatContainer() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        overflow: "hidden",
        paddingBlock: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          overflow: "auto",
          height: "100%",
          flex: 1,
          flexDirection: "column",
        }}
      >
        <TextMessage
          message="I need help with my research paper."
          sender="user"
        />
        <TextMessage
          message="**• The Transformer: Revolutionizing Sequence Transduction**  

&nbsp;&nbsp;&nbsp;&nbsp;The big players in sequence transduction models used to rely on **complex recurrent or convolutional neural networks**, featuring an **encoder-decoder setup**. The top-performing models even incorporated an **attention mechanism** to link the two.  

&nbsp;&nbsp;&nbsp;&nbsp;But here’s the game-changer—we introduce **the Transformer**, a sleek new architecture that operates **entirely on attention mechanisms**, completely eliminating **recurrence and convolutions**.  

&nbsp;&nbsp;&nbsp;&nbsp;We put it to the test on two **machine translation tasks**, and the results? **Mind-blowing.** It’s not only **better in quality** but also **way more parallelizable** and **trains significantly faster**.  

&nbsp;&nbsp;&nbsp;&nbsp;Check this out:  
- **28.4 BLEU** on the **WMT 2014 English-to-German** translation task, surpassing the best models (even ensembles!) by **over 2 BLEU points**.  
- **41.8 BLEU** on the **WMT 2014 English-to-French** task—**a new single-model record**, trained in just **3.5 days on eight GPUs**.  

&nbsp;&nbsp;&nbsp;&nbsp;Talk about **efficiency** compared to traditional heavyweight models!  

&nbsp;&nbsp;&nbsp;&nbsp;Plus, the Transformer isn’t just a translation powerhouse—it excels at **generalization**, acing **English constituency parsing** whether we have **tons of training data or just a little**.  
"
          sender="bot"
        />
      </Box>
      <ChatInput />
      {/* Add other chat components here */}
    </Box>
  );
}
