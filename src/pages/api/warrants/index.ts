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
      const status = req.query.status as string
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined
      
      const warrants = await prisma.policeWarrant.findMany({
        where: status ? { status } : undefined,
        include: {
          officer: true,
          subject: true
        },
        orderBy: {
          created_at: 'desc'
        },
        ...(limit ? { take: limit } : {})
      })
      
      const formattedWarrants = warrants.map(warrant => {
        const officerCharInfo = warrant.officer.charinfo as any
        const subjectCharInfo = warrant.subject.charinfo as any
        
        return {
          ...warrant,
          officer: {
            ...warrant.officer,
            firstname: officerCharInfo?.firstname || '',
            lastname: officerCharInfo?.lastname || ''
          },
          subject: {
            ...warrant.subject,
            firstname: subjectCharInfo?.firstname || '',
            lastname: subjectCharInfo?.lastname || ''
          }
        }
      })
      
      return res.status(200).json(formattedWarrants)
    } catch (error) {
      console.error('Error fetching warrants:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  if (req.method === 'POST') {
    const { reason, description, subject_citizenid, expires_at } = req.body

    if (!reason || !description || !subject_citizenid) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    try {
      const officer_citizenid = session.user.citizenid
      
      const warrant = await prisma.policeWarrant.create({
        data: {
          reason,
          description,
          officer_citizenid,
          subject_citizenid,
          expires_at: expires_at ? new Date(expires_at) : null
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