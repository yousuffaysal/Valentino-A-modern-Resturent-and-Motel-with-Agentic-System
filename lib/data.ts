export interface Room {
  code: string;
  slug: string;
  name: string;
  nameBn: string;
  config: string;
  configBn: string;
  sleeps: number;
  rate: number;
  img: string;
  alt: string;
  blurb: string;
  blurbBn: string;
}

export interface MenuItem {
  cat: string;
  name: string;
  price: number;
  desc: string;
}

export interface Facility {
  en: string;
  bn: string;
  copy: string;
}

export interface ExploreAttraction {
  slug: string;
  name: string;
  dist: string;
  line: string;
  img: string;
}

export interface GalleryItem {
  src: string;
  cat: string;
  alt: string;
}

export interface Addon {
  id: string;
  label: string;
  labelBn: string;
  price: number;
  unit: string;
  unitBn: string;
}

export interface NavItem {
  en: string;
  bn: string;
  route: string;
}

export const ROOMS: Room[] = [
  { code: 'HV-01', slug: 'single-deluxe', name: 'Single Deluxe', nameBn: 'সিঙ্গেল ডিলাক্স', config: 'One single bed', configBn: 'একটি সিঙ্গেল বেড', sleeps: 1, rate: 2500, img: '/img/room-single-deluxe.png', alt: 'Single Deluxe room', blurb: 'The smallest room in the building and the one most business travellers book. One single bed, a work surface, a sofa, and a window looking down Main Road.', blurbBn: 'ভবনের সবচেয়ে ছোট রুম, একজনের জন্য। একটি সিঙ্গেল বেড, কাজের টেবিল ও সোফা।' },
  { code: 'HV-02', slug: 'couple-deluxe', name: 'Couple Deluxe', nameBn: 'কাপল ডিলাক্স', config: 'One couple bed', configBn: 'একটি ডাবল বেড', sleeps: 2, rate: 4500, img: '/img/room-couple-deluxe.png', alt: 'Couple Deluxe room', blurb: 'One couple bed, a full wardrobe and a dressing mirror. The standard two person room and the most booked category in the hotel.', blurbBn: 'একটি ডাবল বেড, ওয়ারড্রোব ও ড্রেসিং মিরর। দুইজনের জন্য স্ট্যান্ডার্ড রুম।' },
  { code: 'HV-03', slug: 'twin-deluxe', name: 'Twin Deluxe', nameBn: 'টুইন ডিলাক্স', config: 'Two single beds', configBn: 'দুইটি সিঙ্গেল বেড', sleeps: 2, rate: 6000, img: '/img/room-twin-deluxe.png', alt: 'Twin Deluxe room', blurb: 'Two single beds under a lit feature wall. Booked by colleagues travelling together and by families who want the children in the same room.', blurbBn: 'দুইটি আলাদা সিঙ্গেল বেড। সহকর্মী বা পরিবারের জন্য উপযুক্ত।' },
  { code: 'HV-04', slug: 'triple-deluxe', name: 'Triple Deluxe', nameBn: 'ট্রিপল ডিলাক্স', config: 'One couple bed and one single bed', configBn: 'একটি ডাবল ও একটি সিঙ্গেল বেড', sleeps: 3, rate: 7500, img: '/img/room-sunset-window.png', alt: 'Triple Deluxe room', blurb: 'One couple bed and one single bed, with a full height window facing west. The sunset over Noakhali town lands in this room for about twenty minutes.', blurbBn: 'একটি ডাবল ও একটি সিঙ্গেল বেড, পশ্চিমমুখী বড় জানালা।' },
  { code: 'HV-05', slug: 'honeymoon-suite', name: 'Honeymoon Suite', nameBn: 'হানিমুন স্যুট', config: 'King bed', configBn: 'কিং বেড', sleeps: 2, rate: 8000, img: '/img/room-honeymoon-suite.png', alt: 'Honeymoon Suite', blurb: 'King bed, brass lamps, and the quietest corner on the floor. Reception will set the room up before arrival if you tell them the occasion.', blurbBn: 'কিং বেড, ব্রাস ল্যাম্প এবং ফ্লোরের সবচেয়ে শান্ত কোণ।' },
  { code: 'HV-06', slug: 'vip-suite', name: 'VIP Suite', nameBn: 'ভিআইপি স্যুট', config: 'One couple bed', configBn: 'একটি ডাবল বেড', sleeps: 2, rate: 10000, img: '/img/room-vip-suite.png', alt: 'VIP Suite', blurb: 'A separate desk area, marble floor and a wide window. Booked for government visits and for guests who need to take calls without leaving the room.', blurbBn: 'আলাদা ডেস্ক এরিয়া, মার্বেল ফ্লোর ও প্রশস্ত জানালা।' },
  { code: 'HV-07', slug: 'deluxe-four-bed', name: 'Deluxe Four Bed', nameBn: 'ডিলাক্স ফোর বেড', config: 'Two couple beds', configBn: 'দুইটি ডাবল বেড', sleeps: 4, rate: 10000, img: '/img/room-twin-deluxe.png', alt: 'Deluxe Four Bed room', blurb: 'Two couple beds in one room, four people, one rate. The cheapest way for a family of four to stay in the centre of Maijdee Court.', blurbBn: 'এক রুমে দুইটি ডাবল বেড, চারজনের জন্য একটি রেট।' },
  { code: 'HV-08', slug: 'premium-executive-suite', name: 'Premium Executive Suite', nameBn: 'প্রিমিয়াম এক্সিকিউটিভ স্যুট', config: 'King bed and lounge', configBn: 'কিং বেড ও লাউঞ্জ', sleeps: 3, rate: 12000, img: '/img/room-vip-suite.png', alt: 'Executive Suite', blurb: 'Our highest tier room with panoramic views of Maijdee Court, complimentary breakfast, and dedicated butler service.', blurbBn: 'আমাদের সর্বোচ্চ প্রিমিয়াম স্যুট, মাইজদী কোর্টের চারপাশের দৃশ্যসহ।' }
];

