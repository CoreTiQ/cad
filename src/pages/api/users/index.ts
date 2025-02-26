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
      const users = await prisma.player.findMany({
        where: {
          OR: [
            { id: { contains: query } }, // استخدم id بدلاً من citizenid
            { 
              charinfo: {
                path: ['firstname'],
                string_contains: query 
              } 
            },
            { 
              charinfo: {
                path: ['lastname'],
                string_contains: query 
              } 
            }
          ]
        },
        take: 10
      })
      
      // تحويل المركبات إلى بيانات آمنة للإرسال
      const safeUsers = users.map(user => ({
        ...user,
        charinfo: user.charinfo ? JSON.parse(JSON.stringify(user.charinfo)) : null,
        job: user.job ? JSON.parse(JSON.stringify(user.job)) : null,
        money: user.money ? JSON.parse(JSON.stringify(user.money)) : null,
        metadata: user.metadata ? JSON.parse(JSON.stringify(user.metadata)) : null
      }))
      
      return res.status(200).json(safeUsers)
    } catch (error) {
      console.error('Error searching users:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}