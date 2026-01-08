import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { DashboardStats, useDashboardStore } from '@/store/useDashboardStore';
import React from 'react'

type TopCardProps = {
    title: string
    description?: string
}

const TopCard = ({title, description} : TopCardProps) => {
    
  return (
    <Card className="w-full max-w-8xl mx-auto bg-linear-to-r from-red-700 to-red-500 text-white">
          <CardHeader>
            <CardTitle className="text-2xl ">
              {title}
            </CardTitle>
            <CardDescription className="mt-2 text-white/70">
              {description}
            </CardDescription>
          </CardHeader>
          
          <CardFooter className="flex justify-end">
            <span className="text-xs">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </CardFooter>
        </Card>
  )
}

export default TopCard
