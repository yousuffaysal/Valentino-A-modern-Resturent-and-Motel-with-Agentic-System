/**
 * Content defaults, verbatim from the approved design source
 * (`Hotel Valentino.dc.html`). These act as the seed for the database and as
 * the fallback whenever the database is unreachable, so the site always renders
 * with the same copy the design was signed off with.
 */

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
  inventory: number;
  active: boolean;
  sort: number;
}

export interface MenuItem {
  id?: string;
  cat: string;
  name: string;
  price: number;
  desc: string;
  active?: boolean;
  sort?: number;
}

export interface GalleryItem {
  id?: string;
  src: string;
  cat: string;
  alt: string;
  active?: boolean;
  sort?: number;
}

export interface Facility {
  id?: string;
  en: string;
  bn: string;
  copy: string;
  sort?: number;
}

export interface Service {
  id?: string;
  num: string;
  en: string;
  bn: string;
  copy: string;
  img: string;
  sort?: number;
}

export interface Attraction {
  id?: string;
  slug: string;
  name: string;
  dist: string;
  ph: string;
  line: string;
  img: string;
  sort?: number;
}

export interface Addon {
  id: string;
  label: string;
  labelBn: string;
  price: number;
  unit: string;
  unitBn: string;
  sort?: number;
}

export interface NavItem {
  en: string;
  bn: string;
  route: string;
}

export interface BookingRecord {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  room: string;
  roomCode?: string | null;
  nrooms?: number;
  rate: number;
  ci: string;
  co: string;
  status: string;
  date: string;
  notes?: string | null;
  arrival?: string | null;
  pay?: string | null;
}

