'use client'

import { useAccount, useBalance, useReadContracts, useChainId } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatUnits } from 'viem'
import { Coins, TrendingUp, DollarSign } from 'lucide-react'
import { mainnet, polygon, sepolia } from 'wagmi/chains'
import { useState, useEffect, useCallback, useMemo } from 'react'


const CHAINLINK_PRICE_FEEDS = {
   [mainnet.id]: {
    'ETH/USD': '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    'BTC/USD': '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
    'USDC/USD': '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
    'USDT/USD': '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
    'DAI/USD': '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9',
    'LINK/USD': '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c'
  },
  [polygon.id]: {
    'MATIC/USD': '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0',
    'ETH/USD': '0xF9680D99D6C9589e2a93a78A04A279e509205945',
    'BTC/USD': '0xc907E116054Ad103354f2D350FD2514433D57F6f',
    'USDC/USD': '0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7',
    'USDT/USD': '0x0A6513e40db6EB1b165753AD52E80663aeA50545',
    'DAI/USD': '0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D',
    'LINK/USD': '0xd9FFdb71EbE7496cC440152d43986Aae0AB76665'
  },
  [sepolia.id]: {
    'ETH/USD': '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    'BTC/USD': '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43',
    'USDC/USD': '0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E',
    'DAI/USD': '0x14866185B1962B63C3Ea9E03Bc1da838bab34C19',
    'LINK/USD': '0xc59E3633BAAC79493d908e63626716e204A45EdF',
    
  }
}

const TOKEN_ADDRESSES = {
  [mainnet.id]: [
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin',
      priceFeed: 'USDC/USD'
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      decimals: 6,
      name: 'Tether USD',
      priceFeed: 'USDT/USD'
    },
    {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      decimals: 18,
      name: 'Dai Stablecoin',
      priceFeed: 'DAI/USD'
    },
    {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      symbol: 'WBTC',
      decimals: 8,
      name: 'Wrapped Bitcoin',
      priceFeed: 'BTC/USD'
    },
    {
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      symbol: 'LINK',
      decimals: 18,
      name: 'Chainlink Token',
      priceFeed: 'LINK/USD'
    }
  ],
  [polygon.id]: [
    {
      address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin (Native)',
      priceFeed: 'USDC/USD'
    },
    {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      symbol: 'USDC.e',
      decimals: 6,
      name: 'USD Coin (Bridged)',
      priceFeed: 'USDC/USD'
    },
    {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      symbol: 'USDT',
      decimals: 6,
      name: 'Tether USD (PoS)',
      priceFeed: 'USDT/USD'
    },
    {
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      symbol: 'DAI',
      decimals: 18,
      name: 'Dai Stablecoin (PoS)',
      priceFeed: 'DAI/USD'
    },
    {
      address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
      symbol: 'WBTC',
      decimals: 8,
      name: 'Wrapped BTC (PoS)',
      priceFeed: 'BTC/USD'
    },
    {
      address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
      symbol: 'LINK',
      decimals: 18,
      name: 'Chainlink Token (PoS)',
      priceFeed: 'LINK/USD'
    }
  ],
  [sepolia.id]: [
    {
      address: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin (Testnet)',
      priceFeed: 'USDC/USD'
    },
    {
      address: '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357',
      symbol: 'DAI',
      decimals: 18,
      name: 'Dai Stablecoin (Testnet)',
      priceFeed: 'DAI/USD'
    },
    {
      address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
      symbol: 'USDT',
      decimals: 6,
      name: 'Tether USD (Testnet)',
      priceFeed: 'USDT/USD'
    },
    {
      address: '0x29f2D40B0605204364af54EC677bD022dA425d03',
      symbol: 'WBTC',
      decimals: 8,
      name: 'Wrapped Bitcoin (Testnet)',
      priceFeed: 'BTC/USD'
    },
    {
      address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
      symbol: 'WETH',
      decimals: 18,
      name: 'Wrapped Ether (Testnet)',
      priceFeed: 'ETH/USD'
    },
    {
      address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
      symbol: 'LINK',
      decimals: 18,
      name: 'Chainlink Token (Testnet)',
      priceFeed: 'LINK/USD'
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


const CHAINLINK_ABI = [
  {
    name: 'latestRoundData',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'roundId', type: 'uint80' },
      { name: 'answer', type: 'int256' },
      { name: 'startedAt', type: 'uint256' },
      { name: 'updatedAt', type: 'uint256' },
      { name: 'answeredInRound', type: 'uint80' }
    ],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  }
] as const

interface PriceData {
  [key: string]: {
    price: number
    decimals: number
    updatedAt: number
  }
}

