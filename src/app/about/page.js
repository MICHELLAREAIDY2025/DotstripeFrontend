import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#031626] text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Who We Are</h1>

          <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden">
            <Image src="/collaborative-tech-space.png" alt="Dot Stripe Team" fill className="object-cover" />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <h2>Our Story</h2>
            <p>
              Founded in 2023, Dot Stripe started with a simple mission: to provide cutting-edge technology solutions
              that empower businesses and individuals alike. What began as a small team of passionate tech enthusiasts
              has grown into a dynamic company at the forefront of technological innovation.
            </p>

            <h2>Our Mission</h2>
            <p>
              At Dot Stripe, we believe in the transformative power of technology. Our mission is to deliver exceptional
              tech products and services that solve real-world problems, enhance productivity, and create meaningful
              experiences for our customers.
            </p>

            <h2>Our Team</h2>
            <p>
              Our diverse team brings together experts from various fields of technology, from hardware specialists to
              software developers, designers, and customer support professionals. United by our passion for innovation,
              we work collaboratively to push the boundaries of what's possible.
            </p>

            <h2>Our Values</h2>
            <ul>
              <li>
                <strong>Innovation:</strong> We constantly explore new ideas and technologies to stay ahead of the
                curve.
              </li>
              <li>
                <strong>Quality:</strong> We are committed to delivering products and services of the highest standard.
              </li>
              <li>
                <strong>Integrity:</strong> We conduct our business with honesty, transparency, and ethical practices.
              </li>
              <li>
                <strong>Customer-Centricity:</strong> We put our customers at the heart of everything we do.
              </li>
              <li>
                <strong>Sustainability:</strong> We strive to minimize our environmental impact and promote sustainable
                practices.
              </li>
            </ul>

            <h2>Join Us on Our Journey</h2>
            <p>
              As we continue to grow and evolve, we invite you to be part of our journey. Whether you're a customer,
              partner, or potential team member, we look forward to connecting with you and exploring how we can create
              technological excellence together.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
