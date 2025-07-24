'use client'

import { useAccount, useBalance, useReadContracts, useChainId } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatUnits } from 'viem'
import { Coins, TrendingUp, DollarSign } from 'lucide-react'
import { mainnet, polygon, sepolia } from 'wagmi/chains'
import { useState, useEffect, useCallback, useMemo } from 'react'

// Token addresses for different chains
const TOKEN_ADDRESSES = {
  [mainnet.id]: [
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin',
      rivalzId: 'USDC'
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      decimals: 6,
      name: 'Tether USD',
      rivalzId: 'USDT'
    },
    {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      decimals: 18,
      name: 'Dai Stablecoin',
      rivalzId: 'DAI'
    },
    {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      symbol: 'WBTC',
      decimals: 8,
      name: 'Wrapped Bitcoin',
      rivalzId: 'BTC'
    }
  ],
  [polygon.id]: [
    {
      address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin (Native)',
      rivalzId: 'USDC'
    },
    {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      symbol: 'USDC.e',
      decimals: 6,
      name: 'USD Coin (Bridged)',
      rivalzId: 'USDC'
    },
    {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      symbol: 'USDT',
      decimals: 6,
      name: 'Tether USD (PoS)',
      rivalzId: 'USDT'
    },
    {
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      symbol: 'DAI',
      decimals: 18,
      name: 'Dai Stablecoin (PoS)',
      rivalzId: 'DAI'
    },
    {
      address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
      symbol: 'WBTC',
      decimals: 8,
      name: 'Wrapped BTC (PoS)',
      rivalzId: 'BTC'
    }
  ],
  [sepolia.id]: [
    {
      address: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin (Testnet)',
      rivalzId: 'USDC'
    },
    {
      address: '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357',
      symbol: 'DAI',
      decimals: 18,
      name: 'Dai Stablecoin (Testnet)',
      rivalzId: 'DAI'
    },
    {
      address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
      symbol: 'USDT',
      decimals: 6,
      name: 'Tether USD (Testnet)',
      rivalzId: 'USDT'
    },
    {
      address: '0x29f2D40B0605204364af54EC677bD022dA425d03',
      symbol: 'WBTC',
      decimals: 8,
      name: 'Wrapped Bitcoin (Testnet)',
      rivalzId: 'BTC'
    },
    {
      address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
      symbol: 'WETH',
      decimals: 18,
      name: 'Wrapped Ether (Testnet)',
      rivalzId: 'ETH'
    },
    {
      address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
      symbol: 'LINK',
      decimals: 18,
      name: 'Chainlink Token (Testnet)',
      rivalzId: 'LINK'
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

// Rivalz Oracle Integration
interface PriceData {
  [key: string]: number
}

const useRivalzPrices = (tokens: string[]) => {
  const [prices, setPrices] = useState<PriceData>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoize tokens array to prevent infinite re-renders
  const memoizedTokens = useMemo(() => tokens, [JSON.stringify(tokens)])

  const fetchPrices = useCallback(async () => {
    if (memoizedTokens.length === 0) return

    setLoading(true)
    setError(null)
    
    try {
      // Mock Rivalz Oracle API call - replace with actual Rivalz endpoint
      const response = await fetch('/api/rivalz/prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokens: memoizedTokens })
      })
      
      if (response.ok) {
        const data = await response.json()
        setPrices(data)
      } else {
        // Fallback to mock prices for development
        const mockPrices: PriceData = {
          'ETH': 2300,
          'BTC': 43000,
          'USDC': 1.00,
          'USDT': 1.00,
          'DAI': 1.00,
          'LINK': 14.50,
          'MATIC': 0.85
        }
        setPrices(mockPrices)
      }
    } catch (err) {
      console.error('Error fetching prices:', err)
      setError('Failed to fetch prices')
      // Fallback prices
      const mockPrices: PriceData = {
        'ETH': 2300,
        'BTC': 43000,
        'USDC': 1.00,
        'USDT': 1.00,
        'DAI': 1.00,
        'LINK': 14.50,
        'MATIC': 0.85
      }
      setPrices(mockPrices)
    } finally {
      setLoading(false)
    }
  }, [memoizedTokens])

  useEffect(() => {
    fetchPrices()
    
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [fetchPrices])

  return { prices, loading, error, refetch: fetchPrices }
}

export function TokenBalance() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  // Get tokens for current chain
  const currentTokens = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES] || []
  
  // Get native token info
  const getNativeTokenInfo = () => {
    switch (chainId) {
      case mainnet.id:
        return { symbol: 'ETH', name: 'Ethereum', rivalzId: 'ETH' }
      case polygon.id:
        return { symbol: 'MATIC', name: 'Polygon', rivalzId: 'MATIC' }
      case sepolia.id:
        return { symbol: 'SepoliaETH', name: 'Sepolia Ether', rivalzId: 'ETH' }
      default:
        return { symbol: 'ETH', name: 'Ethereum', rivalzId: 'ETH' }
    }
  }
  
  const nativeToken = getNativeTokenInfo()
  
  // Get all token IDs for price fetching - memoized to prevent infinite loops
  const allTokenIds = useMemo(() => {
    const uniqueIds = new Set([nativeToken.rivalzId, ...currentTokens.map(t => t.rivalzId)])
    return Array.from(uniqueIds)
  }, [nativeToken.rivalzId, currentTokens])
  
  const { prices, loading: pricesLoading, error: pricesError } = useRivalzPrices(allTokenIds)
  
  // Get native token balance
  const { data: nativeBalance, isLoading: nativeLoading } = useBalance({
    address: address,
  })

  // Get ERC-20 token balances
  const { data: tokenBalances, isLoading: tokensLoading } = useReadContracts({
    contracts: currentTokens.map(token => ({
      address: token.address as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address!],
    })),
    query: {
      enabled: !!address && currentTokens.length > 0,
    },
  })

  // Calculate total portfolio value
  const calculateTotalValue = useCallback(() => {
    let total = 0
    
    // Add native token value
    if (nativeBalance && prices[nativeToken.rivalzId]) {
      const nativeAmount = parseFloat(formatUnits(nativeBalance.value, nativeBalance.decimals))
      total += nativeAmount * prices[nativeToken.rivalzId]
    }
    
    // Add ERC-20 token values
    currentTokens.forEach((token, index) => {
      const balance = tokenBalances?.[index]
      if (balance?.status === 'success' && prices[token.rivalzId]) {
        const amount = parseFloat(formatUnits(balance.result, token.decimals))
        total += amount * prices[token.rivalzId]
      }
    })
    
    return total
  }, [nativeBalance, prices, nativeToken.rivalzId, currentTokens, tokenBalances])

  const totalPortfolioValue = calculateTotalValue()

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
            Your current token holdings on {chainId === polygon.id ? 'Polygon' : chainId === mainnet.id ? 'Ethereum' : 'Sepolia'}
            {pricesLoading && <span className="ml-2 text-xs">(Loading prices...)</span>}
            {pricesError && <span className="ml-2 text-xs text-red-500">(Price error)</span>}
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
                  <div className="space-y-1">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                  </div>
                ) : (
                  <div>
                    <div className="font-mono">
                      {nativeBalance ? parseFloat(formatUnits(nativeBalance.value, nativeBalance.decimals)).toFixed(4) : '0.0000'} {nativeToken.symbol}
                    </div>
                    {prices[nativeToken.rivalzId] && nativeBalance && (
                      <div className="text-sm text-muted-foreground">
                        ${(parseFloat(formatUnits(nativeBalance.value, nativeBalance.decimals)) * prices[nativeToken.rivalzId]).toFixed(2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ERC-20 Token Balances */}
            {currentTokens.map((token, index) => {
              const balance = tokenBalances?.[index]
              const hasError = balance?.status === 'failure'
              const balanceValue = balance?.status === 'success' ? balance.result : BigInt(0)
              const formattedBalance = parseFloat(formatUnits(balanceValue, token.decimals))
              const usdValue = prices[token.rivalzId] ? formattedBalance * prices[token.rivalzId] : 0
              
              return (
                <div key={token.address} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      token.symbol.includes('USDC') 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                        : token.symbol === 'USDT'
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : token.symbol === 'DAI'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : token.symbol === 'WBTC'
                        ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
                        : 'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      <span className="text-white text-xs font-bold">{token.symbol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-sm text-muted-foreground">{token.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {tokensLoading ? (
                      <div className="space-y-1">
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                      </div>
                    ) : hasError ? (
                      <div className="text-sm text-red-500">Error</div>
                    ) : (
                      <div>
                        <div className="font-mono">
                          {formattedBalance.toFixed(token.decimals === 18 ? 4 : 2)} {token.symbol}
                        </div>
                        {prices[token.rivalzId] && (
                          <div className="text-sm text-muted-foreground">
                            ${usdValue.toFixed(2)}
                          </div>
                        )}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {currentTokens.length + 1}
              </div>
              <div className="text-sm text-muted-foreground">Assets</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {chainId === polygon.id ? 'Polygon' : chainId === mainnet.id ? 'Ethereum' : 'Testnet'}
              </div>
              <div className="text-sm text-muted-foreground">Network</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
                <DollarSign className="h-6 w-6" />
                {totalPortfolioValue.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Value (USD)</div>
              {pricesLoading && (
                <div className="text-xs text-muted-foreground mt-1">Updating...</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}