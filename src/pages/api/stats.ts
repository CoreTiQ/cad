import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const [totalReports, totalWarrants, totalCitizens, totalVehicles] = await Promise.all([
        prisma.report.count(),
        prisma.warrant.count(),
        prisma.user.count(),
        prisma.vehicle.count()
      ])
      
      return res.status(200).json({
        totalReports,
        totalWarrants,
        totalCitizens,
        totalVehicles
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}