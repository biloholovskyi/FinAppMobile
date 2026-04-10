export const QUERY_KEYS = {
  transactions: {
    all: ['transactions'] as const,
  },
  wallets: {
    all: ['wallets'] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  budgets: {
    month: (month: string) => ['budgets', 'month', month] as const,
  },
} as const
