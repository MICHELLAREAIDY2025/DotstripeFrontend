export default function CartItem({ item }) {
  // Convert price to number and handle edge cases
  const price = parseFloat(item.price) || 0
  const quantity = parseInt(item.quantity) || 1
  const itemTotal = price * quantity
  
  return (
    <div className="flex items-center gap-4 py-3 px-3">
      <div className="w-16 h-16 relative">
        <img 
          src={item.image || "/placeholder.svg"} 
          alt={item.name} 
          className="w-full h-full object-cover rounded-lg" 
        />
        <div className="absolute -top-2 -left-2 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
          {quantity}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-gray-600">${price.toFixed(2)} each</p>
        {item.category && (
          <p className="text-sm text-gray-500">{item.category}</p>
        )}
      </div>
      <div className="text-right">
        <p className="font-medium">${itemTotal.toFixed(2)}</p>
        <p className="text-sm text-gray-500">Qty: {quantity}</p>
      </div>
    </div>
  )
}