export const ROOMS: Room[] = [
  { code: 'HV-01', slug: 'single-deluxe', name: 'Single Deluxe', nameBn: 'সিঙ্গেল ডিলাক্স', config: 'One single bed', configBn: 'একটি সিঙ্গেল বেড', sleeps: 1, rate: 2500, img: '/img/room-single-deluxe.png', alt: 'Single Deluxe room with a sofa and a window over Main Road', blurb: 'The smallest room in the building and the one most business travellers book. One single bed, a work surface, a sofa, and a window that looks straight down Main Road.', blurbBn: 'ভবনের সবচেয়ে ছোট রুম, একজনের জন্য। একটি সিঙ্গেল বেড, কাজের টেবিল ও সোফা।', inventory: 6, active: true, sort: 1 },
  { code: 'HV-02', slug: 'couple-deluxe', name: 'Couple Deluxe', nameBn: 'কাপল ডিলাক্স', config: 'One couple bed', configBn: 'একটি ডাবল বেড', sleeps: 2, rate: 4500, img: '/img/room-couple-deluxe.png', alt: 'Couple Deluxe room with a double bed, wardrobe and dressing mirror', blurb: 'One couple bed, a full wardrobe and a dressing mirror. The standard two person room and the most booked category in the hotel.', blurbBn: 'একটি ডাবল বেড, ওয়ারড্রোব ও ড্রেসিং মিরর। দুইজনের জন্য স্ট্যান্ডার্ড রুম।', inventory: 8, active: true, sort: 2 },
  { code: 'HV-03', slug: 'twin-deluxe', name: 'Twin Deluxe', nameBn: 'টুইন ডিলাক্স', config: 'Two single beds', configBn: 'দুইটি সিঙ্গেল বেড', sleeps: 2, rate: 6000, img: '/img/room-twin-deluxe.png', alt: 'Twin Deluxe room with two single beds and a lit feature wall', blurb: 'Two single beds under a lit feature wall. Booked by colleagues travelling together and by families who want the children in the same room.', blurbBn: 'দুইটি আলাদা সিঙ্গেল বেড। সহকর্মী বা পরিবারের জন্য উপযুক্ত।', inventory: 5, active: true, sort: 3 },
  { code: 'HV-04', slug: 'triple-deluxe', name: 'Triple Deluxe', nameBn: 'ট্রিপল ডিলাক্স', config: 'One couple bed and one single bed', configBn: 'একটি ডাবল ও একটি সিঙ্গেল বেড', sleeps: 3, rate: 7500, img: '/img/room-sunset-window.png', alt: 'Triple Deluxe room with a full height window facing the sunset over Noakhali', blurb: 'One couple bed and one single bed, with a full height window facing west. The sunset over Noakhali town lands in this room for about twenty minutes.', blurbBn: 'একটি ডাবল ও একটি সিঙ্গেল বেড, পশ্চিমমুখী বড় জানালা।', inventory: 4, active: true, sort: 4 },
  { code: 'HV-05', slug: 'honeymoon-suite', name: 'Honeymoon Suite', nameBn: 'হানিমুন স্যুট', config: 'King bed', configBn: 'কিং বেড', sleeps: 2, rate: 8000, img: '/img/room-honeymoon-suite.png', alt: 'Honeymoon Suite with a king bed, brass lamps and patterned wallpaper', blurb: 'King bed, brass lamps, and the quietest corner on the floor. Reception will set the room up before arrival if you tell them the occasion.', blurbBn: 'কিং বেড, ব্রাস ল্যাম্প এবং ফ্লোরের সবচেয়ে শান্ত কোণ।', inventory: 2, active: true, sort: 5 },
  { code: 'HV-06', slug: 'vip-suite', name: 'VIP Suite', nameBn: 'ভিআইপি স্যুট', config: 'One couple bed', configBn: 'একটি ডাবল বেড', sleeps: 2, rate: 10000, img: '/img/room-vip-suite.png', alt: 'VIP Suite with a marble floor, separate desk area and a wide window', blurb: 'A separate desk area, marble floor and a wide window. Booked for government visits and for guests who need to take calls without leaving the room.', blurbBn: 'আলাদা ডেস্ক এরিয়া, মার্বেল ফ্লোর ও প্রশস্ত জানালা।', inventory: 2, active: true, sort: 6 },
  { code: 'HV-07', slug: 'deluxe-four-bed', name: 'Deluxe Four Bed', nameBn: 'ডিলাক্স ফোর বেড', config: 'Two couple beds', configBn: 'দুইটি ডাবল বেড', sleeps: 4, rate: 10000, img: '/img/room-twin-deluxe.png', alt: 'Deluxe Four Bed room laid out with two large beds', blurb: 'Two couple beds in one room, four people, one rate. The cheapest way for a family of four to stay in the centre of Maijdee Court.', blurbBn: 'এক রুমে দুইটি ডাবল বেড, চারজনের জন্য একটি রেট।', inventory: 3, active: true, sort: 7 },
  { code: 'HV-08', slug: 'premium-executive-suite', name: 'Premium Executive Suite', nameBn: 'প্রিমিয়াম এক্সিকিউটিভ স্যুট', config: 'One couple bed', configBn: 'একটি ডাবল বেড', sleeps: 2, rate: 10500, img: '/img/room-executive-window.png', alt: 'Premium Executive Suite with a floor to ceiling window over the town at sunrise', blurb: 'The top rate in the hotel. Floor to ceiling glass, a lounge chair facing it, and the best view of the town the building has.', blurbBn: 'হোটেলের সর্বোচ্চ ক্যাটাগরি। ফ্লোর টু সিলিং কাচ ও শহরের সেরা ভিউ।', inventory: 1, active: true, sort: 8 },
];

export const ATTRACTIONS: Attraction[] = [
  { slug: 'nstu', name: 'NSTU', dist: 'CONFIRM', ph: 'NSTU CAMPUS', line: 'Noakhali Science and Technology University.', img: '/img/explore-nstu.png', sort: 1 },
  { slug: 'bajra-shahi-mosque', name: 'Bajra Shahi Mosque', dist: 'CONFIRM', ph: 'BAJRA SHAHI MOSQUE', line: 'Eighteenth century mosque, Bajra.', img: '/img/explore-bajra.png', sort: 2 },
  { slug: 'nijhum-dweep', name: 'Nijhum Dweep', dist: 'CONFIRM', ph: 'NIJHUM DWEEP', line: 'Island in the Meghna estuary, deer sanctuary.', img: '/img/explore-nijhum.png', sort: 3 },
  { slug: 'gandhi-ashram', name: 'Gandhi Ashram', dist: 'CONFIRM', ph: 'GANDHI ASHRAM', line: 'Jayag, Sonaimuri.', img: '/img/explore-gandhi.png', sort: 4 },
];

