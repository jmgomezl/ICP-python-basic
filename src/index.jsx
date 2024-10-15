'use client'

import { useState, useEffect } from 'react'
import { AuthClient } from '@dfinity/auth-client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


export default function Component() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [principal, setPrincipal] = useState('')
  const [balance, setBalance] = useState(0)
  const [currentBet, setCurrentBet] = useState(0.1)
  const [level, setLevel] = useState(0)
  const [playerStats, setPlayerStats] = useState('')
  const [leaderboard, setLeaderboard] = useState('')
  const [gameBoard, setGameBoard] = useState(Array(25).fill(false))

  useEffect(() => {
    initAuth()
  }, [])

  async function initAuth() {
    const authClient = await AuthClient.create()
    const isAuthenticated = await authClient.isAuthenticated()
    setIsAuthenticated(isAuthenticated)

    if (isAuthenticated) {
      const identity = authClient.getIdentity()
      const principal = identity.getPrincipal().toString()
      setPrincipal(principal)
      fetchPlayerData(principal)
    }
  }

  async function login() {
    const authClient = await AuthClient.create()
    authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: () => {
        setIsAuthenticated(true)
        const identity = authClient.getIdentity()
        const principal = identity.getPrincipal().toString()
        setPrincipal(principal)
        fetchPlayerData(principal)
      },
    })
  }

  async function logout() {
    const authClient = await AuthClient.create()
    await authClient.logout()
    setIsAuthenticated(false)
    setPrincipal('')
    resetGameState()
  }

  function resetGameState() {
    setBalance(0)
    setCurrentBet(0.1)
    setLevel(0)
    setPlayerStats('')
    setGameBoard(Array(25).fill(false))
  }

  async function fetchPlayerData(principal) {
    // In a real implementation, this would make a call to your backend
    // For now, we'll just set some dummy data
    setBalance(10)
    updatePlayerStats()
    updateLeaderboard()
  }

  async function joinGame() {
    // In a real implementation, this would make a call to your backend
    console.log('Joining game...')
    resetGameState()
    setBalance(prevBalance => prevBalance - currentBet)
  }

  async function setBet(amount) {
    // In a real implementation, this would make a call to your backend
    console.log(`Setting bet to ${amount}...`)
    setCurrentBet(amount)
  }

  async function advanceLevel(cellIndex) {
    // In a real implementation, this would make a call to your backend
    console.log('Advancing level...')
    
    // Simulate hitting a mine with 20% probability
    if (Math.random() < 0.2) {
      alert('You hit a mine! Game over.')
      resetGameState()
    } else {
      const newGameBoard = [...gameBoard]
      newGameBoard[cellIndex] = true
      setGameBoard(newGameBoard)
      setLevel(prevLevel => prevLevel + 1)
      setBalance(prevBalance => prevBalance + currentBet * 1.2) // 20% increase per level
    }
  }

  async function withdrawRewards() {
    // In a real implementation, this would make a call to your backend
    console.log('Withdrawing rewards...')
    alert(`Withdrew ${balance} ICP`)
    resetGameState()
  }

  async function updatePlayerStats() {
    // In a real implementation, this would make a call to your backend
    setPlayerStats('Wins: 5\nLosses: 3\nWin Rate: 62.5%\nTotal Earned: 10.5 ICP')
  }

  async function updateLeaderboard() {
    // In a real implementation, this would make a call to your backend
    setLeaderboard('1. Player123 - Level: 5, Total Earned: 50 ICP\n2. Player456 - Level: 4, Total Earned: 40 ICP')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Mines Game</h1>
      
      {!isAuthenticated ? (
        <Button onClick={login}>Login with Internet Identity</Button>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Player Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Principal: {principal}</p>
              <p>Balance: {balance.toFixed(2)} ICP</p>
              <p>Current Bet: {currentBet} ICP</p>
              <p>Level: {level}</p>
            </CardContent>
          </Card>

          <div className="flex space-x-2">
            <Button onClick={joinGame}>Join Game</Button>
            <Input 
              type="number" 
              min={0.1} 
              max={1} 
              step={0.1} 
              value={currentBet}
              onChange={(e) => setBet(parseFloat(e.target.value))}
            />
            <Button onClick={withdrawRewards}>Withdraw Rewards</Button>
            <Button onClick={logout}>Logout</Button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {gameBoard.map((cell, index) => (
              <Button 
                key={index} 
                variant={cell ? "default" : "outline"} 
                onClick={() => advanceLevel(index)}
                disabled={cell}
              >
                {cell ? '✓' : '?'}
              </Button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Player Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <pre>{playerStats}</pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <pre>{leaderboard}</pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}