export const MENU: MenuItem[] = [
  { cat: 'Appetizers', name: 'BBQ Wings', price: 250, desc: 'Charcoal grilled, smoked barbecue glaze.' },
  { cat: 'Appetizers', name: 'Crispy Fried Chicken', price: 275, desc: 'Buttermilk brined overnight, corn flake crust.' },
  { cat: 'Appetizers', name: 'Chicken Katsu', price: 250, desc: 'Panko breaded breast, tonkatsu sauce on the side.' },
  { cat: 'Appetizers', name: 'Five Spice Fried Wings', price: 250, desc: 'Star anise, fennel and white pepper rub.' },
  { cat: 'Platters', name: 'Beef Sizzler', price: 799, desc: 'Served on the iron plate, onions still going.' },
  { cat: 'Platters', name: 'Hunan Chicken', price: 399, desc: 'Dried chilli and garlic, the hottest thing on the menu.' },
  { cat: 'Platters', name: 'Korean Spicy Chicken', price: 380, desc: 'Gochujang glaze, sesame, spring onion.' },
  { cat: 'Platters', name: 'Teriyaki Chicken', price: 410, desc: 'Grilled breast, teriyaki reduction, fried rice.' },
  { cat: 'Platters', name: 'Chicken Masala', price: 399, desc: 'The one dish here that tastes like home.' },
  { cat: 'Platters', name: 'BBQ Whole Chicken', price: 1199, desc: 'Whole bird for the table, four to six people.' },
  { cat: 'Platters', name: 'Mixed Chowmein', price: 235, desc: 'Egg noodles, chicken, prawn, vegetables.' },
  { cat: 'Steak', name: 'Chicken Steak', price: 399, desc: 'Flattened breast, mushroom gravy, wedges.' },
  { cat: 'Steak', name: 'Lemon Chicken', price: 420, desc: 'Lemon butter sauce, cut sharp with zest.' },
  { cat: 'Soup', name: 'Sweet Corn Chicken', price: 170, desc: 'Thick, mild, the safe order for children.' },
  { cat: 'Soup', name: 'Thai Clear', price: 170, desc: 'Lemongrass and galangal broth, clean finish.' },
  { cat: 'Soup', name: 'Tom Yam', price: 180, desc: 'Sour and hot, chilli oil floated on top.' },
  { cat: 'Soup', name: 'Vegetable Clear', price: 150, desc: 'Light vegetable broth, no meat stock.' }
];

