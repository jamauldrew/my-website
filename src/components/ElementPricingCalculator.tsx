//elementpricingcalculator.tsx
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Element {
  name: string
  baseTime: number
  complexity: number
  quantity: number
}

const ElementPricingCalculator: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([
    { name: 'P&ID Page', baseTime: 4, complexity: 1, quantity: 1 },
    { name: 'Isometric Drawing', baseTime: 2, complexity: 1, quantity: 1 },
    { name: 'Equipment Layout', baseTime: 6, complexity: 1, quantity: 1 },
    { name: 'Sheet Metal Part', baseTime: 3, complexity: 1, quantity: 1 },
  ])
  const [hourlyRate, setHourlyRate] = useState<number>(100)
  const [overhead, setOverhead] = useState<number>(30)
  const [profit, setProfit] = useState<number>(20)
  const [competitorPrice, setCompetitorPrice] = useState<number>(0)
  const [profitMargin, setProfitMargin] = useState<number>(0)
  const [profitAnalysis, setProfitAnalysis] = useState<
    { profit: number; price: number }[]
  >([])

  const addElement = () => {
    setElements([
      ...elements,
      { name: '', baseTime: 1, complexity: 1, quantity: 1 },
    ])
  }

  const updateElement = (
    index: number,
    field: 'name' | 'baseTime' | 'complexity' | 'quantity',
    value: string | number
  ) => {
    const newElements = [...elements]
    if (field === 'name') {
      newElements[index][field] = value as string
    } else {
      newElements[index][field] = Number(value)
    }
    setElements(newElements)
  }

  const calculateComplexityFactor = (complexity: number): number => {
    if (complexity === 1) return 1
    return 1 + (Math.pow(2, complexity - 1) - 1) / 2
  }

  const calculateTotalPrice = useCallback(
    (profitPercentage: number): number => {
      const totalHours = elements.reduce((sum, element) => {
        const complexityFactor = calculateComplexityFactor(element.complexity)
        return sum + element.baseTime * complexityFactor * element.quantity
      }, 0)

      const basePrice = totalHours * hourlyRate
      const overheadAmount = basePrice * (overhead / 100)
      const profitAmount =
        (basePrice + overheadAmount) * (profitPercentage / 100)
      return basePrice + overheadAmount + profitAmount
    },
    [elements, hourlyRate, overhead]
  )

  const calculateProfitMargin = useCallback(() => {
    const totalCost = calculateTotalPrice(0)
    const totalPrice = calculateTotalPrice(profit)
    const profitAmount = totalPrice - totalCost
    setProfitMargin((profitAmount / totalPrice) * 100)
  }, [calculateTotalPrice, profit])

  useEffect(() => {
    calculateProfitMargin()
    // Generate profit analysis data
    const analysisData = []
    for (let i = 0; i <= 50; i += 5) {
      analysisData.push({
        profit: i,
        price: calculateTotalPrice(i),
      })
    }
    setProfitAnalysis(analysisData)
  }, [
    elements,
    hourlyRate,
    overhead,
    profit,
    calculateTotalPrice,
    calculateProfitMargin,
  ])

  return (
    <TooltipProvider>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Enhanced CAD Service Pricing Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={hourlyRate}
                  onChange={e => setHourlyRate(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="overhead">Overhead (%)</Label>
                <Input
                  id="overhead"
                  type="number"
                  value={overhead}
                  onChange={e => setOverhead(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="profit">Profit (%)</Label>
                <Input
                  id="profit"
                  type="number"
                  value={profit}
                  onChange={e => setProfit(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="competitorPrice">Competitor Price ($)</Label>
                <Input
                  id="competitorPrice"
                  type="number"
                  value={competitorPrice}
                  onChange={e => setCompetitorPrice(Number(e.target.value))}
                />
              </div>
            </div>

            {elements.map((element, index) => (
              <div key={index} className="grid grid-cols-4 gap-2">
                <Input
                  placeholder="Element Name"
                  value={element.name}
                  onChange={e => updateElement(index, 'name', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Base Time (hours)"
                  value={element.baseTime}
                  onChange={e =>
                    updateElement(index, 'baseTime', e.target.value)
                  }
                />
                <Tooltip>
                  <TooltipTrigger>
                    <Input
                      type="number"
                      placeholder="Complexity (1-3)"
                      id="complexity"
                      min="1"
                      max="3"
                      value={element.complexity}
                      onChange={e =>
                        updateElement(index, 'complexity', e.target.value)
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm text-gray-500">
                      Complexity affects the time required: 1 (no increase), 2
                      (moderate increase), 3 (significant increase).
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={element.quantity}
                  onChange={e =>
                    updateElement(index, 'quantity', e.target.value)
                  }
                />
              </div>
            ))}

            <Button onClick={addElement}>Add Element</Button>

            <div className="pt-4 space-y-2">
              <p className="text-lg font-semibold">
                Total Project Price: ${calculateTotalPrice(profit).toFixed(2)}
              </p>
              <p>Profit Margin: {profitMargin.toFixed(2)}%</p>
              {competitorPrice > 0 && (
                <Alert>
                  <AlertTitle>Competitive Analysis</AlertTitle>
                  <AlertDescription>
                    Your price is{' '}
                    {calculateTotalPrice(profit) > competitorPrice
                      ? 'higher'
                      : 'lower'}{' '}
                    than the competitor&apos;s price.
                    <br />
                    Difference: $
                    {Math.abs(
                      calculateTotalPrice(profit) - competitorPrice
                    ).toFixed(2)}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="pt-4" style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={profitAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="profit"
                    label={{
                      value: 'Profit %',
                      position: 'insideBottom',
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: 'Total Price ($)',
                      angle: -90,
                      position: 'insideLeft',
                    }}
                  />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

export default ElementPricingCalculator