const useChainlinkPrices = (chainId: number) => {
  const [prices, setPrices] = useState<PriceData>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentPriceFeeds = CHAINLINK_PRICE_FEEDS[chainId as keyof typeof CHAINLINK_PRICE_FEEDS] || {}
  
  const priceFeedContracts = useMemo(() => {
    
    const typedChainId = chainId as 1 | 137 | 11155111 | undefined;
    return Object.entries(currentPriceFeeds).flatMap(([pair, address]) => [
      {
        address: address as `0x${string}`,
        abi: CHAINLINK_ABI,
        functionName: 'latestRoundData',
        chainId: typedChainId
      },
      {
        address: address as `0x${string}`,
        abi: CHAINLINK_ABI,
        functionName: 'decimals',
        chainId: typedChainId
      }
    ])
  }, [currentPriceFeeds, chainId])

  
  const { data: priceResults, isLoading: priceLoading, error: priceError } = useReadContracts({
    contracts: priceFeedContracts,
    query: {
      enabled: priceFeedContracts.length > 0,
      refetchInterval: 30000, 
    }
  })

  
  useEffect(() => {
    if (priceResults && !priceLoading) {
      const processedPrices: PriceData = {}
      const pricePairs = Object.keys(currentPriceFeeds)
      
      pricePairs.forEach((pair, index) => {
        const priceDataIndex = index * 2
        const decimalsIndex = index * 2 + 1
        
        const priceResult = priceResults[priceDataIndex]
        const decimalsResult = priceResults[decimalsIndex]
        
        if (priceResult?.status === 'success' && decimalsResult?.status === 'success') {
          let answer: bigint = BigInt(0)
          let updatedAt: bigint = BigInt(0)
          if (Array.isArray(priceResult.result)) {
            [, answer, , updatedAt] = priceResult.result
          }
          
          let decimals: number;
          if (typeof decimalsResult.result === 'number') {
            decimals = decimalsResult.result;
          } else if (Array.isArray(decimalsResult.result)) {
            decimals = Number(decimalsResult.result[0]);
          } else {
            decimals = 18; 
          }
          
          const price = Number(formatUnits(BigInt(answer.toString()), decimals))
          
          processedPrices[pair] = {
            price,
            decimals,
            updatedAt: Number(updatedAt)
          }
        }
      })
      
      setPrices(processedPrices)
      setError(null)
    } else if (priceError) {
      setError('Failed to fetch price data')
      console.error('Chainlink price fetch error:', priceError)
    }
  }, [priceResults, priceLoading, priceError, currentPriceFeeds])

  return { 
    prices, 
    loading: priceLoading, 
    error,
    refetch: () => {} 
  }
}

export function TokenBalance() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  
  const currentTokens = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES] || []
  
  
  const getNativeTokenInfo = () => {
    switch (chainId) {
      case mainnet.id:
        return { symbol: 'ETH', name: 'Ethereum', priceFeed: 'ETH/USD' }
      case polygon.id:
        return { symbol: 'MATIC', name: 'Polygon', priceFeed: 'MATIC/USD' }
      case sepolia.id:
        return { symbol: 'SepoliaETH', name: 'Sepolia Ether', priceFeed: 'ETH/USD' }
      default:
        return { symbol: 'ETH', name: 'Ethereum', priceFeed: 'ETH/USD' }
    }
  }
  
  const nativeToken = getNativeTokenInfo()
  
  
  const { prices, loading: pricesLoading, error: pricesError } = useChainlinkPrices(chainId)
  
  
  const { data: nativeBalance, isLoading: nativeLoading } = useBalance({
    address: address,
  })

  
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

  
  const calculateTotalValue = useCallback(() => {
    let total = 0
    
    
    if (nativeBalance && prices[nativeToken.priceFeed]) {
      const nativeAmount = parseFloat(formatUnits(nativeBalance.value, nativeBalance.decimals))
      total += nativeAmount * prices[nativeToken.priceFeed].price
    }
    
    
    currentTokens.forEach((token, index) => {
      const balance = tokenBalances?.[index]
      if (balance?.status === 'success' && prices[token.priceFeed]) {
        const amount = parseFloat(formatUnits(balance.result, token.decimals))
        total += amount * prices[token.priceFeed].price
      }
    })
    
    return total
  }, [nativeBalance, prices, nativeToken.priceFeed, currentTokens, tokenBalances])

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
            {pricesLoading && <span className="ml-2 text-xs">(Loading Chainlink prices...)</span>}
            {pricesError && <span className="ml-2 text-xs text-red-500">(Chainlink price error)</span>}
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
                    {prices[nativeToken.priceFeed] && nativeBalance && (
                      <div className="text-sm text-muted-foreground">
                        ${(parseFloat(formatUnits(nativeBalance.value, nativeBalance.decimals)) * prices[nativeToken.priceFeed].price).toFixed(2)}
                        <div className="text-xs">
                          ${prices[nativeToken.priceFeed].price.toFixed(2)} • {new Date(prices[nativeToken.priceFeed].updatedAt * 1000).toLocaleTimeString()}
                        </div>
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
              const priceData = prices[token.priceFeed]
              const usdValue = priceData ? formattedBalance * priceData.price : 0
              
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
                        : token.symbol === 'LINK'
                        ? 'bg-gradient-to-r from-blue-400 to-blue-600'
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
                        {priceData && (
                          <div className="text-sm text-muted-foreground">
                            ${usdValue.toFixed(2)}
                            <div className="text-xs">
                              ${priceData.price.toFixed(2)} • {new Date(priceData.updatedAt * 1000).toLocaleTimeString()}
                            </div>
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
          <CardDescription>
            Powered by Chainlink Price Feeds
          </CardDescription>
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
                <div className="text-xs text-muted-foreground mt-1">Updating prices...</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}