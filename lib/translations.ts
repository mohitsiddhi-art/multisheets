/**
 * Multisheets.com — UI translations (English / Hindi)
 * Shared client-side dictionary. `useLang()` hook in `components/LangProvider`.
 */

export type Lang = 'en' | 'hi'

export type Dict = {
  appName: string
  tagline: string
  searchPlaceholder: string
  searchButton: string
  filters: {
    all: string
    ifsc: string
    bank: string
    pincode: string
    location: string
  }
  nav: { home: string; search: string; tools: string; blog: string; quiz: string; faq: string; about: string }
  toolsTitle: string
  toolPincodeFinder: string
  toolIfscFinder: string
  toolPincodeFinderDesc: string
  toolIfscFinderDesc: string
  toolSpeedPost: string
  toolSpeedPostDesc: string
  toolPinValidator: string
  toolIfscValidator: string
  toolPinValidatorDesc: string
  toolIfscValidatorDesc: string
  resultsFound: (n: number) => string
  noResults: string
  tryDifferent: string
  trending: string
  recent: string
  favorites: string
  copy: string
  copied: string
  share: string
  viewDetails: string
  pincode: string
  ifscCode: string
  officeName: string
  officeType: string
  delivery: string
  district: string
  state: string
  circle: string
  region: string
  division: string
  bankName: string
  branchName: string
  address: string
  contact: string
  micr: string
  city: string
  bankType: string
  services: string
  neft: string
  rtgs: string
  imps: string
  upi: string
  swift: string
  relatedPincode: string
  banksAtPincode: string
  sourceUpdated: string
  reportCorrection: string
  notFound: string
  notFoundDesc: string
  backToSearch: string
  keyboardHint: string
  voiceSearch: string
  clearAll: string
  browseTools: string
  learnMore: string
  quickLinks: string
  popularTools: string
  legal: string
  company: string
  explore: string
  browseStates: string
  addressValidator: string
  postalQuiz: string
  postalHolidays: string
  postalDashboard: string
  indiaPostNews: string
  scamAlert: string
  privacyPolicy: string
  termsOfService: string
  aboutUs: string
  contactUs: string
  faqTitle: string
  disclaimer: string
  report: string
  followUs: string
  rightsReserved: string
  views: string
  copies: string
  month: string
  year: string
}

const en: Dict = {
  appName: 'Multisheets',
  tagline: 'Find Indian PIN codes & IFSC codes instantly',
  searchPlaceholder: 'Search PIN code, IFSC, bank, branch, district, state…',
  searchButton: 'Search',
  filters: {
    all: 'All',
    ifsc: 'IFSC',
    bank: 'Bank',
    pincode: 'Pincode',
    location: 'Location',
  },
  nav: {
    home: 'Home',
    search: 'Search',
    tools: 'Tools',
    blog: 'Blog',
    quiz: 'Quiz',
    faq: 'FAQ',
    about: 'About',
  },
  toolsTitle: 'Popular Tools',
  toolPincodeFinder: 'PIN Code Finder',
  toolIfscFinder: 'IFSC Code Finder',
  toolPincodeFinderDesc: 'Find post office details, district and delivery status',
  toolIfscFinderDesc: 'Find bank branch details, MICR and contact info',
  toolSpeedPost: 'Speed Post Calculator',
  toolSpeedPostDesc: 'Estimate Speed Post rates by weight and zone',
  toolPinValidator: 'PIN Code Validator',
  toolIfscValidator: 'IFSC Code Validator',
  toolPinValidatorDesc: 'Validate and format Indian PIN codes',
  toolIfscValidatorDesc: 'Validate IFSC and read its meaning',
  resultsFound: (n) => (n === 1 ? '1 result found' : `${n} results found`),
  noResults: 'No results found for',
  tryDifferent: 'Try a different keyword, a 6-digit PIN, or an 11-character IFSC code.',
  trending: 'Trending',
  recent: 'Recent Searches',
  favorites: 'Saved',
  copy: 'Copy',
  copied: 'Copied!',
  share: 'Share',
  viewDetails: 'View Details',
  pincode: 'PIN Code',
  ifscCode: 'IFSC Code',
  officeName: 'Office Name',
  officeType: 'Office Type',
  delivery: 'Delivery',
  district: 'District',
  state: 'State',
  circle: 'Circle',
  region: 'Region',
  division: 'Division',
  bankName: 'Bank',
  branchName: 'Branch',
  address: 'Address',
  contact: 'Contact',
  micr: 'MICR',
  city: 'City',
  bankType: 'Bank Type',
  services: 'Service Availability',
  neft: 'NEFT',
  rtgs: 'RTGS',
  imps: 'IMPS',
  upi: 'UPI',
  swift: 'SWIFT',
  relatedPincode: 'Related PIN Code',
  banksAtPincode: 'Banks at this PIN code',
  sourceUpdated: 'Source & Updates',
  reportCorrection: 'Report a correction',
  notFound: 'Not found',
  notFoundDesc: 'We could not find this record. Please check the code and try again.',
  backToSearch: 'Back to Search',
  keyboardHint: 'Press / anytime to search',
  voiceSearch: 'Voice Search',
  clearAll: 'Clear',
  browseTools: 'Browse all tools',
  learnMore: 'Learn more',
  quickLinks: 'Quick Links',
  popularTools: 'Popular Tools',
  legal: 'Legal',
  company: 'Company',
  explore: 'Explore',
  browseStates: 'Browse States',
  addressValidator: 'Address Validator',
  postalQuiz: 'Postal Quiz',
  postalHolidays: '2026 Postal Holidays',
  postalDashboard: 'Postal Dashboard',
  indiaPostNews: 'India Post News',
  scamAlert: 'Scam Alert',
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service',
  aboutUs: 'About Us',
  contactUs: 'Contact',
  faqTitle: 'FAQ',
  disclaimer: 'Disclaimer',
  report: 'Report Correction',
  followUs: 'Follow us',
  rightsReserved: 'All rights reserved.',
  views: 'views',
  copies: 'copies',
  month: 'month',
  year: 'year',
}

