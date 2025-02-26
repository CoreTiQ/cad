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

  const { id } = req.query
  const reportId = parseInt(id as string)
  
  if (isNaN(reportId)) {
    return res.status(400).json({ error: 'Invalid report ID' })
  }

  if (req.method === 'GET') {
    try {
      const report = const report = await prisma.policeReport.findUnique({
        where: { id: reportId },
        include: {
          officer: true,
          subject: true
        }
      })
      
      if (!report) {
        return res.status(404).json({ error: 'Report not found' })
      }
      
      return res.status(200).json(report)
    } catch (error) {
      console.error('Error fetching report:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  if (req.method === 'PUT') {
    const { title, description, charges, status } = req.body

    if (!title || !description || !charges || !status) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    try {
      const report = await prisma.report.update({
        where: { id: reportId },
        data: {
          title,
          description,
          charges,
          status
        }
      })

      return res.status(200).json(report)
    } catch (error) {
      console.error('Error updating report:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.report.delete({
        where: { id: reportId }
      })

      return res.status(200).json({ message: 'Report deleted successfully' })
    } catch (error) {
      console.error('Error deleting report:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}