export const FACILITIES: Facility[] = [
  { en: '24-hour reception', bn: '২৪ ঘণ্টা রিসেপশন', copy: 'The desk is staffed all night. Arrive at 2am off the coach and someone checks you in.' },
  { en: '24-hour room service', bn: '২৪ ঘণ্টা রুম সার্ভিস', copy: 'The Sky View kitchen sends food down to the rooms whenever it is open, and the desk handles the rest.' },
  { en: 'Television', bn: 'টেলিভিশন', copy: 'Flat-screen television with cable in every category, from Single Deluxe upward.' },
  { en: 'Telephone', bn: 'টেলিফোন', copy: 'Direct line to reception in every room, so you are not hunting for a mobile signal.' },
  { en: 'Free parking', bn: 'ফ্রি পার্কিং', copy: 'Parking at the building for guests, no charge, no booking needed.' },
  { en: 'Free Wi-Fi', bn: 'ফ্রি ওয়াই-ফাই', copy: 'Wi-Fi in every room and in the lobby, included in the rate.' }
];

export const EXPLORE: ExploreAttraction[] = [
  { slug: 'nijhum-dwip', name: 'Nijhum Dwip', dist: '75 KM', line: 'Spotted deer, silence, and the coast.', img: '/img/explore-nijhum-dwip.png' },
  { slug: 'gandhi-ashram', name: 'Gandhi Ashram Trust', dist: '24 KM', line: 'The 1946 peace march headquarters at Jayag.', img: '/img/explore-gandhi-ashram.png' },
  { slug: 'bajra-shahi-mosque', name: 'Bajra Shahi Mosque', dist: '18 KM', line: 'Mughal domes built in 1741, still in use.', img: '/img/explore-bajra-mosque.png' },
  { slug: 'nstu-campus', name: 'NSTU Campus', dist: '8 KM', line: 'Noakhali Science and Technology University.', img: '/img/explore-nstu.png' }
];

export const GALLERY: GalleryItem[] = [
  { src: '/img/hotel-exterior.png', cat: 'Building', alt: 'Hotel Valentino exterior' },
  { src: '/img/room-couple-deluxe.png', cat: 'Rooms', alt: 'Couple Deluxe room' },
  { src: '/img/room-twin-deluxe.png', cat: 'Rooms', alt: 'Twin Deluxe room' },
  { src: '/img/room-sunset-window.png', cat: 'Rooms', alt: 'Sunset view from room' },
  { src: '/img/room-vip-suite.png', cat: 'Rooms', alt: 'VIP Suite interior' },
  { src: '/img/dish-crispy-fried-chicken.png', cat: 'Sky View', alt: 'Crispy fried chicken' },
  { src: '/img/dish-teriyaki-chicken.png', cat: 'Sky View', alt: 'Teriyaki chicken platter' },
  { src: '/img/dish-bbq-chicken-rice.png', cat: 'Sky View', alt: 'BBQ chicken rice' },
  { src: '/img/dish-oreo-madness.png', cat: 'Sky View', alt: 'Oreo Madness dessert' }
];

export const ADDONS: Addon[] = [
  { id: 'pickup', label: 'Airport pick-up and drop', labelBn: 'এয়ারপোর্ট পিকআপ ও ড্রপ', price: 2500, unit: 'per trip', unitBn: 'প্রতি ট্রিপ' },
  { id: 'car', label: 'Rent a car with driver', labelBn: 'ড্রাইভারসহ কার রেন্টাল', price: 4500, unit: 'per day', unitBn: 'প্রতি দিন' },
  { id: 'tour', label: 'Tour desk day package', labelBn: 'ট্যুর ডেস্ক ডে প্যাকেজ', price: 3500, unit: 'per group', unitBn: 'প্রতি গ্রুপ' },
  { id: 'bed', label: 'Extra bed', labelBn: 'অতিরিক্ত বেড', price: 800, unit: 'per night', unitBn: 'প্রতি রাত' },
  { id: 'early', label: 'Early check-in from 08:00', labelBn: 'সকাল ০৮:০০ থেকে আর্লি চেক-ইন', price: 1000, unit: 'one off', unitBn: 'এককালীন' }
];