export const SERVICES: Service[] = [
  { num: '01', en: 'Tour Desk', bn: 'ট্যুর ডেস্ক', copy: 'Reception plans day trips to Nijhum Dweep, Gandhi Ashram and Bajra Shahi Mosque, and books the car and driver for you.', img: '/img/tour-desk.png', sort: 1 },
  { num: '02', en: 'Air Tickets', bn: 'বিমান টিকেট', copy: 'Domestic and international ticketing at the front desk. Bring the passport, collect the ticket the same day.', img: '/img/air-ticket.png', sort: 2 },
  { num: '03', en: 'AC Bus Tickets', bn: 'এসি বাস টিকেট', copy: 'Dhaka and Chattogram coach tickets sold at reception, so you are not queuing at the bus station 1 km away.', img: '/img/bus-ticket.png', sort: 3 },
  { num: '04', en: 'Rent a Car', bn: 'গাড়ি ভাড়া', copy: 'Cars with drivers by the day or the trip, for town runs, NSTU visits and estuary trips.', img: '/img/car-rental.png', sort: 4 },
  { num: '05', en: 'Airport Pick-up and Drop', bn: 'এয়ারপোর্ট পিক-আপ', copy: 'Arranged on request for arrivals into Chattogram or Dhaka. Give reception the flight number when you book.', img: '/img/airport-pickup.png', sort: 5 },
  { num: '06', en: 'Hall Room', bn: 'হল রুম', copy: 'A hall in the building for weddings, corporate meetings and gaye holud. Catering comes from the Sky View kitchen.', img: '/img/hall-room.png', sort: 6 },
];

export const ADDONS: Addon[] = [
  { id: 'pickup', label: 'Airport pick-up and drop', labelBn: 'এয়ারপোর্ট পিকআপ ও ড্রপ', price: 2500, unit: 'per trip', unitBn: 'প্রতি ট্রিপ', sort: 1 },
  { id: 'car', label: 'Rent a car with driver', labelBn: 'ড্রাইভারসহ কার রেন্টাল', price: 4500, unit: 'per day', unitBn: 'প্রতি দিন', sort: 2 },
  { id: 'tour', label: 'Tour desk day package', labelBn: 'ট্যুর ডেস্ক ডে প্যাকেজ', price: 3500, unit: 'per group', unitBn: 'প্রতি গ্রুপ', sort: 3 },
  { id: 'bed', label: 'Extra bed', labelBn: 'অতিরিক্ত বেড', price: 800, unit: 'per night', unitBn: 'প্রতি রাত', sort: 4 },
  { id: 'early', label: 'Early check-in from 08:00', labelBn: 'সকাল ০৮:০০ থেকে আর্লি চেক-ইন', price: 1000, unit: 'one off', unitBn: 'এককালীন', sort: 5 },
];

export const NAV: NavItem[] = [
  { en: 'Rooms', bn: 'রুম', route: 'rooms' },
  { en: 'Sky View', bn: 'স্কাই ভিউ', route: 'restaurant' },
  { en: 'Facilities', bn: 'সুবিধা', route: 'facilities' },
  { en: 'Explore', bn: 'ঘুরে দেখুন', route: 'explore' },
  { en: 'Gallery', bn: 'গ্যালারি', route: 'gallery' },
  { en: 'Contact', bn: 'যোগাযোগ', route: 'contact' },
];

