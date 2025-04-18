"use client"

import { useState } from "react"
import { sendContactMessage } from "@/lib/api"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await sendContactMessage(formData)
      setSubmitStatus("success")
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      console.error("Error sending message:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <Image
            src="/placeholder.svg?height=500&width=500"
            alt="Consulting"
            width={500}
            height={500}
            className="rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-bold mt-4 mb-2">CONSULTING</h1>
          <p className="text-lg">Let's have a discussion</p>
        </div>

        <div className="md:w-1/2">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">
                Name
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">
                Email
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block mb-2">
                Message
              </label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {submitStatus === "success" && <p className="mt-4 text-green-400">Message sent successfully!</p>}

            {submitStatus === "error" && <p className="mt-4 text-red-400">Failed to send message. Please try again.</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
