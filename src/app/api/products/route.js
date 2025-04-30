import { NextResponse } from "next/server"

// This is temporary mock data. In a real application, this would come from a database
const mockProducts = [
  {
    id: 1,
    name: "Network Security Suite",
    description: "Comprehensive network security solution with advanced threat protection",
    price: 299.99,
    category: { name: "Security" },
    image_url: "/images/products/security-suite.png",
    created_at: "2024-03-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Cloud Storage Package",
    description: "Secure and scalable cloud storage solution for businesses",
    price: 199.99,
    category: { name: "Cloud" },
    image_url: "/images/products/cloud-storage.png",
    created_at: "2024-03-14T15:30:00Z"
  },
  {
    id: 3,
    name: "IT Support Package",
    description: "24/7 IT support and maintenance services",
    price: 499.99,
    category: { name: "Support" },
    image_url: "/images/products/it-support.png",
    created_at: "2024-03-13T09:15:00Z"
  },
  {
    id: 4,
    name: "CCTV System",
    description: "Advanced surveillance system with AI-powered analytics",
    price: 799.99,
    category: { name: "Security" },
    image_url: "/images/products/cctv-system.png",
    created_at: "2024-03-12T14:45:00Z"
  },
  {
    id: 5,
    name: "Network Infrastructure Kit",
    description: "Complete network infrastructure setup and configuration",
    price: 1499.99,
    category: { name: "Networking" },
    image_url: "/images/products/network-kit.png",
    created_at: "2024-03-11T11:20:00Z"
  },
  {
    id: 6,
    name: "AI Security Analytics",
    description: "AI-powered security analytics and threat detection",
    price: 399.99,
    category: { name: "Security" },
    image_url: "/images/products/ai-security.png",
    created_at: "2024-03-10T16:00:00Z"
  }
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json(mockProducts)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
} 