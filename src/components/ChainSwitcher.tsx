'use client'

import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Network, Check } from 'lucide-react'
import { mainnet, polygon, sepolia } from 'wagmi/chains'

const SUPPORTED_CHAINS = [
  {
    ...mainnet,
    icon: '🔷',
    color: 'bg-blue-500'
  },
  {
    ...polygon,
    icon: '🟣',
    color: 'bg-purple-500'
  },
  {
    ...sepolia,
    icon: '🔸',
    color: 'bg-yellow-500'
  }
]

export function ChainSwitcher() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  const currentChain = SUPPORTED_CHAINS.find(chain => chain.id === chainId)

  if (!isConnected) {
    return null
  }

  const handleChainSwitch = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId as 1 | 137 | 11155111 })
    } catch (error) {
      console.error('Failed to switch chain:', error)
      // You can add toast notification here
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={isPending}>
          <Network className="h-4 w-4" />
          {currentChain ? (
            <>
              <span>{currentChain.icon}</span>
              <span>{currentChain.name}</span>
            </>
          ) : (
            <span>Unknown Network</span>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {SUPPORTED_CHAINS.map((chain) => {
          const isCurrentChain = chainId === chain.id
          
          return (
            <DropdownMenuItem
              key={chain.id}
              onClick={() => !isCurrentChain && handleChainSwitch(chain.id)}
              className={`flex items-center gap-3 cursor-pointer ${
                isCurrentChain ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isCurrentChain || isPending}
            >
              <div className={`w-3 h-3 rounded-full ${chain.color}`} />
              <span className="text-lg">{chain.icon}</span>
              <span className="flex-1">{chain.name}</span>
              {isCurrentChain && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}