export const MENU: MenuItem[] = [
  { cat: 'Appetizers', name: 'BBQ Wings', price: 250, desc: 'Charcoal grilled, smoked barbecue glaze.', sort: 1 },
  { cat: 'Appetizers', name: 'Crispy Fried Chicken', price: 275, desc: 'Buttermilk brined overnight, corn flake crust.', sort: 2 },
  { cat: 'Appetizers', name: 'Chicken Katsu', price: 250, desc: 'Panko breaded breast, tonkatsu sauce on the side.', sort: 3 },
  { cat: 'Appetizers', name: 'Five Spice Fried Wings', price: 250, desc: 'Star anise, fennel and white pepper rub.', sort: 4 },
  { cat: 'Platters', name: 'Beef Sizzler', price: 799, desc: 'Served on the iron plate, onions still going.', sort: 5 },
  { cat: 'Platters', name: 'Hunan Chicken', price: 399, desc: 'Dried chilli and garlic, the hottest thing on the menu.', sort: 6 },
  { cat: 'Platters', name: 'Korean Spicy Chicken', price: 380, desc: 'Gochujang glaze, sesame, spring onion.', sort: 7 },
  { cat: 'Platters', name: 'Teriyaki Chicken', price: 410, desc: 'Grilled breast, teriyaki reduction, fried rice.', sort: 8 },
  { cat: 'Platters', name: 'Chicken Masala', price: 399, desc: 'The one dish here that tastes like home.', sort: 9 },
  { cat: 'Platters', name: 'BBQ Whole Chicken', price: 1199, desc: 'Whole bird for the table, four to six people.', sort: 10 },
  { cat: 'Platters', name: 'Mixed Chowmein', price: 235, desc: 'Egg noodles, chicken, prawn, vegetables.', sort: 11 },
  { cat: 'Steak', name: 'Chicken Steak', price: 399, desc: 'Flattened breast, mushroom gravy, wedges.', sort: 12 },
  { cat: 'Steak', name: 'Lemon Chicken', price: 420, desc: 'Lemon butter sauce, cut sharp with zest.', sort: 13 },
  { cat: 'Soup', name: 'Sweet Corn Chicken', price: 170, desc: 'Thick, mild, the safe order for children.', sort: 14 },
  { cat: 'Soup', name: 'Thai Clear', price: 170, desc: 'Lemongrass and galangal broth, clean finish.', sort: 15 },
  { cat: 'Soup', name: 'Tom Yam', price: 180, desc: 'Sour and hot, chilli oil floated on top.', sort: 16 },
  { cat: 'Soup', name: 'Vegetable Clear', price: 150, desc: 'Light vegetable broth, no meat stock.', sort: 17 },
  { cat: 'Salad and Pizza', name: 'Chicken Cashewnut Salad', price: 185, desc: 'Shredded chicken, toasted cashew, light dressing.', sort: 18 },
  { cat: 'Salad and Pizza', name: 'Four Seasons Pizza', price: 580, desc: 'Four quarters, four toppings, thin base.', sort: 19 },
  { cat: 'Italian café', name: 'Espresso', price: 90, desc: 'Danesi Emerald beans, shipped from Italy.', sort: 20 },
  { cat: 'Italian café', name: 'Cappuccino', price: 150, desc: 'Same beans, steamed to a fine microfoam.', sort: 21 },
  { cat: 'Italian café', name: 'Affogato', price: 199, desc: 'Mövenpick vanilla under a hot single shot.', sort: 22 },
  { cat: 'Italian café', name: 'Chocolate Milkshake', price: 150, desc: 'Thick, cold, made with real ice cream.', sort: 23 },
  { cat: 'Dessert', name: 'Oreo Madness', price: 175, desc: 'Cocoa sponge, chocolate sauce, sprinkles.', sort: 24 },
];

export const MENU_CATS = ['Appetizers', 'Platters', 'Steak', 'Soup', 'Salad and Pizza', 'Italian café', 'Dessert'];

export const MENU_CAT_IMAGES: Record<string, string> = {
  Appetizers: '/img/dish-crispy-fried-chicken.png',
  Platters: '/img/dish-teriyaki-chicken.png',
  Steak: '/img/dish-bbq-chicken-rice.png',
  Dessert: '/img/dish-oreo-madness.png',
};

export const MENU_CAT_NOTES: Record<string, string> = {
  Appetizers: 'Ordered first, finished before the platters land.',
  Platters: 'One plate, one person, rice included.',
  Steak: 'Flattened, grilled to order, gravy on the side.',
  Soup: 'Sent up hot in a covered bowl.',
  'Salad and Pizza': 'The lighter half of the list.',
  'Italian café': 'Danesi Emerald beans, shipped from Italy.',
  Dessert: 'Mövenpick ice cream, from Switzerland.',
};

