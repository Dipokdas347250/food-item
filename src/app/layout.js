import { Poppins, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Toasts from "@/components/Toasts";
import LangSync from "@/components/LangSync";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const hind = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "KhanaGhor · খানাঘর — Chinese & Bengali Food Delivery",
  description:
    "Order authentic Chinese and Bengali dishes online — kacchi biryani, shorshe ilish, chowmein, dumplings and more. Available in English and বাংলা.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${hind.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <LangSync />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <Toasts />
      </body>
    </html>
  );
}
