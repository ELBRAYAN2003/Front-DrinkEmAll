const CDN = 'https://prestashop.codezeel.com/PRS04/PRS040088/default'

export const cms = (name) => `${CDN}/img/cms/${name}`

export const CATEGORIES = [
  { name: 'Whisky', children: ['Blended', 'Single Malt', 'Bourbon', 'Rye'] },
  { name: 'Vodka', children: ['Classic', 'Flavoured', 'Premium', 'Citrus'] },
  { name: 'Fernet', children: ['Classica', 'Menta', 'Litoral', 'Freeze'] },
  { name: 'Beer', children: ['Lager', 'Pilsen', 'Ale', 'Stout'] },
  { name: 'Gin', children: ['London Dry', 'Old Tom', 'Sloe', 'Premium'] },
  { name: 'Rum', children: ['White', 'Aged', 'Dark', 'Spiced'] },
]

export const NAV = [
  { label: 'Home', href: '#' },
  {
    label: 'Shop',
    href: '#',
    panel: 'shop',
    columns: [
      {
        title: 'Product Types',
        links: ['Simple Product', 'Grouped Product', 'Variable Product', 'Sale Product', 'Upsell Products', 'Cross Sell Product'],
      },
      {
        title: 'Prestashop Pages',
        links: ['Checkout Page', 'Category Page', 'Shopping Cart', 'My account', 'Shop Ajax Filter', 'Our Stores'],
      },
      {
        title: 'Product Features',
        links: ['Progress Bar', 'Product Brand', 'Countdown Timer', 'Custom Tabs', 'Product Gallery', 'Stock Label'],
      },
    ],
    banners: [
      { img: cms('menu-banner-1.jpg'), caption: 'Special offer', title: 'Discount up to 20% OFF', sub: 'Top deals', price: '$50' },
      { img: cms('menu-banner-2.jpg'), caption: 'Special sale', title: 'Up to 30% OFF', sub: 'New arrivals' },
    ],
  },
  {
    label: 'Categories SALE',
    href: '#',
    panel: 'categories',
    children: CATEGORIES,
  },
  {
    label: 'Products HOT',
    href: '#',
    panel: 'products',
    blurb: {
      title: 'The New Collection',
      text: 'It sounds like you\u2019re asking about new product arrivals for the year, This will help me give you the most relevant and up-to-date information!',
    },
  },
  {
    label: 'Top Deals',
    href: '#',
    panel: 'shopby',
    shopBy: [
      { img: cms('menu-cat-1.jpg'), label: 'Whisky' },
      { img: cms('menu-cat-2.jpg'), label: 'Vodka' },
      { img: cms('menu-cat-3.jpg'), label: 'Fernet Branca' },
      { img: cms('menu-cat-4.jpg'), label: 'Beer' },
      { img: cms('menu-cat-5.jpg'), label: 'Gin' },
      { img: cms('menu-cat-6.jpg'), label: 'Rum' },
      { img: cms('menu-cat-7.jpg'), label: 'Cider' },
      { img: cms('menu-cat-8.jpg'), label: 'Sangria' },
    ],
  },
  {
    label: 'Elements',
    href: '#',
    panel: 'elements',
    links: ['Accordion', 'Icon Box', 'Portfolio', 'FAQs', 'Gallery', 'Tabs', 'About Us', 'Contact Us'],
  },
]

export const CATEGORY_BANNERS = [
  { img: cms('category-banner-01.png'), title: 'Bourbon Whisky' },
  { img: cms('category-banner-02.png'), title: 'Premium Vodka' },
  { img: cms('category-banner-03.png'), title: 'Craft Beer' },
]