export const GALLERY: GalleryItem[] = [
  { src: '/img/exterior-skyview-day.png', cat: 'Building', alt: 'Hotel Valentino from Main Road with the Sky View sign on the roof', sort: 1 },
  { src: '/img/lobby-reception.png', cat: 'Building', alt: 'Ground floor lobby with the reception desk at the far end', sort: 2 },
  { src: '/img/exterior-night-PLACEHOLDER.png', cat: 'Building', alt: 'Hotel entrance lit at night, placeholder image', sort: 3 },
  { src: '/img/room-single-deluxe.png', cat: 'Rooms', alt: 'Single Deluxe room with a sofa and a window over Main Road', sort: 4 },
  { src: '/img/room-couple-deluxe.png', cat: 'Rooms', alt: 'Couple Deluxe room with a double bed and dressing mirror', sort: 5 },
  { src: '/img/room-twin-deluxe.png', cat: 'Rooms', alt: 'Twin Deluxe room with two single beds', sort: 6 },
  { src: '/img/room-vip-suite.png', cat: 'Rooms', alt: 'VIP Suite with marble floor and a separate desk area', sort: 7 },
  { src: '/img/room-honeymoon-suite.png', cat: 'Rooms', alt: 'Honeymoon Suite with a king bed and brass lamps', sort: 8 },
  { src: '/img/room-executive-window.png', cat: 'Views', alt: 'Premium Executive Suite window over the town at sunrise', sort: 9 },
  { src: '/img/room-sunset-window.png', cat: 'Views', alt: 'Sunset over Noakhali town from a west facing room', sort: 10 },
  { src: '/img/dish-crispy-fried-chicken.png', cat: 'Sky View', alt: 'Crispy fried chicken on a stone plate at Sky View', sort: 11 },
  { src: '/img/dish-teriyaki-chicken.png', cat: 'Sky View', alt: 'Teriyaki chicken with fried rice and stir fried vegetables', sort: 12 },
  { src: '/img/dish-bbq-chicken-rice.png', cat: 'Sky View', alt: 'Barbecue chicken with fried rice, mushrooms and potato wedges', sort: 13 },
  { src: '/img/dish-oreo-madness.png', cat: 'Sky View', alt: 'Oreo Madness dessert plated with chocolate sauce', sort: 14 },
];

export const GALLERY_CATS = ['All', 'Building', 'Rooms', 'Views', 'Sky View'];

export const FACILITIES: Facility[] = [
  { en: '24-hour reception', bn: '২৪ ঘণ্টা রিসেপশন', copy: 'The desk is staffed all night. Arrive at 2am off the coach and someone checks you in.', sort: 1 },
  { en: '24-hour room service', bn: '২৪ ঘণ্টা রুম সার্ভিস', copy: 'The Sky View kitchen sends food down to the rooms whenever it is open, and the desk handles the rest.', sort: 2 },
  { en: 'Television', bn: 'টেলিভিশন', copy: 'Flat-screen television with cable in every category, from Single Deluxe upward.', sort: 3 },
  { en: 'Telephone', bn: 'টেলিফোন', copy: 'Direct line to reception in every room, so you are not hunting for a mobile signal.', sort: 4 },
  { en: 'Free parking', bn: 'ফ্রি পার্কিং', copy: 'Parking at the building for guests, no charge, no booking needed.', sort: 5 },
  { en: 'Free Wi-Fi', bn: 'ফ্রি ওয়াই-ফাই', copy: 'Wi-Fi in every room and in the lobby, included in the rate.', sort: 6 },
];

export const ROOM_INCLUDED = [
  'Tiled floor',
  'Hot and cold shower',
  'Mini fridge',
  'Flat-screen TV',
  'Free Wi-Fi',
  '24-hour room service',
  'Free parking',
  '24-hour reception',
];

