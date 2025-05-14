import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Zap } from 'lucide-react';
import { Currencies } from '@/types';
import { useYadio } from '@/lib/yadio-context';

interface LightningPaymentProps {
  invoice: string;
  amount: number;
  currency: Currencies;
  onPaymentSuccess: () => void;
}

export function LightningPayment({ invoice, amount, currency, onPaymentSuccess }: LightningPaymentProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [fiatValue, setFiatValue] = useState<number | null>(null);
  const [satsValue, setSatsValue] = useState<number | null>(null);

  const converter = useYadio();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const convert = async () => {
      try {
        const sats = currency === 'SAT'
          ? amount
          : await converter.convertCurrency({ amount, from: currency, to: 'SAT' });
        setSatsValue(Math.round(sats));

        const fiat = await converter.convertCurrency({ amount, from: currency, to: currency });
        setFiatValue(Math.round(fiat));
      } catch {
        setSatsValue(null);
        setFiatValue(null);
      }
    };
    convert();
  }, [amount, currency]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = () => {
    setIsChecking(true);
    setTimeout(() => {
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className='w-full max-w-md space-y-6'>
      <h2 className='text-xl font-semibold text-white'>Pay with Lightning Network</h2>

      <Card className='bg-[#151515] border-border-gray'>
        <CardContent className='p-6 flex flex-col items-center'>
          <div className='mb-4 text-center'>
            <p className='text-sm text-muted-foreground mb-1'>Time remaining to pay</p>
            <p className='text-xl font-mono font-bold text-white'>{formatTime(timeLeft)}</p>
          </div>

          <div className='bg-white p-4 rounded-lg mb-4'>
            <QRCodeSVG value={invoice} size={200} includeMargin={true} />
          </div>

          <div className='text-center mb-6'>
            {fiatValue !== null && (
              <p className='text-lg font-bold text-white mb-1'>
                {formatCurrency(fiatValue, currency)} {currency}
              </p>
            )}
            {satsValue !== null && (
              <p className='text-sm text-muted-foreground'>≈ {satsValue.toLocaleString()} sats</p>
            )}
          </div>

          <div className='w-full space-y-3'>
            <Button
              onClick={handleSimulatePayment}
              className='w-full bg-fluorescent-yellow hover:bg-fluorescent-yellow-hover text-dark-gray'
              disabled={isChecking}
            >
              {isChecking ? 'Verifying payment...' : (<><Zap className='mr-2 h-4 w-4' />Simulate payment</>)}
            </Button>

            <Button
              variant='outline'
              className='w-full border-border-gray text-white'
              onClick={() => navigator.clipboard.writeText(invoice)}
            >
              Copy invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className='text-sm text-muted-foreground text-center'>
        <p>Scan the QR code with your Lightning Network wallet</p>
        <p>or copy the invoice to pay from your app.</p>
      </div>
    </div>
  );
}