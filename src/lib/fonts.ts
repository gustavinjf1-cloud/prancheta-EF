import localFont from "next/font/local";

export const poppins = localFont({
  src: [
    { path: "../fonts/poppins/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/poppins/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/poppins/Poppins-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});
