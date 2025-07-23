'use client'

import { WalletConnectButton } from "@/components/WalletConnectButton"
import { ChainSwitcher } from "@/components/ChainSwitcher"
import { TokenBalance } from "@/components/TokenBalance"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import { Send, ArrowUpDown, History, Settings } from "lucide-react"

export default function Dashboard() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">SeiSwift Dashboard</h1>
            <p className="text-muted-foreground">Manage your international transactions</p>
          </div>
          <div className="flex items-center gap-4">
            <ChainSwitcher />
            <WalletConnectButton />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Token Balances */}
          <div className="lg:col-span-2">
            <TokenBalance />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common transaction operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start gap-2" 
                  disabled={!isConnected}
                >
                  <Send className="h-4 w-4" />
                  Send Tokens
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  disabled={!isConnected}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Swap Tokens
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  disabled={!isConnected}
                >
                  <History className="h-4 w-4" />
                  Transaction History
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </CardContent>
            </Card>

            {/* Network Status */}
            <Card>
              <CardHeader>
                <CardTitle>Network Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Status</span>
                    <span className="text-sm font-medium text-green-600">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Network</span>
                    <span className="text-sm font-medium">Ethereum</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Gas Price</span>
                    <span className="text-sm font-medium">~20 gwei</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {isConnected ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent transactions</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Connect wallet to view activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}