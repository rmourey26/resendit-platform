"use client"

import { useEffect, useRef } from "react"
import { packagingMaterials } from "@/lib/schemas/packaging"

interface PackagingPreviewProps {
  orderType: "standard" | "custom"
  materialType: string
  dimensions: {
    width: number
    height: number
    depth: number
    unit: string
  }
  designData: {
    brandColor: string
    secondaryColor: string
    logo: string
    logoPosition: string
    textColor: string
    font: string
    additionalText: string
    useCompanyLogo: boolean
  }
}

export function PackagingPreview({ orderType, materialType, dimensions, designData }: PackagingPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const material = packagingMaterials.find((m) => m.id === materialType) || packagingMaterials[0]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions based on package dimensions
    // We'll use a fixed canvas size and scale the drawing
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    const scale = Math.min(canvasWidth / (dimensions.width * 20), canvasHeight / (dimensions.height * 20))

    // Calculate scaled dimensions
    const scaledWidth = dimensions.width * scale * 20
    const scaledHeight = dimensions.height * scale * 20

    // Calculate position to center the package
    const x = (canvasWidth - scaledWidth) / 2
    const y = (canvasHeight - scaledHeight) / 2

    // Draw package background
    ctx.fillStyle = designData.secondaryColor
    ctx.fillRect(x, y, scaledWidth, scaledHeight)

    // Draw border
    ctx.strokeStyle = designData.brandColor
    ctx.lineWidth = 6
    ctx.strokeRect(x, y, scaledWidth, scaledHeight)

    // Draw material texture (simplified)
    ctx.globalAlpha = 0.1
    for (let i = 0; i < 10; i++) {
      const lineY = y + (i * scaledHeight) / 10
      ctx.beginPath()
      ctx.moveTo(x, lineY)
      ctx.lineTo(x + scaledWidth, lineY)
      ctx.stroke()
    }
    ctx.globalAlpha = 1.0

    // Draw logo if available
    if (designData.useCompanyLogo && designData.logo) {
      const logoImg = new Image()
      logoImg.crossOrigin = "anonymous"
      logoImg.onload = () => {
        const logoWidth = scaledWidth * 0.4
        const logoHeight = (logoImg.height / logoImg.width) * logoWidth

        let logoX = x + (scaledWidth - logoWidth) / 2 // Default center

        if (designData.logoPosition === "left") {
          logoX = x + scaledWidth * 0.1
        } else if (designData.logoPosition === "right") {
          logoX = x + scaledWidth - logoWidth - scaledWidth * 0.1
        }

        const logoY = y + scaledHeight * 0.25

        ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight)
      }
      logoImg.src = designData.logo
    }

    // Draw additional text
    if (designData.additionalText) {
      ctx.fillStyle = designData.textColor
      ctx.font = `bold ${scaledHeight * 0.08}px ${designData.font}, sans-serif`
      ctx.textAlign = "center"
      ctx.fillText(designData.additionalText, x + scaledWidth / 2, y + scaledHeight * 0.7)
    }

    // Draw material type
    ctx.fillStyle = "rgba(0,0,0,0.7)"
    ctx.font = `${scaledHeight * 0.05}px sans-serif`
    ctx.textAlign = "center"
    ctx.fillText(material.name, x + scaledWidth / 2, y + scaledHeight * 0.85)

    // Draw dimensions
    ctx.font = `${scaledHeight * 0.04}px sans-serif`
    ctx.fillText(
      `${dimensions.width}" × ${dimensions.height}" × ${dimensions.depth}"`,
      x + scaledWidth / 2,
      y + scaledHeight * 0.92,
    )
  }, [orderType, materialType, dimensions, designData])

  return (
    <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
      <canvas ref={canvasRef} width={400} height={300} className="w-full h-auto" />
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>This is a simplified preview. Actual product may vary slightly.</p>
        <p className="mt-1">Material: {material.name}</p>
      </div>
    </div>
  )
}
