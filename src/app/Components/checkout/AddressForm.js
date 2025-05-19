"use client"

export default function AddressForm({ address, updateAddress, errors = {} }) {
  const handleAddressChange = (field, value) => {
    const newAddress = { ...address, [field]: value }
    updateAddress(newAddress)
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mt-6">Address</h3>
      <div className="grid gap-4 mt-4">
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Region"
          value={address.region || ""}
          onChange={(e) => handleAddressChange("region", e.target.value)}
          autoComplete="address-level1"
        />
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Address Directions"
          value={address["address-direction"] || ""}
          onChange={(e) => handleAddressChange("address-direction", e.target.value)}
          autoComplete="address-line1"
        />
        <input
          type="tel"
          className="border p-2 rounded"
          placeholder="Phone Number (e.g., +1234567890)"
          value={address.phone || ""}
          onChange={(e) => {
            const value = e.target.value
            const sanitizedValue = value.replace(/[^+\d]/g, "")
            if (sanitizedValue.startsWith("+") && sanitizedValue.length <= 16) {
              handleAddressChange("phone", sanitizedValue)
            }
          }}
          autoComplete="tel"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Building"
            value={address.building || ""}
            onChange={(e) => handleAddressChange("building", e.target.value)}
            autoComplete="address-line2"
          />
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Floor Number"
            value={address.floor || ""}
            onChange={(e) => handleAddressChange("floor", e.target.value.replace(/\D/g, "").slice(0, 3))}
            autoComplete="address-line3"
          />
        </div>
      </div>
    </div>
  )
}

