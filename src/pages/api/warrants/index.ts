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
    try {
      const warrants = await prisma.warrant.findMany({
        include: {
          officer: true,
          subject: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      return res.status(200).json(warrants)
    } catch (error) {
      console.error('Error fetching warrants:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  if (req.method === 'POST') {
    const { reason, description, subjectId, expiresAt } = req.body

    if (!reason || !description || !subjectId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    try {
      const officerId = parseInt(session.user.id)
      
      const warrant = await prisma.warrant.create({
        data: {
          reason,
          description,
          officerId,
          subjectId: parseInt(subjectId),
          expiresAt: expiresAt ? new Date(expiresAt) : null
        }
      })

      return res.status(201).json(warrant)
    } catch (error) {
      console.error('Error creating warrant:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}