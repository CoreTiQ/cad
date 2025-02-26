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
      const reports = await prisma.report.findMany({
        include: {
          officer: true,
          subject: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      return res.status(200).json(reports)
    } catch (error) {
      console.error('Error fetching reports:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  if (req.method === 'POST') {
    const { title, description, subjectId, charges } = req.body

    if (!title || !description || !subjectId || !charges) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    try {
      const officerId = parseInt(session.user.id)
      
      const report = await prisma.report.create({
        data: {
          title,
          description,
          officerId,
          subjectId: parseInt(subjectId),
          charges
        }
      })

      return res.status(201).json(report)
    } catch (error) {
      console.error('Error creating report:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}