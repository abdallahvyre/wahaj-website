# وَهَج

صفحة هبوط عربية متجاوبة لاستوديو «وَهَج» للموشن جرافيك والتصميم الحركي. تعتمد على HTML وCSS وJavaScript خالص، مع حركات GSAP وScrollTrigger المحمّلة من شبكة CDN.

## المزايا

- واجهة عربية باتجاه RTL ومتجاوبة مع الجوال وسطح المكتب.
- شاشة تحميل وحركات تمرير وتفاعلات للمؤشر والبطاقات.
- دعم تفضيل تقليل الحركة `prefers-reduced-motion`.
- أصول SVG خفيفة دون نظام بناء أو قاعدة بيانات.

## المتطلبات

- متصفح حديث.
- اتصال بالإنترنت لتحميل خطوط Google ومكتبتي GSAP وScrollTrigger.
- Python 3 لتشغيل خادم محلي بسيط، أو أي خادم ملفات ثابتة بديل.

## التشغيل محليًا

لا توجد حزم Python أو Node.js مطلوبة. بعد استنساخ المستودع:

```bash
git clone https://github.com/abdallahvyre/wahaj-website.git
cd wahaj-website
python -m venv .venv
```

فعّل البيئة الافتراضية اختياريًا:

```powershell
.venv\Scripts\Activate.ps1
```

```bash
source .venv/bin/activate
```

ثم شغّل الموقع:

```bash
python -m http.server 8000
```

افتح [http://localhost:8000](http://localhost:8000). لتغيير المنفذ، استبدل `8000` في أمر التشغيل بالمنفذ المطلوب.

## بنية المشروع

```text
assets/       شعارات وزخارف SVG
css/          تنسيقات الواجهة
js/           سلوك الواجهة والحركات
index.html    نقطة الدخول
```

## الإعداد والبيانات

لا يستخدم المشروع متغيرات بيئة، أو API، أو تدريبًا، أو تخزينًا محليًا/خادميًا. رابط التواصل الحالي يفتح برنامج البريد لدى الزائر، ولا يجمع الموقع أي بيانات بنفسه. يمكن تعديل البريد والروابط الاجتماعية مباشرةً في `index.html`.

## English summary

Wahaj is a responsive Arabic RTL landing page for a motion graphics studio. It is built with semantic HTML, CSS, vanilla JavaScript, and CDN-hosted GSAP/ScrollTrigger, with no build step, backend, database, or package installation required.
