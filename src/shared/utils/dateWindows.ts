import {
  TRANSACTIONS_INITIAL_WINDOW_DAYS,
  TRANSACTIONS_NEXT_WINDOW_DAYS,
} from '@/shared/constants/pagination'

/**
 * Зазор между соседними окнами. `transaction_time` хранится с миллисекундной
 * точностью, поэтому сдвиг на 1 мс исключает перекрытие и не теряет записи.
 */
const WINDOW_BOUNDARY_GAP_MS = 1

export type TransactionsDateWindow = {
  dateFrom: string
  dateTo?: string
}

/**
 * Нижняя граница окна: начало дня, отстоящего от `now` на глубину окна.
 * День отматывается через `setDate`, чтобы переход на летнее время не смещал границу.
 */
function getWindowBoundary(windowIndex: number, now: Date): Date {
  const daysBack =
    TRANSACTIONS_INITIAL_WINDOW_DAYS + windowIndex * TRANSACTIONS_NEXT_WINDOW_DAYS
  const boundary = new Date(now.getTime())
  boundary.setDate(boundary.getDate() - daysBack)
  boundary.setHours(0, 0, 0, 0)
  return boundary
}

/**
 * ISO-границы окна по его индексу.
 * Окно 0 не имеет верхней границы, чтобы транзакции с будущей датой попадали в фид.
 */
export function getTransactionsDateWindow(
  windowIndex: number,
  now: Date = new Date(),
): TransactionsDateWindow {
  const dateFrom = getWindowBoundary(windowIndex, now).toISOString()

  if (windowIndex === 0) {
    return { dateFrom }
  }

  const previousBoundary = getWindowBoundary(windowIndex - 1, now)
  const dateTo = new Date(previousBoundary.getTime() - WINDOW_BOUNDARY_GAP_MS).toISOString()

  return { dateFrom, dateTo }
}