const PRODUCT_DEFS = [
  {
    id: 1,
    name: 'Johnnie Walker Black Label Whisky',
    brand: 'Johnnie Walker',
    kind: 'whisky',
    price: 50,
    discount: 5,
    rating: 3,
    stock: 17,
    countdown: true,
  },
  {
    id: 2,
    name: 'Absolut Vodka Original',
    brand: 'Absolut',
    kind: 'vodka',
    price: 40,
    rating: 2,
    stock: 110,
  },
  {
    id: 3,
    name: 'Fernet Branca 750ml',
    brand: 'Fernet-Branca',
    kind: 'fernet',
    price: 45,
    rating: 5,
    stock: 102,
  },
  {
    id: 4,
    name: 'Corona Extra 710ml',
    brand: 'Corona',
    kind: 'beer',
    price: 65,
    discount: 10,
    rating: 3,
    stock: 140,
    countdown: true,
  },
  {
    id: 5,
    name: 'Jack Daniel\u2019s Old No. 7 Whisky',
    brand: 'Jack Daniel\u2019s',
    kind: 'whisky',
    price: 52,
    rating: 4,
    stock: 100,
  },
  {
    id: 6,
    name: 'Chivas Regal 12 Years Whisky',
    brand: 'Chivas Regal',
    kind: 'whisky',
    price: 55,
    discount: 10,
    rating: 3,
    stock: 120,
    countdown: true,
  },
  {
    id: 7,
    name: 'Absolut Blue Vodka',
    brand: 'Absolut',
    kind: 'vodka',
    price: 46,
    rating: 2,
    stock: 125,
  },
  {
    id: 8,
    name: 'Corona Light 355ml',
    brand: 'Corona',
    kind: 'beer',
    price: 58,
    rating: 4,
    stock: 0,
  },
  {
    id: 9,
    name: 'Glenfiddich 12 Years Whisky',
    brand: 'Glenfiddich',
    kind: 'whisky',
    price: 54,
    rating: 4,
    stock: 157,
    customize: true,
  },
  {
    id: 10,
    name: 'Fernet Branca Menta',
    brand: 'Fernet-Branca',
    kind: 'fernet',
    price: 60,
    discount: 15,
    rating: 4,
    stock: 120,
    countdown: true,
  },
  {
    id: 11,
    name: 'Absolut Vanilia Vodka',
    brand: 'Absolut',
    kind: 'vodka',
    price: 62,
    rating: 4,
    stock: 102,
  },
  {
    id: 12,
    name: 'Corona Familiar 6 Pack',
    brand: 'Corona',
    kind: 'beer',
    price: 55,
    rating: 3,
    stock: 163,
    pack: true,
  },
  {
    id: 13,
    name: 'Buchanan\u2019s DeLuxe Whisky',
    brand: 'Buchanan\u2019s',
    kind: 'whisky',
    price: 70,
    discount: 5,
    rating: 4,
    stock: 105,
    countdown: true,
    swatches: ['#cfa35b', '#e48ea4'],
  },
  {
    id: 14,
    name: 'Absolut Apeach Vodka',
    brand: 'Absolut',
    kind: 'vodka',
    price: 68,
    rating: 3,
    stock: 176,
  },
  {
    id: 15,
    name: 'Jameson Irish Whisky',
    brand: 'Jameson',
    kind: 'whisky',
    price: 50,
    discount: 7,
    rating: 5,
    stock: 4,
    countdown: true,
  },
  {
    id: 16,
    name: 'Absolut Elyx Vodka',
    brand: 'Absolut',
    kind: 'vodka',
    price: 60,
    rating: 4,
    stock: 120,
  },
  {
    id: 17,
    name: 'Old Parr 12 Years Whisky',
    brand: 'Old Parr',
    kind: 'whisky',
    price: 75,
    discount: 12,
    rating: 3,
    stock: 101,
    countdown: true,
  },
  {
    id: 18,
    name: 'Fernet Branca 1L',
    brand: 'Fernet-Branca',
    kind: 'fernet',
    price: 52,
    rating: 4,
    stock: 120,
    swatches: ['#cfa35b', '#a83232', '#6e4a2f'],
  },
  {
    id: 19,
    name: 'Corona Negra 355ml',
    brand: 'Corona',
    kind: 'beer',
    price: 62,
    rating: 5,
    stock: 120,
    beer: true,
    swatches: ['#cfa35b', '#a83232', '#e48ea4'],
  },
  {
    id: 20,
    name: 'Ballantine\u2019s Finest Whisky',
    brand: 'Ballantine\u2019s',
    kind: 'whisky',
    price: 60,
    discount: 15,
    rating: 2,
    stock: 138,
    countdown: true,
  },
]

export const PRODUCTS = Object.fromEntries(PRODUCT_DEFS.map((p) => [p.id, p]))

export const TRENDING = [1, 2, 3, 4, 5, 6, 7, 8]

export const SPECIAL = [15, 1, 6, 10, 20, 4, 17, 13]

export const TESTIMONIALS = [
  {
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English.',
    name: 'Mack Jeckno',
    role: 'Web Designer',
  },
  {
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English.',
    name: 'luies Charls',
    role: 'CEO',
  },
  {
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English.',
    name: 'Jecob Goeckno',
    role: 'Manager',
  },
]

export const GALLERY = [
  { img: cms('blog-01.jpg'), title: 'How to Write a Blog Post Your Readers Will Love in 5 Steps' },
  { img: cms('blog-02.jpg'), title: '9 Content Marketing Trends and Ideas to Increase Traffic' },
  { img: cms('blog-03.jpg'), title: 'The Ultimate Guide to Marketing Strategies to Improve Sales' },
  { img: cms('blog-04.jpg'), title: "50 Best Sales Questions to Determine Your Customer's Needs" },
  { img: cms('blog-05.jpg'), title: '6 Simple Ways To Boost Your Ecommerce Conversion Rate' },
  { img: cms('blog-06.jpg'), title: "9 Customer Experience Trends That'll Define the Next Year" },
]

export const BRANDS = ['Cartify', 'EcomZone', 'EcoShop', 'MegaMart', 'QuickCart', 'SmartShop', 'StyleHub'].map(
  (name, i) => ({ name, img: `${CDN}/img/m/${i + 1}.jpg` }),
)

export const HERO_SLIDES = [
  {
    tag: 'Welcome to DrinkEmAll',
    title: 'Super Tons Of Awesome Drinks',
    text: "DrinkEmAll is the perfect place to buy your favourite whiskies, vodka, fernet and beers. We've selected a unique range of quality drinks for you.",
    cta: 'Shop Now',
    img: cms('main-banner-01.png'),
  },
  {
    tag: 'The Authentic Taste',
    title: 'Whisky, Beer & Spirits From Around The World',
    text: 'Discover fine whiskies, premium vodka and craft beers sourced from the best distilleries and breweries across the globe.',
    cta: 'Discover More',
    img: cms('main-banner-02.png'),
  },
  {
    tag: 'Save Big Today',
    title: 'Big Week Special Offer',
    text: 'Up to 30% off selected bottles. Limited time only, so grab your favourites before they are gone.',
    cta: 'View Offers',
    img: cms('main-banner-01.png'),
  },
]

export const SUB_BANNERS = [
  {
    img: cms('sub-banner-01.jpg'),
    label: '20% Discount',
    title: 'Fresh Whisky Collection',
  },
  {
    img: cms('sub-banner-02.jpg'),
    label: 'Buy 1 Get 1 Free',
    title: 'Corona Beer Offer',
  },
]

export const money = (n) => `$${+n.toFixed(2)}`