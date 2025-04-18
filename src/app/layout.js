import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export const metadata = {
  title: "Dot Stripe - Your Partner to Excellence",
  description: "Dot Stripe assists businesses profit on the growth and potential of information technology.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
