import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { wagmiConfig } from '@/lib/web3/wagmi';

export function Web3Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: 'hsl(var(--primary))',
          accentColorForeground: 'white',
          borderRadius: 'large',
          fontStack: 'system',
        })}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
