type Transaction = {
  accountId: string
  accountOwner: string | null
  amount: number
  category: string | null
  categoryId: string | null
  date: string
  name: string
  paymentChannel: string
  pending: boolean
  transactionId: string
};
