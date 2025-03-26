/** @format */

import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { theme } from "./theme";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import SessionExpirePopup from "@/components/SessionExpireContext";
import { useSessionExpireContext } from "@/components/SessionExpireContext";

// export const metadata: Metadata = {
//   title: "Scholarize",
//   icons: "/logo.png",
//   description:
//     "Effortlessly access research papers, engage in collaborative research with advisors in specialized groups, manage tasks and schedules smoothly, and securely store all research documents",
// };
export const metadata: Metadata = {
  title:
    "Scholarize - Your all-in-one research repository and collaboration at Paragon International University",
  description:
    "Effortlessly access research papers, engage in collaborative research with advisors in specialized groups, manage tasks and schedules smoothly, and securely store all research documents",
  openGraph: {
    type: "website",
    url: "https://scholarize.paragoniu.app/",
    title:
      "Scholarize - Your all-in-one research repository and collaboration at Paragon International University",
    description:
      "Effortlessly access research papers, engage in collaborative research with advisors in specialized groups, manage tasks and schedules smoothly, and securely store all research documents",
    images: [
      {
        url: "https://raw.githubusercontent.com/Jemmy-PIU/Scholarize/main/scholarize-meta.png",
        width: 800,
        height: 600,
        alt: "Scholarize Meta Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Scholarize - Your all-in-one research repository and collaboration at Paragon International University",
    description:
      "Effortlessly access research papers, engage in collaborative research with advisors in specialized groups, manage tasks and schedules smoothly, and securely store all research documents",
    images: [
      {
        url: "https://raw.githubusercontent.com/Jemmy-PIU/Scholarize/main/scholarize-meta.png",
        width: 800,
        height: 600,
        alt: "Scholarize Meta Image",
      },
    ],
  },
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        <div id="back-to-top-anchor " />
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <SessionProviderWrapper session={session}>
              <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick={true}
                pauseOnHover={false}
                draggable={false}
                pauseOnFocusLoss={false}
              />
              {children}
            </SessionProviderWrapper>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

function SessionExpireHandler() {
  const { sessionExpired, setSessionExpired } = useSessionExpireContext();

  const handleOk = () => {
    setSessionExpired(false);
  };

  return <SessionExpirePopup open={sessionExpired} onOk={handleOk} />;
}
