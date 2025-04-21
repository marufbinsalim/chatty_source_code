import { dark } from "@clerk/themes";

let appearance = {
  baseTheme: dark,
  elements: {
    modalBackdrop: {
      position: "fixed",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    cardBox: {
      width: "400px",
      minWidth: "00px",
      maxWidth: "90vw",
      height: "90vh",
      minHeight: "max-content",
      boxShadow: "none",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      backgroundColor: "#1b1b1b",
      width: "100%",
      margin: "0 auto",
      border: "0.1px solid #b2ebf520",
    },
    headerSubtitle: {
      display: "none",
    },
    logoBox: {
      height: "100px",
    },
    logoImage: {
      borderRadius: "50%",
    },
    footer: {
      display: "none",
    },
    modalCloseButton: {
      "&:hover": {
        backgroundColor: "#2b2b2b",
      },
      "&:focus": {
        border: "1px solid #dbdbdb50",
        boxShadow: "none",
      },
    },
    socialButtonsBlockButton: {
      backgroundColor: "#2b2b2b80",
      "&:hover": {
        backgroundColor: "#2b2b2b",
      },
      padding: "12px",
    },
  },
};

export { appearance };
