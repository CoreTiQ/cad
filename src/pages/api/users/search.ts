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
    const { query } = req.query
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' })
    }

    try {
      const players = await prisma.player.findMany({
        take: 10
      })
      
      const filteredPlayers = players.filter(player => {
        const charinfo = player.charinfo as any
        
        if (!charinfo) return false
        
        const citizenidMatch = player.id.toLowerCase().includes(query.toLowerCase())
        const firstnameMatch = charinfo.firstname?.toLowerCase().includes(query.toLowerCase())
        const lastnameMatch = charinfo.lastname?.toLowerCase().includes(query.toLowerCase())
        
        return citizenidMatch || firstnameMatch || lastnameMatch
      })
      
      const formattedPlayers = filteredPlayers.map(player => {
        const charinfo = player.charinfo as any
        const job = player.job as any
        
        return {
          id: player.id,
          citizenid: player.id,
          firstname: charinfo?.firstname || '',
          lastname: charinfo?.lastname || '',
          job: job?.name || 'unemployed',
          grade: job?.grade || 0
        }
      })
      
      return res.status(200).json(formattedPlayers)
    } catch (error) {
      console.error('Error searching users:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}