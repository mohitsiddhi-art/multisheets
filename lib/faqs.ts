// The FAQ answers live in their own module so both the server page
// (which adds FAQPage structured data for Google) and the accordion UI
// can read them without duplicating the copy.

export const FAQS = [
  {
    q: 'What is a PIN code?',
    a: 'A PIN (Postal Index Number) code is a 6-digit number used by India Post to sort and deliver mail. The first digit indicates the postal zone, the first two digits the sub-zone, the first three the sorting district, and the last three the individual delivery post office.',
  },
  {
    q: 'What is an IFSC code?',
    a: 'IFSC (Indian Financial System Code) is an 11-character alphanumeric code that uniquely identifies a bank branch for electronic fund transfers like NEFT, RTGS, and IMPS. The first four characters are the bank code, the fifth is always zero (reserved), and the last six identify the branch.',
  },
  {
    q: 'How many PIN codes are there in India?',
    a: 'There are over 160,000 post offices in India, sharing roughly 19,100 unique PIN codes. Our dataset covers over 17,700 PIN codes representing post offices across all states and union territories.',
  },
  {
    q: 'How many IFSC codes are there?',
    a: 'There are approximately 165,000 active bank branch IFSC codes in India across public sector banks, private banks, foreign banks, regional rural banks, and cooperative banks. Our dataset covers 164,000+ of them.',
  },
  {
    q: 'Is Multisheets free?',
    a: 'Yes, completely free. There is no signup, no login, and no payment required. We do not show ads and we do not track you.',
  },
  {
    q: 'Does the search include the Army Postal Service?',
    a: 'Yes. APS post offices use PIN codes starting with digit 9, and our dataset includes them.',
  },
  {
    q: 'How accurate is the data?',
    a: 'Our data is sourced from official India Post and RBI open datasets. We refresh it regularly and maintain a community-driven correction reporting system. If you find an error, please report it.',
  },
  {
    q: 'Does the site work in Hindi?',
    a: 'Yes. Use the EN/हिं button in the header to toggle between English and Hindi. All interface text is translated, and the site uses a Devanagari-capable font.',
  },
  {
    q: 'Can I use Multisheets offline?',
    a: 'Yes. Multisheets is a Progressive Web App (PWA). Once you install it on your phone, the core search works offline for your recent searches and cached results.',
  },
  {
    q: 'Are the speed post rates official?',
    a: 'The Speed Post rates shown are indicative figures based on published India Post tariffs. Actual charges may vary — always confirm with your local post office before dispatch.',
  },
]
