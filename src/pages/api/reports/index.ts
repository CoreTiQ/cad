import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const reports = await prisma.policeReport.findMany({
        include: {
          officer: true,
          subject: true
        },
        orderBy: {
          created_at: 'desc' // تغيير createdAt إلى created_at
        }
      })
      
      return res.status(200).json(reports)
    } catch (error) {
      console.error('Error fetching reports:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  if (req.method === 'POST') {
    const { title, description, subject_citizenid, charges } = req.body

    if (!title || !description || !subject_citizenid || !charges) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    try {
      const report = await prisma.policeReport.create({
        data: {
          title,
          description,
          officer_citizenid: session.user.id, // تأكد من تطابق اسم الحقل
          subject_citizenid: subject_citizenid,
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