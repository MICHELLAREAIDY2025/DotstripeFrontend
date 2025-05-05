import CartItem from "./CartItem"

export default function OrderSummary({ items = [], subtotal = 0, shipping = 0, total = 0 }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="max-h-[300px] overflow-y-auto mb-4">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <CartItem key={item.id || index} item={item} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No items in cart</p>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