/** Editable single values, exposed to the admin as site settings. */
export const SETTINGS: Record<string, string> = {
  phonePrimary: '+880 1795 855555',
  phoneSecondary: '+880 2334 491777',
  phoneLandline: '0321 71277',
  whatsapp: '8801795855555',
  addressLine1: 'Ahsan Bhaban (Shwapno Super Shop)',
  addressLine2: 'Guptanka, Main Road, Maijdee Court',
  addressLine3: 'Sadar, Noakhali-3800, Bangladesh',
  fromRate: '2,500',
  facebook: 'https://facebook.com/hotelvalentinobd',
  youtube: 'https://facebook.com/hotelvalentinobd',
  restaurantHours: 'CONFIRM WITH HOTEL',
  email: 'CONFIRM WITH CLIENT',
};

export const SEED_BOOKINGS: BookingRecord[] = [
  { id: 'HV-A92B1', name: 'Yousuf Faysal', mobile: '01795855555', email: 'yousuf@example.com', room: 'VIP Suite', rate: 20000, ci: '2026-08-21', co: '2026-08-23', status: 'Paid', date: '2026-07-28' },
  { id: 'HV-KLK32', name: 'Zarin Tasnim', mobile: '01712998877', email: 'zarin@example.com', room: 'Honeymoon Suite', rate: 16000, ci: '2026-08-01', co: '2026-08-03', status: 'Paid', date: '2026-07-28' },
  { id: 'HV-J9K8A', name: 'Tanvir Rahman', mobile: '01823112233', email: 'tanvir@example.com', room: 'Single Deluxe', rate: 5000, ci: '2026-08-05', co: '2026-08-07', status: 'Confirmed', date: '2026-07-27' },
  { id: 'HV-OPQ77', name: 'Nusrat Jahan', mobile: '01911445566', email: 'nusrat@example.com', room: 'Twin Deluxe', rate: 12000, ci: '2026-08-10', co: '2026-08-12', status: 'Paid', date: '2026-07-26' },
  { id: 'HV-WER90', name: 'Fahim Chowdhury', mobile: '01399887766', email: 'fahim@example.com', room: 'Premium Executive Suite', rate: 21000, ci: '2026-08-15', co: '2026-08-17', status: 'Pending', date: '2026-07-25' },
  { id: 'HV-Z8X9C', name: 'Ishrat Jahan', mobile: '01522334455', email: 'ishrat@example.com', room: 'Couple Deluxe', rate: 9000, ci: '2026-08-18', co: '2026-08-20', status: 'Paid', date: '2026-07-24' },
  { id: 'HV-B1N2M', name: 'Rashedul Islam', mobile: '01733445566', email: 'rashed@example.com', room: 'Triple Deluxe', rate: 22500, ci: '2026-08-22', co: '2026-08-25', status: 'Confirmed', date: '2026-07-23' },
  { id: 'HV-H7G6F', name: 'Sadia Afrin', mobile: '01844556677', email: 'sadia@example.com', room: 'Deluxe Four Bed', rate: 10000, ci: '2026-08-28', co: '2026-08-29', status: 'Paid', date: '2026-07-22' },
  { id: 'HV-T5R4E', name: 'Kamrul Hasan', mobile: '01955667788', email: 'kamrul@example.com', room: 'Single Deluxe', rate: 2500, ci: '2026-09-01', co: '2026-09-02', status: 'Pending', date: '2026-07-21' },
  { id: 'HV-Y2U3I', name: 'Mehedi Hasan', mobile: '01677889900', email: 'mehedi@example.com', room: 'VIP Suite', rate: 30000, ci: '2026-09-05', co: '2026-09-08', status: 'Paid', date: '2026-07-20' },
];

export const FOOTER_NAV = [
  { label: 'Rooms', href: '/rooms' },
  { label: 'Sky View Restaurant', href: '/restaurant' },
  { label: 'Facilities', href: '/facilities' },
  { label: 'Hall room and events', href: '/events' },
  { label: 'About the hotel', href: '/about' },
  { label: 'Explore Noakhali', href: '/explore' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Admin Panel', href: '/admin' },
];

export const POLICY_NAV = [
  { label: 'Terms of use', slug: 'terms' },
  { label: 'Booking terms', slug: 'booking-terms' },
  { label: 'Cancellation and refund', slug: 'cancellation-refund' },
  { label: 'Privacy', slug: 'privacy' },
];
