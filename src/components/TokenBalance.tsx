'use client'

import { useAccount, useBalance, useReadContracts, useChainId } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatUnits } from 'viem'
import { Coins, TrendingUp } from 'lucide-react'
import { mainnet, polygon, sepolia } from 'wagmi/chains'

// Token addresses for different chains
const TOKEN_ADDRESSES = {
  [mainnet.id]: [
    {
      address: '0xA0b86a33E6411e3036c4E4f7F248E5c2A7b62D02' as const,
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin'
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as const,
      symbol: 'USDT',
      decimals: 6,
      name: 'Tether USD'
    },
    {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as const,
      symbol: 'DAI',
      decimals: 18,
      name: 'Dai Stablecoin'
    },
    {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' as const,
      symbol: 'WBTC',
      decimals: 8,
      name: 'Wrapped Bitcoin'
    }
  ],
  [polygon.id]: [
    {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' as const,
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin (PoS)'
    },
    {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' as const,
      symbol: 'USDT',
      decimals: 6,
      name: 'Tether USD (PoS)'
    },
    {
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' as const,
      symbol: 'DAI',
      decimals: 18,
      name: 'Dai Stablecoin (PoS)'
    },
    {
      address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6' as const,
      symbol: 'WBTC',
      decimals: 8,
      name: 'Wrapped BTC (PoS)'
    }
  ],
  [sepolia.id]: [
    // Sepolia testnet tokens (these are example addresses - use actual testnet tokens)
    {
      address: '0x1c7D4B196Cb0C7B01d743F0d7E7F7d3D4F1A7b1c' as const,
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin (Testnet)'
    }
  ]
}

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

export function TokenBalance() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  // Get tokens for current chain
  const currentTokens = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES] || []
  
  // Get native token info
  const getNativeTokenInfo = () => {
    switch (chainId) {
      case mainnet.id:
        return { symbol: 'ETH', name: 'Ethereum' }
      case polygon.id:
        return { symbol: 'MATIC', name: 'Polygon' }
      case sepolia.id:
        return { symbol: 'SepoliaETH', name: 'Sepolia Ether' }
      default:
        return { symbol: 'ETH', name: 'Ethereum' }
    }
  }
  
  const nativeToken = getNativeTokenInfo()
  
  // Get native token balance
  const { data: nativeBalance, isLoading: nativeLoading } = useBalance({
    address: address,
  })

  // Get ERC-20 token balances
  const { data: tokenBalances, isLoading: tokensLoading } = useReadContracts({
    contracts: currentTokens.map(token => ({
      address: token.address,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address!],
    })),
    query: {
      enabled: !!address && currentTokens.length > 0,
    },
  })

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Token Balances
          </CardTitle>
          <CardDescription>
            Connect your wallet to view token balances
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Token Balances
          </CardTitle>
          <CardDescription>
            Your current token holdings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Native Token Balance */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{nativeToken.symbol.slice(0, 3)}</span>
                </div>
                <div>
                  <div className="font-medium">{nativeToken.name}</div>
                  <div className="text-sm text-muted-foreground">{nativeToken.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                {nativeLoading ? (
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <div className="font-mono">
                    {nativeBalance ? parseFloat(formatUnits(nativeBalance.value, nativeBalance.decimals)).toFixed(4) : '0.0000'} {nativeToken.symbol}
                  </div>
                )}
              </div>
            </div>

            {/* ERC-20 Token Balances */}
            {currentTokens.map((token, index) => {
              const balance = tokenBalances?.[index]
              const hasError = balance?.status === 'failure'
              const balanceValue = balance?.status === 'success' ? balance.result : BigInt(0)
              
              return (
                <div key={token.address} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{token.symbol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-sm text-muted-foreground">{token.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {tokensLoading ? (
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    ) : hasError ? (
                      <div className="text-sm text-muted-foreground">N/A</div>
                    ) : (
                      <div className="font-mono">
                        {parseFloat(formatUnits(balanceValue, token.decimals)).toFixed(token.decimals === 18 ? 4 : 2)} {token.symbol}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Show message if no tokens for current chain */}
            {currentTokens.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tokens configured for this network</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Portfolio Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {currentTokens.length + 1}
              </div>
              <div className="text-sm text-muted-foreground">Assets</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">Active</div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}