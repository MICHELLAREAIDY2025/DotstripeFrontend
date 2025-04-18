import Link from "next/link"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="mb-2">Info@Dot-Stripe.Com</p>
          </div>

          <div className="text-center">
            <Link href="/contact">
              <button className="bg-[#18608C] hover:bg-[#0E4459] text-white font-bold py-2 px-6 rounded-md transition-colors">
                CONTACT US
              </button>
            </Link>
            <p className="mt-4">Copywrite© Dot Stripe 2024</p>
          </div>

          <div className="text-right">
            <h3 className="text-xl font-bold mb-4">Location</h3>
            <p className="mb-1">Beirut,Lebanon</p>
            <p className="mb-1">75008 Paris</p>
            <p>FRANCE</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
