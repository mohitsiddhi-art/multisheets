import type { Metadata } from 'next'
import Link from 'next/link'
import { findAllPincodes, findAllBranchesByPincode } from '@/lib/india-data'

const PIN = '331803'

export const metadata: Metadata = {
  title: 'Sri Dungargarh — City Guide, PIN 331803 | Multisheets',
  description:
    'Complete Sri Dungargarh guide (Bikaner, Rajasthan): schools, hospitals, temples, street food, heritage, nearby places, banks & IFSC codes, railway station, PIN 331803, developments and future plans.',
  keywords: [
    'Sri Dungargarh', 'Dungargarh', '331803', 'Sri Dungargarh city guide',
    'Sri Dungargarh schools', 'Sri Dungargarh hospitals', 'Sri Dungargarh banks',
    'Sri Dungargarh railway station', 'Sri Dungargarh temples', 'Sri Dungargarh PIN code',
  ].join(', '),
}

export default async function SriDungargarhPage() {
  const offices = findAllPincodes(PIN)
  const banks = findAllBranchesByPincode(PIN)

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/pincode/331803" className="hover:text-primary transition">331803</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-50 font-medium">Sri Dungargarh Guide</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300">
              📍 City Guide
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
              Bikaner • Rajasthan
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            Sri Dungargarh
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            A complete guide to Sri Dungargarh — the desert town of Bikaner district with rich
            heritage, growing infrastructure, and every facility you need, from schools and hospitals
            to banks and railway connectivity.
          </p>
        </header>

        {/* Quick facts */}
        <section className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickFact label="PIN Code" value="331803" href="/pincode/331803" />
            <QuickFact label="State" value="Rajasthan" />
            <QuickFact label="District" value="Bikaner" />
            <QuickFact label="Division" value="Bikaner Division" />
          </div>
        </section>

        {/* 1. Overview */}
        <Section title="1. Overview & History" icon="🏘️">
          <p>
            <strong>Sri Dungargarh</strong> (often called just <em>Dungargarh</em>) is a town and
            municipal area in the <strong>Bikaner district</strong> of Rajasthan, lying in the heart
            of the Thar Desert region. It functions as an important sub-divisional headquarters and a
            trading hub for the surrounding rural belt.
          </p>
          <p>
            The town&apos;s importance comes from its position on major road and rail corridors linking
            Bikaner with the rest of Rajasthan, making it a natural marketplace for agricultural
            produce, wool, and local handicrafts. Over the years it has grown from a small desert
            settlement into a modern town with banks, colleges, hospitals, and growing commerce while
            still holding onto its traditional Rajasthani character.
          </p>
          <p>
            Multiples post offices serve the town and surrounding villages, all under{' '}
            <Link href="/pincode/331803" className="text-primary hover:underline">PIN code 331803</Link>.
          </p>
        </Section>

        {/* 2. Location & Boundaries */}
        <Section title="2. Location & Boundaries" icon="🗺️">
          <p>
            Sri Dungargarh is located in the <strong>northeastern part of Bikaner district</strong>,
            on the road and rail route towards Churu and Jhunjhunu. The town is roughly{' '}
            <strong>60–80 km from Bikaner city</strong>, depending on route.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>North-east:</strong> Chamu, and further on towards Churu district — noted for its painted Havelis.</li>
            <li><strong>South: </strong>towards Nokha tehsil and Deshnoke (home of the famous Karni Mata rat temple).</li>
            <li><strong>West: </strong>Bikaner city, the district headquarters.</li>
            <li><strong>East: </strong>the Churu/Shekhawati region — renowned for frescoed havelis and heritage towns.</li>
          </ul>
          <p>
            Administratively, the area falls under the <strong>Bikaner Division</strong> and the{' '}
            <strong>Bikaner postal region</strong>. Surrounding villages such as Punrasar and
            Gusa (Gusaisar) also share the local PIN network.
          </p>
        </Section>

        {/* 3. Schools & Education */}
        <Section title="3. Schools & Education" icon="🎓">
          <p>
            Sri Dungargarh is an educational hub for students from nearby villages. Families have a
            mix of government and private options:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Government senior secondary schools</strong> — affordable, CBSE/RBSE curriculum for classes up to XII.</li>
            <li><strong>Private English-medium schools</strong> — from kindergarten to senior secondary, popular with working families.</li>
            <li><strong>Girls&apos; schools</strong> — dedicated government and private girls&apos; institutions.</li>
            <li><strong>Higher education</strong> — degree and college courses, plus professional coaching centres for JEE/NEET/RAS aspirants.</li>
            <li><strong>Board & tuition centres</strong> — for RBSE and CBSE preparation.</li>
          </ul>
          <div className="mt-4 p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 text-sm text-slate-700 dark:text-slate-300">
            💡 Parents moving to Sri Dungargarh generally enrol children in the private English-medium
            schools in the main market area; government schools are the low-cost option and remain
            widely used across the surrounding villages.
          </div>
        </Section>

        {/* 4. Hospitals & Healthcare */}
        <Section title="4. Hospitals & Healthcare" icon="🏥">
          <p>
            The town has a functional public health network and a growing number of private clinics:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Government hospital (CHC/PHC)</strong> — primary care, maternity ward, and basic emergency services for the town and nearby villages.</li>
            <li><strong>Private nursing homes & clinics</strong> — general physicians, gynaecology, paediatrics, and a few multi-specialty setups.</li>
            <li><strong>Pathology & diagnostic labs</strong> — blood tests, X-ray, and ultrasound services in the market area.</li>
            <li><strong>Pharmacies / medical stores</strong> — multiple outlets stocking common medicines day and night.</li>
          </ul>
          <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-slate-700 dark:text-slate-300">
            🚑 For serious or specialised treatment, most families travel to{' '}
            <strong>Bikaner</strong> (PBM Hospital, AIIMS-II Bikaner) or further to Jaipur.
            Ambulance services and road connectivity make the 60–80 km trip feasible in emergencies.
          </div>
        </Section>

        {/* 5. Food & Street Food */}
        <Section title="5. Food & Street Food" icon="🍛">
          <p>
            Like the rest of the Shekhawati–Bikaner belt, Sri Dungargarh loves its spicy, savoury
            Rajasthani fare. Streetside shops around the main market and near the bus/rail stand are
            always busy:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Bikaneri bhujia & namkeen</strong> — the region&apos;s pride; local shops make it fresh.</li>
            <li><strong>Kachori & samosa</strong> — piping hot with imli-tamarind and mint chutney, especially in the morning.</li>
            <li><strong>Dal-baati-churma & gatte ki sabzi</strong> — the classic Rajasthani thali at local restaurants.</li>
            <li><strong>Ker-sangri</strong> — a desert delicacy made from local berries and beans.</li>
            <li><strong>Lassi & chaas (buttermilk)</strong> — staple coolers in the desert heat.</li>
            <li><strong>Mirchi vada & pakoras</strong> — evening tea-time favourites.</li>
          </ul>
          <p>
            During local melas (fairs) and festivals, temporary food stalls line the streets serving
            these same dishes along with sweets like <em>ghevar</em>, <em>mawa</em>, and{' '}
            <em>churma ladoo</em>.
          </p>
        </Section>

        {/* 6. Temples & Religious Places */}
        <Section title="6. Temples & Religious Places" icon="🛕">
          <p>
            Religion and tradition run deep here. The town has numerous temples that draw devotees
            daily and during festivals:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Old-town Hindu temples</strong> — dedicated to Shiva, Hanuman, and Shakti, many of them over a century old.</li>
            <li><strong>Jain temples</strong> — the Bikaner belt has a strong Jain community; the town&apos;s Jain shrines are noted for their calm atmosphere and ornately carved interiors.</li>
            <li><strong>Shri Dungargarh local deity shrines</strong> — folk deities like Pabuji / Tejaji are worshipped widely across the villages around the town.</li>
            <li><strong>Deshnoke — Karni Mata Temple</strong> (~30–50 km away) — the world-famous rat temple of Rajasthan and a major pilgrim stop for anyone in the region.</li>
            <li><strong>Chamu / Nokha temples</strong> — annual fairs in these tehsils draw large crowds.</li>
          </ul>
        </Section>

        {/* 7. Heritage */}
        <Section title="7. Heritage & Local Attractions" icon="🏯">
          <p>
            While Sri Dungargarh is not a heavily promoted tourist town, it sits at the edge of the
            <strong> Shekhawati heritage region</strong> and shares that region&apos;s charm:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Traditional havelis</strong> — merchant mansions with painted façades, reminiscent of the grand Shekhawati havelis.</li>
            <li><strong>Historic stepwells (baoris)</strong> — used for centuries as community water sources.</li>
            <li><strong>Old market lanes</strong> — narrow streets with century-old shops selling spices, textiles, and silver.</li>
            <li><strong>Desert craft</strong> — local embroidered shoes (jutis), rugs, and lac jewellery available cheaply.</li>
          </ul>
          <p>
            A short drive north-east takes you into <strong>Shekhawati</strong> — the open-air art
            gallery of India — for fresco-covered mansions at Chamu, Ratangarh, and Fatehpur.
          </p>
        </Section>

        {/* 8. Nearby Places to Visit */}
        <Section title="8. Nearby Places to Visit" icon="🧭">
          <div className="space-y-3">
            <NearbyPlace
              name="Bikaner City"
              dist="~60–80 km"
              desc="Junagarh Fort, Lalgarh Palace, Karni Singh's Camel Research Farm, National Research Centre on Camel, and the famous Bhujia."
            />
            <NearbyPlace
              name="Deshnoke — Karni Mata Temple"
              dist="~30–50 km"
              desc="Rajasthan's most famous rat temple — a must-visit pilgrim and tourist destination."
            />
            <NearbyPlace
              name="Nokha"
              dist="~30 km"
              desc="A bustling sub-divisional town and market centre on the Bikaner road."
            />
            <NearbyPlace
              name="Shekhawati Towns (Chamu, Ratangarh, Fatehpur)"
              dist="~40–80 km"
              desc="The 'open-air art gallery of India' — painted havelis and frescos."
            />
            <NearbyPlace
              name="Churu"
              dist="~80–110 km"
              desc="Heritage city with exquisite painted havelis and one of Asia's cleanest railway stations."
            />
          </div>
        </Section>

        {/* 9. Banks & Financial Services */}
        <Section title="9. Banks & IFSC Codes" icon="🏦">
          <p>
            Sri Dungargarh is well served by banks. A total of{' '}
            <strong>{banks.length} bank branches</strong> operate under PIN {PIN} — a convenient mix
            of public, private, and small-finance banks:
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {banks.map((b) => (
              <Link
                key={b.ifsc}
                href={`/ifsc/${b.ifsc}`}
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M3 21h18" />
                    <path d="M3 10h18" />
                    <path d="M5 6l7-3 7 3" />
                    <path d="M4 10v11M20 10v11" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 dark:text-slate-50 group-hover:text-primary transition truncate">
                    {b.bank_name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {b.branch_name} • {b.city}, {b.state}
                  </p>
                  <p className="text-xs font-mono text-slate-400 dark:text-slate-500">{b.ifsc}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
            Click any branch for full details — address, MICR, NEFT/RTGS/IMPS/UPI support, and contact.
          </p>
        </Section>

        {/* 10. Railway & Transport */}
        <Section title="10. Railway Station & Connectivity" icon="🚉">
          <p>
            <strong>Sri Dungargarh railway station</strong> connects the town to the region and
            beyond. Select passenger and express services pass through, linking to:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Bikaner Junction</strong> — the main hub for onward trains to Delhi, Jaipur, Jodhpur, and beyond.</li>
            <li><strong>Churu / Ratangarh</strong> — the corridor towards Sikar, Jhunjhunu, and Delhi side.</li>
            <li><strong>Local passenger trains</strong> — used daily by commuters and students.</li>
          </ul>
          <p>
            By road, the town sits on the main highway corridor through the Bikaner–Churu belt. State
            and private buses run frequently to Bikaner, and taxi/auto services cover the last-mile
            into neighbouring villages.
          </p>
        </Section>

        {/* 11. Amenities & Requirements */}
        <Section title="11. Town Amenities & Common Requirements" icon="🛠️">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Postal services</strong> — post offices under PIN 331803 (see{' '}
              <Link href="/pincode/331803" className="text-primary hover:underline">post office details</Link>).</li>
            <li><strong>Markets</strong> — daily grocery, vegetable and grain markets plus weekly haats in surrounding villages.</li>
            <li><strong>ATMs & UPI</strong> — cash machines and digital payment support from the banks listed above.</li>
            <li><strong>Petrol pumps & vehicle repair</strong> — along the main highway.</li>
            <li><strong>Water & electricity</strong> — civic supply, with borewells and tanker delivery common in summer.</li>
            <li><strong>Police station & courts</strong> — the town is a sub-divisional seat with the usual civic offices.</li>
          </ul>
          <div className="mt-4 p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 text-sm text-slate-700 dark:text-slate-300">
            📝 New residents should keep a photocopy of address proof (ration card, electricity bill)
            handy — it is needed for school admission, bank account opening, and LPG cylinder booking.
          </div>
        </Section>

        {/* 12. Q&A */}
        <Section title="12. Questions & Answers" icon="❓">
          <Faq q="What is the PIN code of Sri Dungargarh?">
            <p>The PIN code is <strong>331803</strong>. See all the{' '}
              <Link href="/pincode/331803" className="text-primary hover:underline">post offices under 331803</Link>.</p>
          </Faq>
          <Faq q="Which district and state is Sri Dungargarh in?">
            <p>Sri Dungargarh is in <strong>Bikaner district, Rajasthan</strong>. It falls under the Bikaner Division of India Post.</p>
          </Faq>
          <Faq q="Does Sri Dungargarh have a railway station?">
            <p>Yes. <strong>Sri Dungargarh railway station</strong> connects the town to Bikaner, Churu, and onward to Delhi/Jaipur.</p>
          </Faq>
          <Faq q="Which banks are available in Sri Dungargarh?">
            <p>Public, private, and small-finance banks operate here, including <strong>State Bank of India, Bank of Baroda, Punjab National Bank, HDFC, Axis, Yes, IndusInd, and AU Small Finance Bank</strong> — view all{' '}
              <Link href="/pincode/331803" className="text-primary hover:underline">branches at 331803</Link>.</p>
          </Faq>
          <Faq q="Is Sri Dungargarh good for schooling?">
            <p>The town has government and private schools up to senior secondary level, and it serves as an education hub for neighbouring villages. Competitive-coaching centres are available for higher studies.</p>
          </Faq>
          <Faq q="Where do people go for major medical treatment?">
            <p>For routine care, the town&apos;s government hospital and private clinics suffice. For major or specialised treatment, people travel to <strong>Bikaner</strong> (~60–80 km, access to higher multi-specialty and govt hospitals).</p>
          </Faq>
          <Faq q="How far is the famous Karni Mata (rat) temple?">
            <p>The Karni Mata Temple at <strong>Deshnoke</strong> is roughly 30–50 km from Sri Dungargarh and is a common excursion from the town.</p>
          </Faq>
        </Section>

        {/* 13. Developments & Future */}
        <Section title="13. Developments & Future Outlook" icon="🚀">
          <p>
            Sri Dungargarh is on an upward curve, driven by a few solid trends:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Road & rail improvement</strong> — ongoing highway upgrades on the Bikaner–Churu corridor are cutting travel times to both Delhi side and Bikaner city.</li>
            <li><strong>Banking & digital penetration</strong> — with 12+ branches and strong UPI adoption, the town is financially connected to the rest of India.</li>
            <li><strong>Education infrastructure</strong> — growing private schooling and coaching options are keeping young families in town rather than moving to bigger cities.</li>
            <li><strong>Local economy</strong> — agriculture, wool, and the surrounding desert belt continue to fuel trade; renewable energy (solar) projects are increasingly present across Rajasthan&apos;s desert districts.</li>
            <li><strong>Nearby megaprojects</strong> — Bikaner&apos;s development (new medical colleges, smart-city style works, and rail upgrades) indirectly benefits the sub-divisional towns around it.</li>
          </ul>
          <p>
            As rural-to-town migration continues and connectivity improves, Sri Dungargarh is expected
            to grow as a comfortable small-city alternative to Bikaner — with lower cost of living and
            the same access to desert life.
          </p>
        </Section>

        {/* CTAs */}
        <Section title="Useful Links" icon="🔗">
          <div className="flex flex-wrap gap-3">
            <Link href="/pincode/331803" className="px-5 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition">
              📮 Post Offices at 331803
            </Link>
            <Link href="/search" className="px-5 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-xl font-medium hover:bg-primary hover:text-white transition">
              🔍 Search more PIN / IFSC
            </Link>
            <Link href="/tools/bank-locator" className="px-5 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-xl font-medium hover:bg-primary hover:text-white transition">
              🏦 Bank Locator
            </Link>
          </div>
        </Section>
      </div>
    </div>
  )
}

// ---------------- helpers
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  )
}

function QuickFact({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <>
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="font-mono font-semibold text-slate-900 dark:text-slate-50">{value}</p>
    </>
  )
  return href ? (
    <Link
      href={href}
      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-md transition"
    >
      {inner}
    </Link>
  ) : (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{inner}</div>
  )
}

function NearbyPlace({ name, dist, desc }: { name: string; dist: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 flex-shrink-0 mt-0.5">
        {dist}
      </span>
      <div>
        <p className="font-semibold text-slate-900 dark:text-slate-50">{name}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
    </div>
  )
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="border border-slate-100 dark:border-slate-700 rounded-xl p-4">
      <p className="font-medium text-slate-900 dark:text-slate-50 mb-2">{q}</p>
      <div className="text-slate-600 dark:text-slate-400">{children}</div>
    </div>
  )
}