import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    const { plate } = req.query
    
    if (!plate || typeof plate !== 'string') {
      return res.status(400).json({ error: 'Plate number is required' })
    }

    try {
      const vehicle = await prisma.playerVehicle.findFirst({
        where: {
          plate: { contains: plate }
        }
      })
      
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' })
      }
      
      const owner = await prisma.player.findFirst({
        where: {
          id: vehicle.citizenid
        }
      })
      
      return res.status(200).json({
        vehicle,
        owner
      })
    } catch (error) {
      console.error('Error searching vehicle:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}