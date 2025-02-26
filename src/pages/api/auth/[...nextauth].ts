import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        citizenid: { label: 'CitizenID', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.citizenid || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.player.findUnique({
            where: {
              id: credentials.citizenid
            }
          })

          if (!user) {
            return null
          }

          const isValidPassword = bcrypt.compareSync(credentials.password, user.password)

          if (!isValidPassword) {
            return null
          }

          return {
            id: user.id.toString(),
            citizenid: user.citizenid,
            name: `${user.firstname} ${user.lastname}`,
            job: user.job,
            grade: user.grade
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.citizenid = user.citizenid
        token.job = user.job
        token.grade = user.grade
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.citizenid = token.citizenid as string
        session.user.job = token.job as string
        session.user.grade = token.grade as number
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)