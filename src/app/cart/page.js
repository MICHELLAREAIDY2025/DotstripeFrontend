"use client"

import { useState, useEffect } from "react"
import { useCart } from "../context/Cartcontext"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Input,
  IconButton,
  Flex,
  Spinner,
  useToast,
  Badge,
} from "@chakra-ui/react"
import { DeleteIcon } from "@chakra-ui/icons"

export default function CartPage() {
  const { cart, loading, updateCartItem, removeFromCart } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [updating, setUpdating] = useState({})

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return

    setUpdating(prev => ({ ...prev, [productId]: true }))
    try {
      await updateCartItem(productId, newQuantity)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update quantity",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId)
      toast({
        title: "Success",
        description: "Item removed from cart",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" />
        </Flex>
      </Container>
    )
  }

  if (cart.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center" py={10}>
          <Heading size="lg" mb={4}>
            Your cart is empty
          </Heading>
          <Text mb={6}>Add some products to your cart to continue shopping</Text>
          <Button colorScheme="blue" onClick={() => router.push("/products")}>
            Browse Products
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="lg" mb={6}>
        Shopping Cart
      </Heading>
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>Price</Th>
              <Th>Quantity</Th>
              <Th>Total</Th>
              <Th>Stock</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {cart.map((item) => (
              <Tr key={item.product_id}>
                <Td>
                  <Flex align="center">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      boxSize="50px"
                      objectFit="cover"
                      mr={4}
                    />
                    <Box>
                      <Text fontWeight="medium">{item.name}</Text>
                      {item.stock <= 5 && (
                        <Badge colorScheme="red" mt={1}>
                          Only {item.stock} left in stock
                        </Badge>
                      )}
                    </Box>
                  </Flex>
                </Td>
                <Td>${item.price.toFixed(2)}</Td>
                <Td>
                  <Flex align="center">
                    <IconButton
                      icon="-"
                      size="sm"
                      onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                      isDisabled={updating[item.product_id] || item.quantity <= 1}
                    />
                    <Input
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        if (!isNaN(value)) {
                          handleQuantityChange(item.product_id, value)
                        }
                      }}
                      w="60px"
                      mx={2}
                      textAlign="center"
                      isDisabled={updating[item.product_id]}
                    />
                    <IconButton
                      icon="+"
                      size="sm"
                      onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                      isDisabled={updating[item.product_id] || item.quantity >= item.stock}
                    />
                  </Flex>
                </Td>
                <Td>${(item.price * item.quantity).toFixed(2)}</Td>
                <Td>
                  <Badge
                    colorScheme={item.stock > 10 ? "green" : item.stock > 5 ? "yellow" : "red"}
                  >
                    {item.stock} in stock
                  </Badge>
                </Td>
                <Td>
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleRemoveItem(item.product_id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Flex justify="space-between" align="center" mt={8}>
        <Button
          variant="outline"
          onClick={() => router.push("/products")}
        >
          Continue Shopping
        </Button>
        <Box textAlign="right">
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            Total: ${calculateTotal().toFixed(2)}
          </Text>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => router.push("/checkout")}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Flex>
    </Container>
  )
}
