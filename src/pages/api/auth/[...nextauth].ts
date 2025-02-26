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
          // البحث عن اللاعب باستخدام رقم الهوية
          const player = await prisma.player.findUnique({
            where: {
              id: credentials.citizenid
            }
          });

          if (!player) {
            return null;
          }

          // التحقق من الصلاحيات (هل هذا الشخص ضابط شرطة)
          const job = player.job as any;
          
          if (!job || job.name !== 'police') {
            // إذا لم يكن الشخص ضابط شرطة، لا يمكنه الوصول إلى النظام
            return null;
          }

          // استخدم كلمة مرور ثابتة للجميع (للاختبار فقط)
          // في البيئة الإنتاجية يجب استخدام نظام أكثر أمانًا
          const fixedPassword = process.env.POLICE_CAD_PASSWORD || "police123";
          
          if (credentials.password !== fixedPassword) {
            return null;
          }

          // استخراج معلومات اللاعب من الحقل charinfo (حقل JSON)
          const charinfo = player.job ? (player.charinfo as any) : null;
          
          return {
            id: player.id,
            name: charinfo ? `${charinfo.firstname} ${charinfo.lastname}` : "الضابط",
            job: job ? job.name : "",
            grade: job ? job.grade : 0,
            citizenid: player.id,
            email: ""
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