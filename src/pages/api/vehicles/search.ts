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
        },
        include: {
          player: true
        }
      })
      
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' })
      }
      
      const charinfo = vehicle.player.charinfo as any
      
      const formattedResult = {
        vehicle: {
          id: vehicle.id,
          plate: vehicle.plate,
          model: vehicle.vehicle,
          state: vehicle.state,
          garage: vehicle.garage,
          fuel: vehicle.fuel,
          engine: vehicle.engine,
          body: vehicle.body
        },
        owner: {
          citizenid: vehicle.citizenid,
          firstname: charinfo?.firstname || '',
          lastname: charinfo?.lastname || ''
        }
      }
      
      return res.status(200).json(formattedResult)
    } catch (error) {
      console.error('Error searching vehicle:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}