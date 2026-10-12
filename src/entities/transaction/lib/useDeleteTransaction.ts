import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTransaction } from '@/shared/api/transactions'
import { QUERY_KEYS } from '@/shared/constants'

/**
 * Мутация удаления транзакции. При успехе инвалидирует транзакции и кошельки.
 * Ошибку обрабатывает вызывающий: `deleteById` отклоняется, если запрос не прошёл.
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets.all })
    },
  })

  return { deleteById: mutateAsync, isDeleting: isPending }
}
