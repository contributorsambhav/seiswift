import { http, createConfig } from 'wagmi'
import { mainnet, polygon, sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// WalletConnect project ID - you'll need to get this from https://cloud.walletconnect.com/
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'your-project-id-here'

export const config = createConfig({
  chains: [mainnet, polygon, sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId,
      metadata: {
        name: 'SeiSwift',
        description: 'International Web3 Transactions',
        url: 'https://seiswift.app',
        icons: ['https://seiswift.app/icon.png']
      }
    }),
  ],
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
    [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}