const hi: Dict = {
  appName: 'मल्टीशीट्स',
  tagline: 'भारतीय पिन कोड और आईएफएससी कोड तुरंत खोजें',
  searchPlaceholder: 'पिन कोड, आईएफएससी, बैंक, शाखा, जिला, राज्य खोजें…',
  searchButton: 'खोजें',
  filters: {
    all: 'सभी',
    ifsc: 'आईएफएससी',
    bank: 'बैंक',
    pincode: 'पिन कोड',
    location: 'स्थान',
  },
  nav: {
    home: 'होम',
    search: 'खोज',
    tools: 'टूल्स',
    blog: 'ब्लॉग',
    quiz: 'क्विज़',
    faq: 'सवाल',
    about: 'हमारे बारे में',
  },
  toolsTitle: 'लोकप्रिय टूल्स',
  toolPincodeFinder: 'पिन कोड खोजक',
  toolIfscFinder: 'आईएफएससी कोड खोजक',
  toolPincodeFinderDesc: 'पोस्ट ऑफिस विवरण, जिला और डिलीवरी स्थिति खोजें',
  toolIfscFinderDesc: 'बैंक शाखा विवरण, MICR और संपर्क जानकारी खोजें',
  toolSpeedPost: 'स्पीड पोस्ट कैलकुलेटर',
  toolSpeedPostDesc: 'वजन और क्षेत्र के अनुसार स्पीड पोस्ट दरें जानें',
  toolPinValidator: 'पिन कोड वैलिडेटर',
  toolIfscValidator: 'आईएफएससी वैलिडेटर',
  toolPinValidatorDesc: 'भारतीय पिन कोड मान्य करें और फॉर्मेट करें',
  toolIfscValidatorDesc: 'आईएफएससी मान्य करें और उसका अर्थ जानें',
  resultsFound: (n) => (n === 1 ? '1 परिणाम मिला' : `${n} परिणाम मिले`),
  noResults: 'के लिए कोई परिणाम नहीं मिला',
  tryDifferent: 'कोई और कीवर्ड, 6 अंकों का पिन, या 11 अक्षरों का आईएफएससी आज़माएं।',
  trending: 'लोकप्रिय खोज',
  recent: 'हाल की खोजें',
  favorites: 'सहेजे गए',
  copy: 'कॉपी',
  copied: 'कॉपी हो गया!',
  share: 'शेयर',
  viewDetails: 'विवरण देखें',
  pincode: 'पिन कोड',
  ifscCode: 'आईएफएससी कोड',
  officeName: 'कार्यालय का नाम',
  officeType: 'कार्यालय प्रकार',
  delivery: 'डिलीवरी',
  district: 'जिला',
  state: 'राज्य',
  circle: 'सर्कल',
  region: 'क्षेत्र',
  division: 'डिवीज़न',
  bankName: 'बैंक',
  branchName: 'शाखा',
  address: 'पता',
  contact: 'संपर्क',
  micr: 'MICR',
  city: 'शहर',
  bankType: 'बैंक प्रकार',
  services: 'सेवा उपलब्धता',
  neft: 'NEFT',
  rtgs: 'RTGS',
  imps: 'IMPS',
  upi: 'UPI',
  swift: 'SWIFT',
  relatedPincode: 'संबंधित पिन कोड',
  banksAtPincode: 'इस पिन कोड पर बैंक',
  sourceUpdated: 'स्रोत और अपडेट',
  reportCorrection: 'त्रुटि की रिपोर्ट करें',
  notFound: 'नहीं मिला',
  notFoundDesc: 'हमें यह रिकॉर्ड नहीं मिला। कृपया कोड जांचें और फिर प्रयास करें।',
  backToSearch: 'खोज पर वापस',
  keyboardHint: 'खोजने के लिए कभी भी / दबाएं',
  voiceSearch: 'वॉइस खोज',
  clearAll: 'साफ़ करें',
  browseTools: 'सभी टूल्स देखें',
  learnMore: 'और जानें',
  quickLinks: 'त्वरित लिंक',
  popularTools: 'लोकप्रिय टूल्स',
  legal: 'कानूनी',
  company: 'कंपनी',
  explore: 'और देखें',
  browseStates: 'सभी राज्य',
  addressValidator: 'पता वैलिडेटर',
  postalQuiz: 'पोस्टल क्विज़',
  postalHolidays: '2026 डाक अवकाश',
  postalDashboard: 'पोस्टल डैशबोर्ड',
  indiaPostNews: 'इंडिया पोस्ट समाचार',
  scamAlert: 'धोखाधड़ी चेतावनी',
  privacyPolicy: 'प्राइवेसी पॉलिसी',
  termsOfService: 'सेवा की शर्तें',
  aboutUs: 'हमारे बारे में',
  contactUs: 'संपर्क',
  faqTitle: 'अक्सर पूछे जाने वाले सवाल',
  disclaimer: 'अस्वीकरण',
  report: 'त्रुटि रिपोर्ट',
  followUs: 'हमें फॉलो करें',
  rightsReserved: 'सर्वाधिकार सुरक्षित।',
  views: 'व्यूज़',
  copies: 'कॉपी',
  month: 'महीना',
  year: 'साल',
}

export const dictionaries: Record<Lang, Dict> = { en, hi }

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिंदी' },
]