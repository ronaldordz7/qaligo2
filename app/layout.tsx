import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { Navbar } from "@/components/navbar"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "QaliGo - Comida Rápida Saludable",
  description: "Ordena comida deliciosa y nutritiva en línea",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
