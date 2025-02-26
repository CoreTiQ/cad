# FiveM Police CAD System

نظام إدارة الشرطة (CAD) لسيرفرات FiveM مع دعم QBCore.

## الميزات

- واجهة مستخدم عصرية مع دعم الوضع الداكن
- بحث عن المواطنين
- بحث عن المركبات
- إدارة البلاغات
- إدارة أوامر القبض
- إدارة المخالفات

## المتطلبات

- Node.js
- FiveM Server with QBCore Framework
- MySQL Database

## التثبيت

1. استنساخ المستودع:
```bash
git clone https://github.com/yourusername/fivem-police-cad.git
cd fivem-police-cad
```

2. تثبيت الاعتماديات:
```bash
npm install
```

3. تعديل ملف `.env` وإضافة بيانات الاتصال بقاعدة البيانات.

4. تشغيل ترحيل قاعدة البيانات:
```bash
npx prisma migrate dev
```

5. تشغيل الخادم المحلي:
```bash
npm run dev
```

## النشر على Vercel

1. قم بإنشاء مستودع جديد على GitHub.
2. ارفع المشروع إلى المستودع.
3. قم بالتسجيل في [Vercel](https://vercel.com).
4. استيراد المشروع من GitHub.
5. قم بتكوين متغيرات البيئة في إعدادات المشروع على Vercel.
6. انشر المشروع!

## الترخيص

MIT
