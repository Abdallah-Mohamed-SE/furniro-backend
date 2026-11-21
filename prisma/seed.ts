import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as any);

  console.log('🌱 Starting production database cleanup & seed...');

  // ─── 1. Cleanup Demo Data ──────────────────────────────────────────────────
  console.log('🧹 Cleaning up demo records...');
  const deletedItems = await prisma.orderItem.deleteMany();
  const deletedOrders = await prisma.order.deleteMany();
  const deletedMessages = await prisma.contactMessage.deleteMany();
  const deletedAddresses = await prisma.address.deleteMany();
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      email: {
        not: 'admin@furniro.com',
      },
    },
  });

  console.log(`   - Deleted ${deletedItems.count} order items`);
  console.log(`   - Deleted ${deletedOrders.count} orders`);
  console.log(`   - Deleted ${deletedMessages.count} contact messages`);
  console.log(`   - Deleted ${deletedAddresses.count} addresses`);
  console.log(`   - Deleted ${deletedUsers.count} non-admin users`);

  // ─── 2. Admin User ────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@furniro.com' },
    update: {
      password: adminPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@furniro.com',
      password: adminPassword,
      name: 'Furniro Admin',
      phone: '+201000000001',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user verified:', admin.email);

  // ─── 3. Categories ────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'dining' },
      update: {
        name: 'Dining',
        nameAr: 'غرفة الطعام',
        image: '/images/categories/dining.jpg',
      },
      create: {
        name: 'Dining',
        nameAr: 'غرفة الطعام',
        slug: 'dining',
        image: '/images/categories/dining.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'living' },
      update: {
        name: 'Living',
        nameAr: 'غرفة المعيشة',
        image: '/images/categories/living.jpg',
      },
      create: {
        name: 'Living',
        nameAr: 'غرفة المعيشة',
        slug: 'living',
        image: '/images/categories/living.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'bedroom' },
      update: {
        name: 'Bedroom',
        nameAr: 'غرفة النوم',
        image: '/images/categories/bedroom.jpg',
      },
      create: {
        name: 'Bedroom',
        nameAr: 'غرفة النوم',
        slug: 'bedroom',
        image: '/images/categories/bedroom.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'office' },
      update: {
        name: 'Office',
        nameAr: 'المكتب',
        image: '/images/categories/office.jpg',
      },
      create: {
        name: 'Office',
        nameAr: 'المكتب',
        slug: 'office',
        image: '/images/categories/office.jpg',
      },
    }),
  ]);

  const [dining, living, bedroom, office] = categories;
  console.log(`✅ ${categories.length} categories seeded/verified`);

  // ─── 4. Products (Realistic Production Pricing $150 - $3,200) ─────────────
  const productsData = [
    // Living
    {
      sku: 'SYL-001',
      name: 'Syltherine',
      nameAr: 'سيلثرين',
      slug: 'syltherine',
      subtitle: 'Stylish cafe chair',
      subtitleAr: 'كرسي مقهى أنيق',
      description:
        'A sophisticated cafe chair crafted from premium teak wood with a soft cushion seat. Perfect for living rooms and dining areas, combining elegance with comfort.',
      descriptionAr:
        'كرسي مقهى راقٍ مصنوع من خشب الساج المميز مع مقعد وسادة ناعم. مثالي لغرف المعيشة وغرف الطعام، يجمع بين الأناقة والراحة.',
      price: 250,
      originalPrice: 350,
      discountPercent: 30,
      isNew: false,
      stock: 15,
      images: ['/images/products/syltherine-1.jpg', '/images/products/syltherine-2.jpg'],
      sizes: ['Standard'],
      colors: ['Natural', 'Walnut'],
      tags: ['chair', 'living', 'wood', 'cafe'],
      rating: 4.7,
      reviewsCount: 128,
      categoryId: living.id,
    },
    {
      sku: 'LEV-002',
      name: 'Leviosa',
      nameAr: 'ليفيوزا',
      slug: 'leviosa',
      subtitle: 'Stylish cafe chair',
      subtitleAr: 'كرسي مقهى أنيق',
      description:
        'The Leviosa chair combines modern aesthetics with ergonomic design. Its sleek metal frame and plush upholstery make it a statement piece for any contemporary space.',
      descriptionAr:
        'تجمع كرسي ليفيوزا بين الجماليات الحديثة والتصميم المريح. إطارها المعدني الأنيق والمفرش المريح يجعلانها قطعة مميزة لأي مساحة معاصرة.',
      price: 280,
      originalPrice: null,
      discountPercent: null,
      isNew: false,
      stock: 20,
      images: ['/images/products/leviosa-1.jpg', '/images/products/leviosa-2.jpg'],
      sizes: ['Standard'],
      colors: ['Gray', 'Beige', 'Blue'],
      tags: ['chair', 'living', 'modern'],
      rating: 4.5,
      reviewsCount: 95,
      categoryId: living.id,
    },
    // Dining
    {
      sku: 'LOL-003',
      name: 'Lolito',
      nameAr: 'لوليتو',
      slug: 'lolito',
      subtitle: 'Luxury big sofa',
      subtitleAr: 'أريكة كبيرة فاخرة',
      description:
        'The Lolito sofa is a luxurious statement piece featuring high-quality fabric upholstery and solid wood legs. Its generous proportions ensure maximum comfort for the whole family.',
      descriptionAr:
        'أريكة لوليتو قطعة فاخرة مميزة تتميز بنسيج عالي الجودة وأرجل خشبية صلبة. أبعادها السخية تضمن أقصى قدر من الراحة لجميع أفراد الأسرة.',
      price: 1200,
      originalPrice: 2400,
      discountPercent: 50,
      isNew: false,
      stock: 8,
      images: ['/images/products/lolito-1.jpg', '/images/products/lolito-2.jpg'],
      sizes: ['3-Seater', '4-Seater'],
      colors: ['Cream', 'Dark Blue', 'Forest Green'],
      tags: ['sofa', 'living', 'luxury'],
      rating: 4.8,
      reviewsCount: 213,
      categoryId: dining.id,
    },
    {
      sku: 'RES-004',
      name: 'Respira',
      nameAr: 'ريسبيرا',
      slug: 'respira',
      subtitle: 'Minimal Outdoor Sofa',
      subtitleAr: 'أريكة خارجية بسيطة',
      description:
        'Respira is designed for outdoor living, crafted from weather-resistant rattan with quick-dry foam cushions. Its minimalist design seamlessly transitions from indoor to outdoor spaces.',
      descriptionAr:
        'صُممت ريسبيرا للمعيشة في الهواء الطلق، مصنوعة من الروطان المقاوم للطقس مع وسائد رغوة سريعة الجفاف. تصميمها البسيط ينتقل بسلاسة من المساحات الداخلية إلى الخارجية.',
      price: 500,
      originalPrice: null,
      discountPercent: null,
      isNew: true,
      stock: 25,
      images: ['/images/products/respira-1.jpg'],
      sizes: ['Standard'],
      colors: ['Natural', 'Black'],
      tags: ['outdoor', 'sofa', 'minimal', 'rattan'],
      rating: 4.6,
      reviewsCount: 67,
      categoryId: dining.id,
    },
    {
      sku: 'GRI-005',
      name: 'Grifo',
      nameAr: 'غريفو',
      slug: 'grifo',
      subtitle: 'Night lamp',
      subtitleAr: 'مصباح ليلي',
      description:
        'The Grifo night lamp features an artisanal ceramic base with a warm linen shade, casting a soft ambient glow perfect for bedrooms and reading nooks.',
      descriptionAr:
        'يتميز مصباح غريفو الليلي بقاعدة سيراميك حرفية وظل كتان دافئ، يضخ ضوءاً محيطياً ناعماً مثالياً لغرف النوم وزوايا القراءة.',
      price: 150,
      originalPrice: null,
      discountPercent: null,
      isNew: false,
      stock: 30,
      images: ['/images/products/grifo-1.jpg'],
      sizes: ['Standard'],
      colors: ['White', 'Beige'],
      tags: ['lamp', 'bedroom', 'lighting'],
      rating: 4.4,
      reviewsCount: 44,
      categoryId: bedroom.id,
    },
    {
      sku: 'MUG-006',
      name: 'Muggo',
      nameAr: 'موغو',
      slug: 'muggo',
      subtitle: 'Small mug',
      subtitleAr: 'كوب صغير',
      description:
        'The Muggo is a handcrafted ceramic mug with a distinctive organic shape. Each piece is unique, fired with food-safe glazes in earthy, natural tones.',
      descriptionAr:
        'موغو كوب سيراميك مصنوع يدوياً بشكل عضوي مميز. كل قطعة فريدة من نوعها، محروقة بزجاجيات آمنة للطعام بألوان ترابية طبيعية.',
      price: 160,
      originalPrice: null,
      discountPercent: null,
      isNew: false,
      stock: 50,
      images: ['/images/products/muggo-1.jpg'],
      sizes: ['250ml', '350ml'],
      colors: ['Sage', 'Terracotta', 'Slate'],
      tags: ['mug', 'ceramic', 'kitchen', 'handmade'],
      rating: 4.3,
      reviewsCount: 189,
      categoryId: dining.id,
    },
    {
      sku: 'PIN-007',
      name: 'Pingky',
      nameAr: 'بينكي',
      slug: 'pingky',
      subtitle: 'Cute bed set',
      subtitleAr: 'طقم سرير لطيف',
      description:
        'The Pingky bed set includes a duvet cover, two pillowcases, and a fitted sheet, all made from 100% organic cotton. Its playful yet elegant pattern brightens any bedroom.',
      descriptionAr:
        'يشمل طقم سرير بينكي غطاء لحاف وغطائَي وسادة وملاءة مطاطية، كلها مصنوعة من القطن العضوي 100%. نمطه المرح والأنيق يضفي البهجة على أي غرفة نوم.',
      price: 450,
      originalPrice: 900,
      discountPercent: 50,
      isNew: false,
      stock: 12,
      images: ['/images/products/pingky-1.jpg', '/images/products/pingky-2.jpg'],
      sizes: ['Single', 'Double', 'King'],
      colors: ['Pink', 'White', 'Lavender'],
      tags: ['bedding', 'bedroom', 'cotton', 'set'],
      rating: 4.9,
      reviewsCount: 302,
      categoryId: bedroom.id,
    },
    {
      sku: 'POT-008',
      name: 'Potty',
      nameAr: 'بوتي',
      slug: 'potty',
      subtitle: 'Minimalist flower pot',
      subtitleAr: 'أصيص زهور بسيط',
      description:
        'The Potty plant pot features a clean, minimalist design with a drainage hole and matching saucer. Available in matte finishes, it complements any interior style.',
      descriptionAr:
        'تتميز أصيصة نباتات بوتي بتصميم نظيف وبسيط مع فتحة تصريف وصحن مطابق. متوفرة بتشطيبات غير لامعة، تتكامل مع أي نمط داخلي.',
      price: 180,
      originalPrice: null,
      discountPercent: null,
      isNew: false,
      stock: 40,
      images: ['/images/products/potty-1.jpg'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White', 'Charcoal', 'Terracotta'],
      tags: ['plant', 'pot', 'minimalist', 'decor'],
      rating: 4.5,
      reviewsCount: 78,
      categoryId: living.id,
    },
    // Additional products
    {
      sku: 'ASG-009',
      name: 'Asgaard Sofa',
      nameAr: 'أريكة أسغارد',
      slug: 'asgaard-sofa',
      subtitle: 'Premium 3-seater sofa',
      subtitleAr: 'أريكة ثلاثية مقاعد فاخرة',
      description:
        'The Asgaard Sofa is a premium 3-seater crafted with kiln-dried hardwood frame and high-resilience foam cushions wrapped in top-grain leather. Built to last a lifetime.',
      descriptionAr:
        'أريكة أسغارد أريكة ثلاثية الجلوس الفاخرة، مصنوعة بإطار خشبي صلب مجفف بالفرن ووسائد رغوة عالية المرونة ملفوفة بالجلد الطبيعي. مبنية لتدوم مدى الحياة.',
      price: 2500,
      originalPrice: 2800,
      discountPercent: 11,
      isNew: false,
      stock: 5,
      images: ['/images/products/asgaard-1.jpg', '/images/products/asgaard-2.jpg'],
      sizes: ['3-Seater'],
      colors: ['Saddle Brown', 'Midnight Black', 'Ivory'],
      tags: ['sofa', 'leather', 'premium', 'living'],
      rating: 4.9,
      reviewsCount: 156,
      categoryId: living.id,
    },
    {
      sku: 'NDE-010',
      name: 'Nordic Desk',
      nameAr: 'مكتب نوردي',
      slug: 'nordic-desk',
      subtitle: 'Scandinavian home office desk',
      subtitleAr: 'مكتب إسكندنافي للمنزل',
      description:
        'The Nordic Desk brings Scandinavian simplicity to your home office. Solid ash wood top with hairpin steel legs. Features a built-in cable management channel.',
      descriptionAr:
        'يجلب مكتب نوردي البساطة الإسكندنافية لمكتبك المنزلي. سطح خشب الرماد الصلب مع أرجل فولاذية على شكل دبوس الشعر. يتميز بقناة مدمجة لإدارة الكابلات.',
      price: 650,
      originalPrice: null,
      discountPercent: null,
      isNew: true,
      stock: 18,
      images: ['/images/products/nordic-desk-1.jpg'],
      sizes: ['120cm', '140cm', '160cm'],
      colors: ['Natural Ash', 'Black Oak'],
      tags: ['desk', 'office', 'scandinavian', 'wood'],
      rating: 4.7,
      reviewsCount: 89,
      categoryId: office.id,
    },
    {
      sku: 'ERG-011',
      name: 'ErgoPro Chair',
      nameAr: 'كرسي إيرغو برو',
      slug: 'ergopro-chair',
      subtitle: 'Professional ergonomic chair',
      subtitleAr: 'كرسي مريح مهني',
      description:
        'The ErgoPro is a full-featured ergonomic office chair with adjustable lumbar support, 4D armrests, headrest, and seat depth adjustment. Certified for 8+ hours of daily use.',
      descriptionAr:
        'الإيرغو برو كرسي مكتب مريح متكامل الميزات مع دعم قطني قابل للتعديل وأذرع رباعية الأبعاد ومسند للرأس وضبط عمق المقعد. معتمد للاستخدام اليومي 8+ ساعات.',
      price: 800,
      originalPrice: 1000,
      discountPercent: 20,
      isNew: false,
      stock: 22,
      images: ['/images/products/ergopro-1.jpg', '/images/products/ergopro-2.jpg'],
      sizes: ['Standard'],
      colors: ['Black', 'Gray', 'White'],
      tags: ['chair', 'office', 'ergonomic', 'professional'],
      rating: 4.8,
      reviewsCount: 341,
      categoryId: office.id,
    },
    {
      sku: 'AUR-012',
      name: 'Aurelia Dining Table',
      nameAr: 'طاولة أوريليا للطعام',
      slug: 'aurelia-dining-table',
      subtitle: 'Elegant marble top dining table',
      subtitleAr: 'طاولة طعام أنيقة بسطح رخامي',
      description:
        'The Aurelia dining table features a genuine Italian Carrara marble top on a powder-coated steel base. Seats 6 comfortably, making it the centrepiece of any dining room.',
      descriptionAr:
        'طاولة أوريليا للطعام تتميز بسطح رخام كاررا إيطالي أصيل على قاعدة فولاذية مطلية بالبودرة. تتسع بشكل مريح لـ 6 أشخاص، مما يجعلها المحور الرئيسي لأي غرفة طعام.',
      price: 3200,
      originalPrice: null,
      discountPercent: null,
      isNew: true,
      stock: 4,
      images: ['/images/products/aurelia-1.jpg', '/images/products/aurelia-2.jpg'],
      sizes: ['180x90cm', '220x100cm'],
      colors: ['White Marble / Gold', 'White Marble / Black'],
      tags: ['table', 'dining', 'marble', 'luxury'],
      rating: 4.9,
      reviewsCount: 47,
      categoryId: dining.id,
    },
  ];

  let productCount = 0;
  for (const data of productsData) {
    await prisma.product.upsert({
      where: { sku: data.sku },
      update: {
        name: data.name,
        nameAr: data.nameAr,
        slug: data.slug,
        subtitle: data.subtitle,
        subtitleAr: data.subtitleAr,
        description: data.description,
        descriptionAr: data.descriptionAr,
        price: data.price,
        originalPrice: data.originalPrice,
        discountPercent: data.discountPercent,
        isNew: data.isNew,
        stock: data.stock,
        images: data.images,
        sizes: data.sizes,
        colors: data.colors,
        tags: data.tags,
        rating: data.rating,
        reviewsCount: data.reviewsCount,
        categoryId: data.categoryId,
      },
      create: data,
    });
    productCount++;
  }
  console.log(`✅ ${productCount} products seeded with updated realistic prices & reset stock`);

  // ─── 5. Blog Posts ────────────────────────────────────────────────────────
  const blogPosts = [
    {
      title: '7 Tips for a Minimal Space',
      titleAr: '7 نصائح لمساحة بسيطة',
      slug: '7-tips-for-minimal-space',
      excerpt:
        'Discover how to create a serene, clutter-free environment with thoughtful furniture choices and smart storage solutions.',
      excerptAr:
        'اكتشف كيف تخلق بيئة هادئة وخالية من الفوضى من خلال اختيارات الأثاث المدروسة وحلول التخزين الذكية.',
      content: `Creating a minimal space is about intention, not deprivation. Start by decluttering — keep only what you love and use. Choose furniture with clean lines and multiple functions: a storage ottoman, a sleek shelving unit, a neutral sofa. Limit your palette to 3 colors. Let natural light be your best decor element. Invest in quality over quantity — one perfect piece outshines five mediocre ones. Keep surfaces clear: a single vase, a stack of books, and nothing more. Finally, embrace empty space; it gives the eye somewhere to rest and the mind somewhere to breathe.`,
      contentAr: `إنشاء مساحة بسيطة يتعلق بالنية وليس الحرمان. ابدأ بإزالة الفوضى — احتفظ فقط بما تحب وتستخدمه. اختر أثاثاً بخطوط نظيفة ووظائف متعددة: أوتومان مع مساحة تخزين، وحدة رفوف أنيقة، أريكة بألوان محايدة. حدّد لوحة ألوانك بـ 3 ألوان. دع الضوء الطبيعي يكون أفضل عنصر ديكور لديك. استثمر في الجودة على حساب الكمية — قطعة واحدة مثالية تتفوق على خمس قطع متوسطة. أبقِ الأسطح نظيفة: مزهرية واحدة، كومة من الكتب، ولا شيء آخر. أخيراً، احتضن المساحة الفارغة؛ فهي تمنح العين مكاناً للراحة والعقل مكاناً للتنفس.`,
      image: '/images/blog/minimal-space.jpg',
      category: 'Design Tips',
      categoryAr: 'نصائح التصميم',
      author: 'Furniro Team',
    },
    {
      title: 'How to Choose the Right Sofa for Your Living Room',
      titleAr: 'كيف تختار الأريكة المناسبة لغرفة معيشتك',
      slug: 'how-to-choose-the-right-sofa',
      excerpt:
        'Size, fabric, style — choosing a sofa involves more decisions than you think. Here is our complete guide to finding your perfect match.',
      excerptAr:
        'الحجم والقماش والأسلوب — اختيار الأريكة ينطوي على قرارات أكثر مما تعتقد. إليك دليلنا الكامل للعثور على الخيار المثالي لك.',
      content: `Before falling in love with a sofa online, measure your living room. The rule of thumb: your sofa should not exceed two thirds of the room's width. Consider the room's traffic flow — there should be at least 90cm of walkway around it. Next, think about fabric: leather is durable and easy to clean; linen breathes but stains; velvet is luxurious but high-maintenance. Test the seat depth — 55-60cm is ideal for most adults. Check the frame: kiln-dried hardwood is best. Finally, consider your lifestyle: pets, children, and dinner parties all influence the right choice.`,
      contentAr: `قبل الوقوع في حب أريكة على الإنترنت، قِس غرفة معيشتك. القاعدة الأساسية: يجب ألا تتجاوز الأريكة ثلثَي عرض الغرفة. ضع في اعتبارك تدفق الحركة في الغرفة — يجب أن يكون هناك 90 سم على الأقل من الممر حولها. بعد ذلك، فكر في القماش: الجلد متين وسهل التنظيف؛ الكتان يتنفس لكنه يتلطخ؛ المخمل فاخر لكنه يحتاج عناية عالية. اختبر عمق المقعد — 55-60 سم مثالي لمعظم البالغين. تحقق من الإطار: الخشب الصلب المجفف بالفرن هو الأفضل. أخيراً، ضع في اعتبارك نمط حياتك: الحيوانات الأليفة والأطفال وحفلات العشاء كلها تؤثر في الاختيار الصحيح.`,
      image: '/images/blog/choose-sofa.jpg',
      category: 'Buying Guide',
      categoryAr: 'دليل الشراء',
      author: 'Furniro Team',
    },
    {
      title: 'The Scandinavian Design Trend: What You Need to Know',
      titleAr: 'اتجاه التصميم الإسكندنافي: ما تحتاج لمعرفته',
      slug: 'scandinavian-design-trend',
      excerpt:
        'Hygge, lagom, and clean lines — Scandinavian design is more than just a trend. It is a philosophy of living well with less.',
      excerptAr:
        'هوغه ولاغوم والخطوط النظيفة — التصميم الإسكندنافي أكثر من مجرد اتجاه. إنه فلسفة العيش بشكل جيد بأقل.',
      content: `Scandinavian design emerged in the 1950s from the Nordic countries as a response to the harsh climate and long winters — a need for warmth, light, and simplicity indoors. Its core principles: functionality first (every object must earn its place), natural materials (wood, wool, linen, stone), a neutral palette punctuated by one bold accent, and abundant natural light amplified by pale walls and strategic mirrors. The Danish concept of hygge (coziness, comfort, wellbeing) is embedded in every piece: furniture should feel welcoming, not formal. Shop for Scandinavian design by looking for clean silhouettes, exposed wood grain, and pieces that feel both timeless and effortless.`,
      contentAr: `ظهر التصميم الإسكندنافي في الخمسينيات من دول الشمال الأوروبي كاستجابة للمناخ القاسي والشتاء الطويل — حاجة للدفء والضوء والبساطة في الداخل. مبادئه الأساسية: الوظيفية أولاً (كل شيء يجب أن يستحق مكانه)، والمواد الطبيعية (الخشب والصوف والكتان والحجر)، ولوحة ألوان محايدة تتخللها لمسة واحدة جريئة، وضوء طبيعي وافر معزز بجدران شاحبة ومرايا استراتيجية. مفهوم الهوغه الدنماركي (الدفء والراحة والرفاهية) متجذر في كل قطعة: يجب أن يبدو الأثاث مرحباً وليس رسمياً. تسوق للحصول على التصميم الإسكندنافي بالبحث عن صور نظيفة وحبوب خشب مكشوفة وقطع تبدو خالدة وسلسة في آن واحد.`,
      image: '/images/blog/scandinavian-design.jpg',
      category: 'Interior Design',
      categoryAr: 'التصميم الداخلي',
      author: 'Furniro Team',
    },
  ];

  let blogCount = 0;
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        titleAr: post.titleAr,
        excerpt: post.excerpt,
        excerptAr: post.excerptAr,
        content: post.content,
        contentAr: post.contentAr,
        image: post.image,
        category: post.category,
        categoryAr: post.categoryAr,
        author: post.author,
      },
      create: post,
    });
    blogCount++;
  }
  console.log(`✅ ${blogCount} blog posts verified/updated`);

  await prisma.$disconnect();
  await pool.end();
  console.log('🎉 Production seed & cleanup completed successfully!');
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
