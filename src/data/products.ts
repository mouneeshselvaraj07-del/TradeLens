export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  baseCost: number;
  image: string;
  description: string;
}

export const PRODUCT_CATALOG: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro',
    category: 'Electronics',
    subCategory: 'Smartphones',
    baseCost: 95000,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    description: 'Latest flagship smartphone with titanium design and A17 Pro chip.'
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Electronics',
    subCategory: 'Smartphones',
    baseCost: 110000,
    image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&w=800&q=80',
    description: 'Premium Android smartphone with AI features and S-Pen.'
  },
  {
    id: 'p3',
    name: 'Sony WH-1000XM5',
    category: 'Electronics',
    subCategory: 'Audio',
    baseCost: 25000,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
    description: 'Industry-leading noise-canceling wireless headphones.'
  },
  {
    id: 'p4',
    name: 'MacBook Air M3',
    category: 'Electronics',
    subCategory: 'Laptops',
    baseCost: 105000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    description: 'Thin and light laptop with the powerful M3 chip.'
  },
  {
    id: 'p5',
    name: 'Nike Air Max 270',
    category: 'Fashion',
    subCategory: 'Sneakers',
    baseCost: 12000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    description: 'Comfortable and stylish lifestyle sneakers.'
  },
  {
    id: 'p6',
    name: 'Levi\'s 501 Original',
    category: 'Fashion',
    subCategory: 'Apparel',
    baseCost: 3500,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    description: 'Classic straight leg jeans.'
  },
  {
    id: 'p7',
    name: 'Velvet 3-Seater Sofa',
    category: 'Home',
    subCategory: 'Furniture',
    baseCost: 45000,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    description: 'Luxurious velvet sofa for modern living rooms.'
  },
  {
    id: 'p8',
    name: 'Ergonomic Office Chair',
    category: 'Home',
    subCategory: 'Furniture',
    baseCost: 15000,
    image: 'https://images.unsplash.com/photo-1505797149-43b0ad51849a?auto=format&fit=crop&w=800&q=80',
    description: 'High-back chair with lumbar support for long working hours.'
  },
  {
    id: 'p9',
    name: 'Remote Control Monster Truck',
    category: 'Toys',
    subCategory: 'RC Vehicles',
    baseCost: 4500,
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=800&q=80',
    description: 'High-speed off-road RC truck for kids and hobbyists.'
  },
  {
    id: 'p10',
    name: 'LEGO Star Wars Millennium Falcon',
    category: 'Toys',
    subCategory: 'Building Sets',
    baseCost: 14000,
    image: 'https://images.unsplash.com/photo-1585366119957-e556f403e44c?auto=format&fit=crop&w=800&q=80',
    description: 'Detailed LEGO model of the iconic Star Wars ship.'
  },
  {
    id: 'p11',
    name: 'Dyson V15 Detect',
    category: 'Home',
    subCategory: 'Appliances',
    baseCost: 55000,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
    description: 'Powerful cordless vacuum cleaner with laser dust detection.'
  },
  {
    id: 'p12',
    name: 'Instant Pot Duo 7-in-1',
    category: 'Kitchen',
    subCategory: 'Appliances',
    baseCost: 8500,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
    description: 'Multi-functional pressure cooker and slow cooker.'
  },
  {
    id: 'p13',
    name: 'iPad Pro M2',
    category: 'Electronics',
    subCategory: 'Tablets',
    baseCost: 82000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    description: 'The ultimate iPad experience with the M2 chip.'
  },
  {
    id: 'p14',
    name: 'Nintendo Switch OLED',
    category: 'Electronics',
    subCategory: 'Gaming',
    baseCost: 32000,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=800&q=80',
    description: 'Handheld gaming console with a vibrant OLED screen.'
  },
  {
    id: 'p15',
    name: 'Canon EOS R6 Mark II',
    category: 'Electronics',
    subCategory: 'Cameras',
    baseCost: 210000,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    description: 'Professional mirrorless camera for photo and video.'
  },
  {
    id: 'p16',
    name: 'Adidas Ultraboost Light',
    category: 'Fashion',
    subCategory: 'Sneakers',
    baseCost: 18000,
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80',
    description: 'High-performance running shoes with epic energy return.'
  },
  {
    id: 'p17',
    name: 'Ray-Ban Classic Aviator',
    category: 'Fashion',
    subCategory: 'Accessories',
    baseCost: 11000,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic sunglasses with gold frames and green lenses.'
  },
  {
    id: 'p18',
    name: 'KitchenAid Artisan Mixer',
    category: 'Kitchen',
    subCategory: 'Appliances',
    baseCost: 38000,
    image: 'https://images.unsplash.com/photo-1594385208974-2e75f9d8ca28?auto=format&fit=crop&w=800&q=80',
    description: 'The legendary stand mixer for all your baking needs.'
  },
  {
    id: 'p19',
    name: 'Philips Air Fryer XXL',
    category: 'Kitchen',
    subCategory: 'Appliances',
    baseCost: 16000,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    description: 'Healthy frying with up to 90% less fat.'
  },
  {
    id: 'p20',
    name: 'iRobot Roomba j7+',
    category: 'Home',
    subCategory: 'Appliances',
    baseCost: 65000,
    image: 'https://images.unsplash.com/photo-1569698134101-f15cde5cd66c?auto=format&fit=crop&w=800&q=80',
    description: 'Self-emptying robot vacuum with obstacle avoidance.'
  },
  {
    id: 'p21',
    name: 'Premium Yoga Mat',
    category: 'Sports',
    subCategory: 'Fitness',
    baseCost: 4500,
    image: 'https://images.unsplash.com/photo-1592432676556-28453d07bad6?auto=format&fit=crop&w=800&q=80',
    description: 'Extra thick non-slip mat for yoga and pilates.'
  },
  {
    id: 'p22',
    name: 'Adjustable Dumbbells',
    category: 'Sports',
    subCategory: 'Fitness',
    baseCost: 22000,
    image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=800&q=80',
    description: 'Space-saving adjustable weights for home workouts.'
  },
  {
    id: 'p23',
    name: 'Garmin Fenix 7 Pro',
    category: 'Sports',
    subCategory: 'Wearables',
    baseCost: 75000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    description: 'Ultimate multisport GPS watch with solar charging.'
  },
  {
    id: 'p24',
    name: 'Peloton Bike+',
    category: 'Sports',
    subCategory: 'Fitness',
    baseCost: 215000,
    image: 'https://images.unsplash.com/photo-1591741535018-d042766c62eb?auto=format&fit=crop&w=800&q=80',
    description: 'Immersive indoor cycling experience with live classes.'
  },
  {
    id: 'p25',
    name: 'Samsung 65" QLED 4K TV',
    category: 'Electronics',
    subCategory: 'Entertainment',
    baseCost: 125000,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    description: 'Stunning 4K resolution with Quantum Dot technology.'
  },
  {
    id: 'p26',
    name: 'Bose QuietComfort Ultra',
    category: 'Electronics',
    subCategory: 'Audio',
    baseCost: 35000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    description: 'World-class noise cancellation and spatial audio.'
  },
  {
    id: 'p27',
    name: 'Logitech G Pro X Superlight',
    category: 'Electronics',
    subCategory: 'Gaming',
    baseCost: 12000,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-lightweight wireless gaming mouse for pros.'
  },
  {
    id: 'p28',
    name: 'Nespresso Vertuo Next',
    category: 'Kitchen',
    subCategory: 'Appliances',
    baseCost: 18000,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
    description: 'Versatile coffee and espresso machine with sleek design.'
  },
  {
    id: 'p29',
    name: 'Patagonia Better Sweater',
    category: 'Fashion',
    subCategory: 'Apparel',
    baseCost: 9500,
    image: 'https://images.unsplash.com/photo-1620403775050-6ff997754977?auto=format&fit=crop&w=800&q=80',
    description: 'Warm, low-bulk full-zip jacket made of knitted polyester fleece.'
  },
  {
    id: 'p30',
    name: 'Hydro Flask 32 oz',
    category: 'Sports',
    subCategory: 'Accessories',
    baseCost: 3500,
    image: 'https://images.unsplash.com/photo-1602143307185-8ca415a2967d?auto=format&fit=crop&w=800&q=80',
    description: 'Insulated stainless steel water bottle for all-day hydration.'
  }
];
