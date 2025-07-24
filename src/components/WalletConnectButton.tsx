'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Wallet, LogOut } from 'lucide-react'
import { useState } from 'react'

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [isOpen, setIsOpen] = useState(false)

  // Filter out MetaMask connector, keep only injected and walletConnect
  const filteredConnectors = connectors.filter(
    (connector) => connector.id === 'injected' || connector.id === 'walletConnect'
  )

  const handleConnect = (connector: any) => {
    connect({ connector })
    setIsOpen(false)
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {filteredConnectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="outline"
              onClick={() => handleConnect(connector)}
              disabled={isPending}
              className="justify-start gap-3 h-12"
            >
              <Wallet className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">
                  {connector.name === 'Injected' ? 'Browser Wallet' : connector.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {connector.name === 'Injected' 
                    ? 'MetaMask, Coinbase Wallet, etc.' 
                    : 'Scan with WalletConnect'
                  }
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}