export const NAV: NavItem[] = [
  { en: 'Rooms', bn: 'রুম', route: 'rooms' },
  { en: 'Sky View', bn: 'স্কাই ভিউ', route: 'restaurant' },
  { en: 'Facilities', bn: 'সুবিধা', route: 'facilities' },
  { en: 'Explore', bn: 'ঘুরে দেখুন', route: 'explore' },
  { en: 'Gallery', bn: 'গ্যালারি', route: 'gallery' },
  { en: 'Contact', bn: 'যোগাযোগ', route: 'contact' }
];

export const MOCK_SEED_BOOKINGS = [
  { id: 'HV-A92B1', name: 'Yousuf Faysal', mobile: '01795855555', email: 'yousuf@example.com', room: 'VIP Suite', rate: 20000, ci: '2026-08-21', co: '2026-08-23', status: 'Paid', date: '2026-07-28' },
  { id: 'HV-KLK32', name: 'Zarin Tasnim', mobile: '01712998877', email: 'zarin@example.com', room: 'Honeymoon Suite', rate: 16000, ci: '2026-08-01', co: '2026-08-03', status: 'Paid', date: '2026-07-28' },
  { id: 'HV-J9K8A', name: 'Tanvir Rahman', mobile: '01823112233', email: 'tanvir@example.com', room: 'Single Deluxe', rate: 5000, ci: '2026-08-05', co: '2026-08-07', status: 'Confirmed', date: '2026-07-27' },
  { id: 'HV-OPQ77', name: 'Nusrat Jahan', mobile: '01911445566', email: 'nusrat@example.com', room: 'Twin Deluxe', rate: 12000, ci: '2026-08-10', co: '2026-08-12', status: 'Paid', date: '2026-07-26' },
  { id: 'HV-WER90', name: 'Fahim Chowdhury', mobile: '01399887766', email: 'fahim@example.com', room: 'Premium Executive Suite', rate: 21000, ci: '2026-08-15', co: '2026-08-17', status: 'Pending', date: '2026-07-25' },
  { id: 'HV-Z8X9C', name: 'Ishrat Jahan', mobile: '01522334455', email: 'ishrat@example.com', room: 'Couple Deluxe', rate: 9000, ci: '2026-08-18', co: '2026-08-20', status: 'Paid', date: '2026-07-24' },
  { id: 'HV-B1N2M', name: 'Rashedul Islam', mobile: '01733445566', email: 'rashed@example.com', room: 'Triple Deluxe', rate: 22500, ci: '2026-08-22', co: '2026-08-25', status: 'Confirmed', date: '2026-07-23' },
  { id: 'HV-H7G6F', name: 'Sadia Afrin', mobile: '01844556677', email: 'sadia@example.com', room: 'Deluxe Four Bed', rate: 10000, ci: '2026-08-28', co: '2026-08-29', status: 'Paid', date: '2026-07-22' },
  { id: 'HV-T5R4E', name: 'Kamrul Hasan', mobile: '01955667788', email: 'kamrul@example.com', room: 'Single Deluxe', rate: 2500, ci: '2026-09-01', co: '2026-09-02', status: 'Pending', date: '2026-07-21' },
  { id: 'HV-Y2U3I', name: 'Mehedi Hasan', mobile: '01677889900', email: 'mehedi@example.com', room: 'VIP Suite', rate: 30000, ci: '2026-09-05', co: '2026-09-08', status: 'Paid', date: '2026-07-20' }
];

export const parseIso = (s: string) => {
  const p = s.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
};

export const formatDisplayDate = (s: string | null, isBn = false) => {
  if (!s) return null;
  const d = parseIso(s);
  const mon3En = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const mon3Bn = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
  const months = isBn ? mon3Bn : mon3En;
  return String(d.getDate()).padStart(2, '0') + ' ' + months[d.getMonth()];
};

export const money = (n: number) => n.toLocaleString('en-US');
