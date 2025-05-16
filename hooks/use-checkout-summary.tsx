import { useEffect, useState } from 'react';
import { DiscountCode } from '@/lib/bitpass-sdk/src/types/discount';
import { useDraftEventContext } from '@/lib/draft-event-context';
import { Currencies } from '@/types';
import { useYadio } from '@/lib/yadio-context';

export function useCheckoutSummary(
  selectedTickets: Record<string, number>,
  appliedDiscount: DiscountCode | null
) {
  const [displayTotal, setDisplayTotal] = useState<number>(0);
  const [displayDiscount, setDisplayDiscount] = useState<number>(0);
  const [displayCurrency, setDisplayCurrency] = useState<Currencies>('USD');

  const { draftEvent } = useDraftEventContext();
  const converter = useYadio();

  useEffect(() => {
    if (!draftEvent) return;

    const eventCurrencies = new Set(draftEvent.ticketTypes.map(t => t.currency));
    const uniqueCurrencies = [...eventCurrencies] as Currencies[];

    const defaultCurrency: Currencies = uniqueCurrencies.length === 1 ? uniqueCurrencies[0] : 'USD';
    setDisplayCurrency(defaultCurrency);
  }, [draftEvent]);

  useEffect(() => {
    const calculate = async () => {
      if (!draftEvent) {
        setDisplayTotal(0);
        setDisplayDiscount(0);
        return;
      }

      const ticketEntries = Object.entries(selectedTickets).filter(([_, q]) => q > 0);
      if (ticketEntries.length === 0) {
        setDisplayTotal(0);
        setDisplayDiscount(0);
        return;
      }

      let subtotals: { amount: number; currency: string }[] = [];

      for (const [ticketId, quantity] of ticketEntries) {
        const ticket = draftEvent.ticketTypes.find((t) => t.id === ticketId);
        if (!ticket) continue;

        subtotals.push({ amount: ticket.price * quantity, currency: ticket.currency });
      }

      let total = 0;
      for (const { amount, currency } of subtotals) {
        if (currency === displayCurrency) {
          total += amount;
        } else {
          const converted = await converter.convertCurrency({
            amount,
            from: currency,
            to: displayCurrency,
          });
          total += converted;
        }
      }

      const discount = appliedDiscount?.percentage
        ? (total * appliedDiscount.percentage) / 100
        : 0;

      setDisplayDiscount(parseFloat(discount.toFixed(2)));
      setDisplayTotal(parseFloat((total - discount).toFixed(2)));
    };

    calculate();
  }, [selectedTickets, draftEvent, appliedDiscount, converter, displayCurrency]);

  return { displayTotal, displayDiscount, displayCurrency };
}
