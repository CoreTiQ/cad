// En src/pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
          return null;
        }

        try {
          // Buscar al jugador por citizenid
          const player = await prisma.player.findUnique({
            where: {
              id: credentials.citizenid
            }
          });

          if (!player) {
            return null;
          }

          // En QBCore normalmente no necesitas verificar la contraseña desde la base de datos
          // ya que la autenticación se maneja a través del servidor FiveM
          // Para este ejemplo, asumiré que la implementación se basa en el citizenid
          // Puedes modificar esto según tu configuración específica

          // Opción simplificada para CAD policial: usar una contraseña fija para todos los oficiales
          // o usar un sistema de contraseñas específico para el CAD
          const password = "police123"; // Puedes almacenar esto en una variable de entorno
          
          if (credentials.password !== password) {
            return null;
          }

          // Extraer información del jugador desde charinfo (que es un campo JSON)
          const charinfo = player.charinfo as any;
          const job = player.job as any;
          
          return {
            id: player.id.toString(),
            citizenid: player.id,
            name: charinfo ? `${charinfo.firstname} ${charinfo.lastname}` : "Officer",
            job: job ? job.name : "",
            grade: job ? job.grade : 0
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.citizenid = user.citizenid;
        token.job = user.job;
        token.grade = user.grade;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.citizenid = token.citizenid as string;
        session.user.job = token.job as string;
        session.user.grade = token.grade as number;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);