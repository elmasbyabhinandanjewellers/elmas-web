import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import Razorpay from 'razorpay';
import crypto from 'crypto';

let cachedClient = null;
let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;
  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  cachedClient = client;
  cachedDb = client.db(process.env.DB_NAME || 'elmas_db');
  return cachedDb;
}

const JWT_SECRET = process.env.JWT_SECRET || 'elmas_secret_2025';
function generateToken(userId) { return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' }); }
function verifyToken(token) { try { return jwt.verify(token, JWT_SECRET); } catch { return null; } }
function getToken(req) { const a = req.headers.get('authorization'); return a?.startsWith('Bearer ') ? a.slice(7) : null; }
async function getUser(req, db) {
  const token = getToken(req);
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;
  return db.collection('users').findOne({ _id: decoded.userId });
}

let razorpayInstance;
function getRazorpay() {
  if (!razorpayInstance) razorpayInstance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  return razorpayInstance;
}

const PI = (p, n) => `https://images.pexels.com/photos/${p}/pexels-photo-${p}.jpeg?auto=compress&cs=tinysrgb&w=${n||800}`;
const UI = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w||800}&q=80`;

const SEED_PRODUCTS = [
  { _id:'prod-001', name:'Ethereal Emerald Solitaire', slug:'ethereal-emerald-solitaire', shortDescription:'18K Yellow Gold with Natural Zambian Emerald', description:'A masterpiece of precision and heritage, this solitaire ring features a 2.45ct Natural Zambian Emerald set in 18K Polished Yellow Gold. Handcrafted in our Jaipur atelier over 120 hours by master jewelers. Each facet is mathematically perfected to catch the light in every setting.', price:485000, originalPrice:550000, category:'rings', collection:'heritage', metalType:'18k-gold', primaryStone:'Natural Zambian Emerald', caratWeight:'2.45 Carats', accentStones:'12 Round Brilliant Diamonds (F/VS+)', images:[PI('29495765'), UI('1613945407943-59cd755fd69e')], rating:4.8, reviewCount:12, inStock:true, featured:true, isNewArrival:false, tags:['emerald','solitaire','heritage','18k-gold'], specifications:{metal:'18K Polished Yellow Gold',primaryStone:'Natural Zambian Emerald',caratWeight:'2.45 Carats',accentStones:'12 Round Brilliant Diamonds (F/VS+)',setting:'Prong Setting',certification:'GIA Certified'}, reviews:[{id:'r1',userName:'Priya Sharma',rating:5,comment:'Absolutely breathtaking. The emerald is vivid and the craftsmanship is unmatched.',date:'2025-02-15'},{id:'r2',userName:'Anita Reddy',rating:5,comment:'Worth every penny. A truly extraordinary piece.',date:'2025-01-20'}], createdAt:new Date('2024-01-15') },
  { _id:'prod-002', name:'Royal Emerald Pendant', slug:'royal-emerald-pendant', shortDescription:'Emerald pendant in 18K gold with diamond halo', description:'A regal emerald pendant featuring a 1.8ct vivid green Colombian emerald encircled by a halo of round brilliant diamonds. Set in 18K yellow gold with a delicate box chain. The perfect heirloom piece.', price:335000, originalPrice:380000, category:'necklaces', collection:'heritage', metalType:'18k-gold', primaryStone:'Colombian Emerald', caratWeight:'1.8 Carats', accentStones:'24 Round Brilliant Diamonds (E/VS1)', images:[UI('1773612968627-d1dd72e9d8be'), PI('21235148')], rating:4.9, reviewCount:8, inStock:true, featured:true, isNewArrival:true, tags:['emerald','pendant','heritage','necklace'], specifications:{metal:'18K Yellow Gold',primaryStone:'Colombian Emerald',caratWeight:'1.8 Carats',chainLength:'18 inches adjustable',certification:'GIA Certified'}, reviews:[{id:'r3',userName:'Meena Kapoor',rating:5,comment:'The emerald glows with such depth. Received so many compliments.',date:'2025-03-10'}], createdAt:new Date('2024-02-20') },
  { _id:'prod-003', name:'Celestial Solitaire Ring', slug:'celestial-solitaire-ring', shortDescription:'Platinum ring with round brilliant diamond', description:'A celestial solitaire featuring a 1.5ct round brilliant diamond of exceptional F/VS1 clarity, set in polished platinum. The six-prong setting elevates the stone to catch every ray of light.', price:215000, originalPrice:215000, category:'rings', collection:'high-jewelry', metalType:'platinum', primaryStone:'Round Brilliant Diamond', caratWeight:'1.5 Carats', accentStones:'None', images:[UI('1613945407943-59cd755fd69e'), PI('29495765')], rating:4.7, reviewCount:15, inStock:true, featured:true, isNewArrival:false, tags:['diamond','solitaire','platinum','high-jewelry'], specifications:{metal:'Platinum 950',primaryStone:'Round Brilliant Diamond',caratWeight:'1.5 Carats',clarity:'F/VS1',cut:'Excellent',certification:'GIA Certified'}, reviews:[{id:'r4',userName:'Shruti Patel',rating:5,comment:'The diamond is spectacular. Perfect for an engagement ring.',date:'2025-01-05'}], createdAt:new Date('2024-03-10') },
  { _id:'prod-004', name:'Verdant Muse Necklace', slug:'verdant-muse-necklace', shortDescription:'Statement emerald & diamond necklace in white gold', description:'An arresting statement necklace featuring 7 graduated Colombian emeralds totaling 8.4cts, accented by 112 round brilliant diamonds in 18K white gold. A piece that commands attention and whispers of royalty.', price:890000, originalPrice:1050000, category:'necklaces', collection:'high-jewelry', metalType:'18k-gold', primaryStone:'Colombian Emeralds', caratWeight:'8.4 Carats total', accentStones:'112 Diamonds (F/VS)', images:[UI('1769857879388-df93b4c96bca'), PI('32988539')], rating:5.0, reviewCount:4, inStock:true, featured:true, isNewArrival:true, tags:['emerald','diamond','necklace','high-jewelry','statement'], specifications:{metal:'18K White Gold',primaryStone:'7 Colombian Emeralds',caratWeight:'8.4ct total',accentStones:'112 Diamonds',certification:'GIA Certified'}, reviews:[{id:'r5',userName:'Ranjana Singh',rating:5,comment:'This is the most beautiful piece of jewelry I have ever seen.',date:'2025-04-01'}], createdAt:new Date('2024-04-05') },
  { _id:'prod-005', name:'Floral Diamond Studs', slug:'floral-diamond-studs', shortDescription:'Floral cluster diamond earrings in 18K gold', description:'Delicate floral diamond stud earrings featuring a central round brilliant diamond surrounded by 6 petal diamonds, all set in 18K yellow gold. The perfect everyday luxury.', price:98500, originalPrice:115000, category:'earrings', collection:'heritage', metalType:'18k-gold', primaryStone:'Round Brilliant Diamonds', caratWeight:'0.8 Carats total', accentStones:'12 Petal Diamonds', images:[UI('1605100804567-1ffe942b5cd6'), UI('1589674668791-4889d2bba4c6')], rating:4.6, reviewCount:23, inStock:true, featured:false, isNewArrival:false, tags:['diamond','earrings','studs','heritage','floral'], specifications:{metal:'18K Yellow Gold',primaryStone:'Round Brilliant Diamond',caratWeight:'0.8ct total',setting:'Bezel Set Petals',backType:'Butterfly Push Back'}, reviews:[], createdAt:new Date('2024-05-10') },
  { _id:'prod-006', name:'Filigree Ruby Cuff', slug:'filigree-ruby-cuff', shortDescription:'Intricate filigree bracelet with Burmese rubies', description:'An extraordinary filigree cuff bracelet featuring 12 oval Burmese rubies totaling 3.2cts set in 22K gold filigree. Each wire is hand-twisted by our master craftsmen in a technique passed through five generations.', price:211000, originalPrice:250000, category:'bracelets', collection:'heritage', metalType:'22k-gold', primaryStone:'Burmese Rubies', caratWeight:'3.2 Carats', accentStones:'None', images:[PI('32610505'), UI('1650455221359-3aebf920bcc5')], rating:4.8, reviewCount:6, inStock:true, featured:false, isNewArrival:true, tags:['ruby','bracelet','filigree','heritage','22k-gold'], specifications:{metal:'22K Yellow Gold',primaryStone:'Burmese Rubies',caratWeight:'3.2ct total',width:'18mm',technique:'Traditional Filigree'}, reviews:[], createdAt:new Date('2024-06-15') },
  { _id:'prod-007', name:'Geometric Halo Ring', slug:'geometric-halo-ring', shortDescription:'Modern geometric diamond halo ring in platinum', description:'A contemporary masterpiece featuring an octagonal diamond surrounded by a halo of 32 brilliant-cut diamonds. The geometric design offers a modern perspective on the classic halo.', price:172900, originalPrice:195000, category:'rings', collection:'collections', metalType:'platinum', primaryStone:'Princess Cut Diamond', caratWeight:'1.2 Carats', accentStones:'32 Round Brilliant Diamonds', images:[UI('1589674668791-4889d2bba4c6'), UI('1613945407943-59cd755fd69e')], rating:4.5, reviewCount:11, inStock:true, featured:true, isNewArrival:false, tags:['diamond','ring','geometric','halo','platinum'], specifications:{metal:'Platinum 950',primaryStone:'Princess Cut Diamond',caratWeight:'1.2ct',accentStones:'32 Brilliant Cut Diamonds',style:'Geometric Halo'}, reviews:[], createdAt:new Date('2024-07-01') },
  { _id:'prod-008', name:'Eternal Solitaire Ring', slug:'eternal-solitaire-ring', shortDescription:'Classic round brilliant solitaire in 18K rose gold', description:'Timeless elegance in a classic 4-prong solitaire setting. A 2.1ct round brilliant diamond (G/VS2) rests in a delicate 18K rose gold band, capturing light from every angle.', price:425000, originalPrice:425000, category:'rings', collection:'heritage', metalType:'rose-gold', primaryStone:'Round Brilliant Diamond', caratWeight:'2.1 Carats', accentStones:'None', images:[PI('29495765'), UI('1613945407943-59cd755fd69e')], rating:4.9, reviewCount:18, inStock:true, featured:true, isNewArrival:false, tags:['diamond','solitaire','rose-gold','heritage'], specifications:{metal:'18K Rose Gold',primaryStone:'Round Brilliant Diamond',caratWeight:'2.1ct',clarity:'G/VS2',cut:'Ideal Cut',certification:'GIA Certified'}, reviews:[], createdAt:new Date('2024-08-20') },
  { _id:'prod-009', name:'Aura Stacked Bangles', slug:'aura-stacked-bangles', shortDescription:'Set of 3 diamond-studded gold bangles', description:'A set of three stackable 18K gold bangles, each pavé-set with round brilliant diamonds. Wear them together for maximum impact or individually for understated elegance.', price:210000, originalPrice:245000, category:'bracelets', collection:'daily-elegance', metalType:'18k-gold', primaryStone:'Round Brilliant Diamonds', caratWeight:'0.9 Carats total', accentStones:'Pavé Set', images:[UI('1650455221359-3aebf920bcc5'), UI('1704957205218-d436eac4c607')], rating:4.7, reviewCount:31, inStock:true, featured:false, isNewArrival:false, tags:['diamond','bangles','stackable','daily-elegance','18k-gold'], specifications:{metal:'18K Yellow Gold',diamond:'Round Brilliant',caratWeight:'0.9ct total',pieces:'Set of 3',style:'Stackable'}, reviews:[], createdAt:new Date('2024-09-05') },
  { _id:'prod-010', name:'Celestial Cascade Drops', slug:'celestial-cascade-drops', shortDescription:'Long diamond cascade earrings in white gold', description:'Dramatic cascade earrings featuring graduated rows of brilliant-cut diamonds totaling 4.2cts, set in 18K white gold. These earrings catch the light with every movement.', price:1240000, originalPrice:1400000, category:'earrings', collection:'high-jewelry', metalType:'18k-gold', primaryStone:'Brilliant Cut Diamonds', caratWeight:'4.2 Carats', accentStones:'None', images:[UI('1650455221359-3aebf920bcc5'), UI('1605100804567-1ffe942b5cd6')], rating:5.0, reviewCount:3, inStock:true, featured:true, isNewArrival:true, tags:['diamond','earrings','cascade','high-jewelry','white-gold'], specifications:{metal:'18K White Gold',primaryStone:'Brilliant Cut Diamonds',caratWeight:'4.2ct',length:'65mm',certification:'GIA Certified'}, reviews:[], createdAt:new Date('2024-10-01') },
  { _id:'prod-011', name:'Silk Weave Bracelet', slug:'silk-weave-bracelet', shortDescription:'Woven gold bracelet with diamond accents', description:'A stunning woven gold bracelet in 18K yellow gold, punctuated by 24 brilliant-cut diamond pavé stations. The woven pattern creates a silky texture that catches the eye.', price:185000, originalPrice:210000, category:'bracelets', collection:'daily-elegance', metalType:'18k-gold', primaryStone:'Round Brilliant Diamonds', caratWeight:'0.5 Carats', accentStones:'Pavé Stations', images:[UI('1704957205218-d436eac4c607'), UI('1650455221359-3aebf920bcc5')], rating:4.6, reviewCount:14, inStock:true, featured:false, isNewArrival:false, tags:['diamond','bracelet','woven','daily-elegance','18k-gold'], specifications:{metal:'18K Yellow Gold',diamonds:'24 Brilliant Cut',caratWeight:'0.5ct total',width:'6mm',clasp:'Box Clasp with Safety'}, reviews:[], createdAt:new Date('2024-10-15') },
  { _id:'prod-012', name:'Regal Ruby Signet', slug:'regal-ruby-signet', shortDescription:'Oval ruby signet ring in 22K gold', description:'A powerful signet ring centered on a 4.5ct oval Burmese ruby of pigeon blood red, framed by a hand-engraved 22K gold setting with geometric detailing on the shoulders.', price:670000, originalPrice:750000, category:'rings', collection:'heritage', metalType:'22k-gold', primaryStone:'Burmese Ruby', caratWeight:'4.5 Carats', accentStones:'Hand-Engraved Gold Border', images:[PI('32610505'), PI('29495765')], rating:4.8, reviewCount:7, inStock:true, featured:false, isNewArrival:false, tags:['ruby','signet','ring','heritage','22k-gold'], specifications:{metal:'22K Yellow Gold',primaryStone:'Burmese Ruby',clarity:'Pigeon Blood Red',caratWeight:'4.5ct',setting:'Bezel with Engraved Border'}, reviews:[], createdAt:new Date('2024-11-10') },
  { _id:'prod-013', name:'Sapphire Rain Drop', slug:'sapphire-rain-drop', shortDescription:'Teardrop sapphire pendant in 18K white gold', description:'A stunning teardrop pendant featuring a 3.2ct Ceylon sapphire of vivid cornflower blue, suspended from a diamond bail in 18K white gold. Includes a 16-inch diamond-accented chain.', price:420000, originalPrice:480000, category:'necklaces', collection:'high-jewelry', metalType:'18k-gold', primaryStone:'Ceylon Sapphire', caratWeight:'3.2 Carats', accentStones:'Diamond Bail', images:[UI('1605100804567-1ffe942b5cd6'), UI('1773612968627-d1dd72e9d8be')], rating:4.9, reviewCount:9, inStock:true, featured:true, isNewArrival:true, tags:['sapphire','pendant','necklace','high-jewelry','white-gold'], specifications:{metal:'18K White Gold',primaryStone:'Ceylon Sapphire',caratWeight:'3.2ct',color:'Cornflower Blue',certification:'GIA Certified'}, reviews:[], createdAt:new Date('2024-11-20') },
  { _id:'prod-014', name:'Victoria Chandelier', slug:'victoria-chandelier', shortDescription:'Tiered diamond chandelier earrings in white gold', description:'Magnificent chandelier earrings inspired by Victorian architecture, featuring three tiers of brilliant-cut diamonds in 18K white gold. A statement for the most special occasions.', price:890000, originalPrice:1000000, category:'earrings', collection:'heritage', metalType:'18k-gold', primaryStone:'Brilliant Diamonds', caratWeight:'3.6 Carats', accentStones:'Victorian Filigree Frame', images:[UI('1595345705177-ffe090eb0784'), UI('1605100804567-1ffe942b5cd6')], rating:5.0, reviewCount:5, inStock:true, featured:false, isNewArrival:false, tags:['diamond','chandelier','earrings','heritage','high-jewelry'], specifications:{metal:'18K White Gold',primaryStone:'Brilliant Cut Diamonds',caratWeight:'3.6ct',length:'70mm',style:'Victorian Chandelier'}, reviews:[], createdAt:new Date('2024-12-01') },
  { _id:'prod-015', name:'Infinite Bloom Bangle', slug:'infinite-bloom-bangle', shortDescription:'Floral diamond bangle in 18K yellow gold', description:'An enchanting rigid bangle featuring a continuous bloom motif in brilliant-cut diamonds and 18K yellow gold. The infinite pattern symbolizes eternal beauty and growth.', price:1560000, originalPrice:1750000, category:'bracelets', collection:'high-jewelry', metalType:'18k-gold', primaryStone:'Brilliant Diamonds', caratWeight:'6.5 Carats', accentStones:'Floral Gold Work', images:[UI('1704957205218-d436eac4c607'), PI('32610505')], rating:4.9, reviewCount:2, inStock:true, featured:true, isNewArrival:false, tags:['diamond','bangle','high-jewelry','18k-gold','floral'], specifications:{metal:'18K Yellow Gold',primaryStone:'Brilliant Diamonds',caratWeight:'6.5ct',width:'12mm',style:'Rigid Floral Bangle'}, reviews:[], createdAt:new Date('2024-12-10') },
  { _id:'prod-016', name:'Solstice Cuff', slug:'solstice-cuff', shortDescription:'Wide diamond cuff bracelet in platinum', description:'A bold statement cuff in polished platinum featuring 5.2cts of channel-set brilliant diamonds across a dramatic 20mm width. Modern, powerful, and unforgettable.', price:675000, originalPrice:750000, category:'bracelets', collection:'high-jewelry', metalType:'platinum', primaryStone:'Brilliant Diamonds', caratWeight:'5.2 Carats', accentStones:'Channel Set', images:[UI('1650455221359-3aebf920bcc5'), UI('1704957205218-d436eac4c607')], rating:4.8, reviewCount:4, inStock:true, featured:false, isNewArrival:true, tags:['diamond','cuff','bracelet','platinum','high-jewelry'], specifications:{metal:'Platinum 950',primaryStone:'Brilliant Cut Diamonds',caratWeight:'5.2ct',width:'20mm',setting:'Channel Set'}, reviews:[], createdAt:new Date('2024-12-20') },
  { _id:'prod-017', name:'Pearl Strand Classic', slug:'pearl-strand-classic', shortDescription:'South Sea pearl strand with 18K gold clasp', description:'A classic strand of 22 hand-matched South Sea pearls (12-15mm), each of exceptional luster, with a diamond-set 18K yellow gold clasp. The quintessential luxury accessory.', price:125000, originalPrice:145000, category:'necklaces', collection:'daily-elegance', metalType:'18k-gold', primaryStone:'South Sea Pearls', caratWeight:'22 Pearls (12-15mm)', accentStones:'Diamond Clasp', images:[UI('1654699991520-aaaf4dd2608b'), UI('1595345705177-ffe090eb0784')], rating:4.7, reviewCount:19, inStock:true, featured:false, isNewArrival:false, tags:['pearl','necklace','daily-elegance','18k-gold','classic'], specifications:{metal:'18K Yellow Gold Clasp',pearls:'South Sea (12-15mm)',count:'22 Pearls',luster:'Very High',length:'18 inches'}, reviews:[], createdAt:new Date('2024-09-15') },
  { _id:'prod-018', name:'Diamond Tennis Bracelet', slug:'diamond-tennis-bracelet', shortDescription:'Classic diamond tennis bracelet in 18K white gold', description:'An iconic diamond tennis bracelet featuring 45 brilliant-cut diamonds of matching G/VS quality, totaling 7.8cts, individually set in 18K white gold. The definition of timeless luxury.', price:1850000, originalPrice:2100000, category:'bracelets', collection:'high-jewelry', metalType:'18k-gold', primaryStone:'Brilliant Diamonds', caratWeight:'7.8 Carats', accentStones:'None', images:[UI('1589674668791-4889d2bba4c6'), UI('1704957205218-d436eac4c607')], rating:5.0, reviewCount:6, inStock:true, featured:true, isNewArrival:false, tags:['diamond','tennis-bracelet','high-jewelry','18k-gold','classic'], specifications:{metal:'18K White Gold',primaryStone:'Brilliant Cut Diamonds',caratWeight:'7.8ct total',diamonds:'45 matched stones',quality:'G/VS',certification:'GIA Certified'}, reviews:[], createdAt:new Date('2024-08-01') },
  { _id:'prod-019', name:'Rose Gold Halo Ring', slug:'rose-gold-halo-ring', shortDescription:'Oval diamond halo ring in 18K rose gold', description:'A romantic oval diamond halo ring in 18K rose gold. The 0.9ct oval diamond is encircled by a delicate halo of 26 pavé diamonds, creating a stunning play of light.', price:95000, originalPrice:110000, category:'rings', collection:'daily-elegance', metalType:'rose-gold', primaryStone:'Oval Diamond', caratWeight:'0.9 Carats', accentStones:'26 Pavé Diamonds', images:[UI('1613945407943-59cd755fd69e'), PI('29495765')], rating:4.5, reviewCount:28, inStock:true, featured:false, isNewArrival:true, tags:['diamond','ring','halo','rose-gold','daily-elegance'], specifications:{metal:'18K Rose Gold',primaryStone:'Oval Diamond',caratWeight:'0.9ct',accentStones:'26 Pavé Diamonds',style:'Halo'}, reviews:[], createdAt:new Date('2025-01-10') },
  { _id:'prod-020', name:'Kundan Bridal Heritage Set', slug:'kundan-bridal-heritage-set', shortDescription:'Traditional Kundan necklace set with matching earrings', description:'A magnificent Kundan necklace set in 22K gold with 24 polki diamonds and vibrant enamel work on the reverse (meenakari). Includes matching chandelier earrings. A timeless bridal heirloom.', price:550000, originalPrice:620000, category:'necklaces', collection:'bridal', metalType:'22k-gold', primaryStone:'Polki Diamonds', caratWeight:'12 Carats total', accentStones:'Meenakari Enamel Work', images:[PI('34479808'), UI('1727784892059-c85b4d9f763c')], rating:4.9, reviewCount:14, inStock:true, featured:true, isNewArrival:false, tags:['kundan','bridal','heritage','22k-gold','polki','set'], specifications:{metal:'22K Yellow Gold',technique:'Kundan Setting',primaryStone:'Polki Diamonds',reverse:'Meenakari Enamel',includes:'Necklace + Earrings'}, reviews:[], createdAt:new Date('2024-03-25') }
];

const SEED_COUPONS = [
  { _id:'coup-001', code:'ELMAS10', discountType:'percentage', discountValue:10, minOrderValue:50000, maxDiscount:50000, active:true, description:'Heritage Discount — 10% off on orders above ₹50,000', usageLimit:100, usedCount:5 },
  { _id:'coup-002', code:'FIRSTELMAS', discountType:'percentage', discountValue:15, minOrderValue:0, maxDiscount:25000, active:true, description:'Welcome Gift — 15% off on your first purchase (max ₹25,000)', usageLimit:1000, usedCount:245 },
  { _id:'coup-003', code:'HERITAGE20', discountType:'percentage', discountValue:20, minOrderValue:200000, maxDiscount:100000, active:true, description:'Heritage Prestige — 20% off on orders above ₹2,00,000', usageLimit:50, usedCount:12 },
  { _id:'coup-004', code:'GOLDFEST', discountType:'fixed', discountValue:5000, minOrderValue:50000, maxDiscount:5000, active:true, description:'Gold Festival — Flat ₹5,000 off on orders above ₹50,000', usageLimit:200, usedCount:89 }
];

export async function GET(request, { params }) {
  try {
    const db = await connectDB();
    const path = params.path || [];
    const ps = path.join('/');
    const sp = new URL(request.url).searchParams;

    if (ps === 'health') return NextResponse.json({ status: 'ok' });

    if (ps === 'products') {
      let filter = {};
      const category = sp.get('category'), collection = sp.get('collection'), metalType = sp.get('metalType'), featured = sp.get('featured'), minPrice = sp.get('minPrice'), maxPrice = sp.get('maxPrice'), search = sp.get('search');
      if (category) filter.category = category;
      if (collection) filter.collection = collection;
      if (metalType) filter.metalType = metalType;
      if (featured === 'true') filter.featured = true;
      if (minPrice || maxPrice) { filter.price = {}; if (minPrice) filter.price.$gte = parseInt(minPrice); if (maxPrice) filter.price.$lte = parseInt(maxPrice); }
      if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
      const sort = sp.get('sort') || 'newest';
      const sortOpt = sort === 'price-low' ? { price: 1 } : sort === 'price-high' ? { price: -1 } : sort === 'popular' ? { reviewCount: -1 } : { createdAt: -1 };
      const products = await db.collection('products').find(filter).sort(sortOpt).toArray();
      return NextResponse.json(products);
    }

    if (ps.startsWith('products/') && ps !== 'products/seed') {
      const slug = ps.replace('products/', '');
      const product = await db.collection('products').findOne({ slug });
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      return NextResponse.json(product);
    }

    if (ps === 'cart') {
      const user = await getUser(request, db);
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const cart = await db.collection('carts').findOne({ userId: user._id });
      if (!cart) return NextResponse.json({ items: [], total: 0 });
      const items = await Promise.all((cart.items || []).map(async (item) => {
        const product = await db.collection('products').findOne({ _id: item.productId });
        return { ...item, product };
      }));
      const filteredItems = items.filter(i => i.product);
      const total = filteredItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
      return NextResponse.json({ items: filteredItems, total });
    }

    if (ps === 'wishlist') {
      const user = await getUser(request, db);
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const wishlist = await db.collection('wishlists').findOne({ userId: user._id });
      if (!wishlist) return NextResponse.json([]);
      const products = await Promise.all((wishlist.productIds || []).map(id => db.collection('products').findOne({ _id: id })));
      return NextResponse.json(products.filter(Boolean));
    }

    if (ps === 'orders') {
      const user = await getUser(request, db);
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const orders = await db.collection('orders').find({ userId: user._id }).sort({ createdAt: -1 }).toArray();
      return NextResponse.json(orders);
    }

    if (ps.startsWith('orders/')) {
      const orderId = ps.replace('orders/', '');
      const user = await getUser(request, db);
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const order = await db.collection('orders').findOne({ _id: orderId, userId: user._id });
      if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      return NextResponse.json(order);
    }

    if (ps === 'coupons/validate') {
      const code = sp.get('code'), amount = parseInt(sp.get('amount') || '0');
      if (!code) return NextResponse.json({ valid: false, error: 'Code required' });
      const coupon = await db.collection('coupons').findOne({ code: code.toUpperCase(), active: true });
      if (!coupon) return NextResponse.json({ valid: false, error: 'Invalid coupon code' });
      if (coupon.minOrderValue > amount) return NextResponse.json({ valid: false, error: `Minimum order ₹${coupon.minOrderValue.toLocaleString('en-IN')} required` });
      let discount = coupon.discountType === 'percentage' ? Math.min((amount * coupon.discountValue) / 100, coupon.maxDiscount || Infinity) : coupon.discountValue;
      return NextResponse.json({ valid: true, discount: Math.round(discount), coupon });
    }

    if (ps === 'user/profile') {
      const user = await getUser(request, db);
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const { password: _, ...u } = user;
      return NextResponse.json(u);
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (e) {
    console.error('GET Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const db = await connectDB();
    const path = params.path || [];
    const ps = path.join('/');
    let body = {};
    try { body = await request.json(); } catch {}

    if (ps === 'auth/register') {
      const { name, email, password, phone } = body;
      if (!name || !email || !password) return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 });
      const exists = await db.collection('users').findOne({ email: email.toLowerCase() });
      if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      const hashed = await bcrypt.hash(password, 12);
      const uid = uuidv4();
      const user = { _id: uid, name, email: email.toLowerCase(), password: hashed, phone: phone || '', createdAt: new Date() };
      await db.collection('users').insertOne(user);
      const token = generateToken(uid);
      const { password: _, ...u } = user;
      return NextResponse.json({ message: 'Account created', user: u, token }, { status: 201 });
    }

    if (ps === 'auth/login') {
      const { email, password } = body;
      if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
      const user = await db.collection('users').findOne({ email: email.toLowerCase() });
      if (!user || !(await bcrypt.compare(password, user.password))) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      const token = generateToken(user._id);
      const { password: _, ...u } = user;
      return NextResponse.json({ message: 'Login successful', user: u, token });
    }

    if (ps === 'products/seed') {
      const count = await db.collection('products').countDocuments();
      if (count > 0) return NextResponse.json({ message: 'Already seeded', count });
      await db.collection('products').insertMany(SEED_PRODUCTS);
      const cc = await db.collection('coupons').countDocuments();
      if (cc === 0) await db.collection('coupons').insertMany(SEED_COUPONS);
      await db.collection('products').createIndex({ slug: 1 });
      await db.collection('products').createIndex({ category: 1 });
      await db.collection('products').createIndex({ collection: 1 });
      
      // Seed test user if doesn't exist
      const testUserEmail = 'priya@elmas.com';
      const userExists = await db.collection('users').findOne({ email: testUserEmail });
      if (!userExists) {
        const hashedPassword = await bcrypt.hash('elmas123', 12);
        const testUserId = uuidv4();
        await db.collection('users').insertOne({
          _id: testUserId,
          name: 'Priya Sharma',
          email: testUserEmail,
          password: hashedPassword,
          phone: '+91 98765 43210',
          createdAt: new Date()
        });
      }
      
      return NextResponse.json({ message: 'Seeded successfully', products: SEED_PRODUCTS.length, coupons: SEED_COUPONS.length });
    }

    if (ps === 'cart') {
      const user = await getUser(request, db);
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const { productId, quantity = 1 } = body;
      const product = await db.collection('products').findOne({ _id: productId });
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      const cart = await db.collection('carts').findOne({ userId: user._id });
      if (cart) {
        const existing = cart.items?.find(i => i.productId === productId);
        if (existing) await db.collection('carts').updateOne({ userId: user._id, 'items.productId': productId }, { $set: { 'items.$.quantity': existing.quantity + quantity } });
        else await db.collection('carts').updateOne({ userId: user._id }, { $push: { items: { productId, quantity } } });
      } else {
        await db.collection('carts').insertOne({ _id: uuidv4(), userId: user._id, items: [{ productId, quantity }] });
      }
      const updated = await db.collection('carts').findOne({ userId: user._id });
      return NextResponse.json({ message: 'Added to cart', cartCount: updated?.items?.length || 0 });
    }

    if (ps === 'wishlist') {
      const user = await getUser(request, db);
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const { productId } = body;
      const wl = await db.collection('wishlists').findOne({ userId: user._id });
      if (wl) {
        const inWl = wl.productIds?.includes(productId);
        await db.collection('wishlists').updateOne({ userId: user._id }, inWl ? { $pull: { productIds: productId } } : { $push: { productIds: productId } });
        const updated = await db.collection('wishlists').findOne({ userId: user._id });
        return NextResponse.json({ message: inWl ? 'Removed from wishlist' : 'Added to wishlist', inWishlist: !inWl, wishlistCount: updated?.productIds?.length || 0 });
      } else {
        await db.collection('wishlists').insertOne({ _id: uuidv4(), userId: user._id, productIds: [productId] });
        return NextResponse.json({ message: 'Added to wishlist', inWishlist: true, wishlistCount: 1 });
      }
    }

    if (ps === 'payment/create-order') {
      const user = await getUser(request, db);
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const { amount, items, couponCode, shippingAddress, discount } = body;
      
      // Razorpay test mode has a limit of ₹5,000 (5,00,000 paise)
      // In test mode, cap the amount to avoid errors
      const isTestMode = process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test');
      const maxTestAmount = 5000; // ₹5,000
      const actualAmount = amount;
      const paymentAmount = isTestMode && amount > maxTestAmount ? maxTestAmount : amount;
      
      try {
        const rzp = getRazorpay();
        const rzpOrder = await rzp.orders.create({ 
          amount: Math.round(paymentAmount * 100), 
          currency: 'INR', 
          receipt: `rcpt_${Date.now()}`.slice(0, 40),
          notes: {
            actual_amount: actualAmount,
            test_mode: isTestMode ? 'true' : 'false'
          }
        });
        const orderId = uuidv4();
        await db.collection('orders').insertOne({ 
          _id: orderId, 
          userId: user._id, 
          items, 
          total: actualAmount, 
          paymentAmount: paymentAmount,
          discount: discount || 0, 
          couponCode: couponCode || null, 
          shippingAddress, 
          razorpayOrderId: rzpOrder.id, 
          paymentId: null, 
          status: 'pending', 
          isTestMode: isTestMode,
          createdAt: new Date() 
        });
        return NextResponse.json({ 
          orderId, 
          razorpayOrderId: rzpOrder.id, 
          amount: rzpOrder.amount, 
          currency: 'INR',
          isTestMode,
          message: isTestMode && amount > maxTestAmount ? `Test mode: Amount capped at ₹${maxTestAmount} (Actual: ₹${actualAmount})` : null
        });
      } catch (error) {
        console.error('Razorpay order creation error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
      }
    }

    if (ps === 'payment/verify') {
      const user = await getUser(request, db);
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const expected = hmac.digest('hex');
      if (expected !== razorpay_signature) return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
      await db.collection('orders').updateOne({ _id: orderId }, { $set: { status: 'paid', paymentId: razorpay_payment_id, paidAt: new Date() } });
      await db.collection('carts').updateOne({ userId: user._id }, { $set: { items: [] } });
      return NextResponse.json({ success: true, message: 'Payment verified' });
    }

    if (ps === 'contact') {
      const { name, email, subject, message } = body;
      if (!name || !email || !message) return NextResponse.json({ error: 'Name, email and message required' }, { status: 400 });
      await db.collection('contacts').insertOne({ _id: uuidv4(), name, email, subject: subject || 'General Inquiry', message, status: 'new', createdAt: new Date() });
      return NextResponse.json({ message: 'Message sent successfully' });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (e) {
    console.error('POST Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const db = await connectDB();
    const ps = (params.path || []).join('/');
    let body = {};
    try { body = await request.json(); } catch {}
    if (ps.startsWith('cart/')) {
      const productId = ps.replace('cart/', '');
      const user = await getUser(request, db);
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const { quantity } = body;
      if (quantity < 1) await db.collection('carts').updateOne({ userId: user._id }, { $pull: { items: { productId } } });
      else await db.collection('carts').updateOne({ userId: user._id, 'items.productId': productId }, { $set: { 'items.$.quantity': quantity } });
      const cart = await db.collection('carts').findOne({ userId: user._id });
      return NextResponse.json({ message: 'Updated', cartCount: cart?.items?.length || 0 });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(request, { params }) {
  try {
    const db = await connectDB();
    const ps = (params.path || []).join('/');
    if (ps.startsWith('cart/')) {
      const productId = ps.replace('cart/', '');
      const user = await getUser(request, db);
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      await db.collection('carts').updateOne({ userId: user._id }, { $pull: { items: { productId } } });
      const cart = await db.collection('carts').findOne({ userId: user._id });
      return NextResponse.json({ message: 'Removed', cartCount: cart?.items?.length || 0 });
    }
    if (ps.startsWith('wishlist/')) {
      const productId = ps.replace('wishlist/', '');
      const user = await getUser(request, db);
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      await db.collection('wishlists').updateOne({ userId: user._id }, { $pull: { productIds: productId } });
      const wl = await db.collection('wishlists').findOne({ userId: user._id });
      return NextResponse.json({ message: 'Removed', wishlistCount: wl?.productIds?.length || 0 });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
