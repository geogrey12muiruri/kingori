Dr. King'ori --- Conversation Catalogue & Content Model
Document type: Content catalogue and implementation reference
Source: User-provided Dr. King'ori YouTube playlist text
Status: Initial catalogue; metadata and category assignments require
editorial verification
1. Purpose
This document defines a workable content structure for a
conversation-led website where visitors can discover episodes by
subject, search by title or guest, and open the original media.

The catalogue below preserves the order and source wording of the
supplied playlist as far as the extracted text allows. It is an
inventory, not a claim that all metadata has been independently
verified.
2. Source inventory and limitations
- 181 visible playlist entries were identified in the supplied
  text.
- The source states that 2 unavailable videos are hidden; those
  entries are not included because their titles and metadata are not
  available in the supplied text.
- The text usually includes a duration and a title line. Some title
  lines use || to separate the episode title from guest name(s);
  others do not. Where the source did not clearly separate a guest,
  the catalogue records that fact rather than guessing.
- The channel label shown in the source is generally
  Dr. King'ori (Felixe JaSiaya).
- The supplied text does not consistently include video URLs/IDs,
  publication dates, descriptions, thumbnails, or confirmed topic
  categories.
- Category suggestions in this document are a proposed editorial
  taxonomy. They are not categories provided by the source playlist.
3. Recommended content model
3.1 Conversation record
Use one record per episode. Keep the original playlist order as metadata
rather than using it as the permanent identifier.
{
  id: "wealth-by-exposure",
  title: "Wealth By Exposure",
  guests: ["Bob Mwiti"],
  durationSeconds: 5129,

  categories: ["money-wealth"],
  tags: ["wealth", "financial-education"],

  platform: "youtube",
  videoId: null,
  url: null,
  thumbnail: null,

  playlistOrder: 1,
  featured: false,
  publishedAt: null
}
This is an illustrative schema example. The sample category and tag are
proposed values and must be reviewed before being treated as final
metadata. The null fields are intentionally unfilled because the
supplied text does not verify them.
3.2 Field definitions
  Field                   Type                    Purpose
  id                    string                  Stable, URL-friendly
                                                  identifier; should not
                                                  depend on the current
                                                  playlist position

  title                 string                  Episode title,
                                                  preserving source
                                                  wording

  guests                array of strings        Supports one or
                                                  multiple guests

  durationSeconds       integer or null         Normalized duration for
                                                  display and sorting

  categories            array of category slugs Allows an episode to
                                                  appear in multiple
                                                  relevant categories

  tags                  array of strings        More specific search
                                                  terms and editorial
                                                  descriptors

  platform              string                  Source platform, such
                                                  as YouTube or Spotify

  videoId               string or null          Verified platform
                                                  identifier when
                                                  available

  url                   string or null          Verified canonical
                                                  episode URL

  thumbnail             string or null          Approved local image
                                                  path or verified image
                                                  URL

  playlistOrder         integer                 Original order in the
                                                  supplied playlist

  featured              boolean                 Editorial control for
                                                  homepage or featured
                                                  collections

  publishedAt           date string or null     Publication date, only
                                              when verified
3.3 Category record
{
  id: "money-wealth",
  name: "Money & Wealth",
  description: "Personal finance, investing, debt, saving, wealth and poverty."
}
Categories should live in their own data module. Do not scatter category
names or category-specific conditions throughout the HTML and
JavaScript.
3.4 Data rules
1. One episode has one canonical record, even if it belongs to several
   categories.
2. Use stable IDs; do not use playlist order as the ID.
3. Preserve source titles until an editor explicitly approves a
   display-title change.
4. Store durations as seconds; format them for display in the
   interface.
5. Use arrays for guests, categories, and tags.
6. Leave unknown values null or explicitly unverified; do not invent
   URLs, dates, guests, or image paths.
7. Keep source inventory and editorial metadata distinct so later
   corrections are traceable.
8. Verify every destination URL and image before publishing a clickable
   card.
4. Proposed category taxonomy
These are proposed starting categories. An editor should review and
assign them to episodes; an episode may belong to more than one
category.
  Slug                      Category                Intended coverage
  money-wealth            Money & Wealth          Personal finance,
                                                    investing, debt,
                                                    saving, wealth and
                                                    poverty

  business-enterprise     Business & Enterprise   Entrepreneurship, small
                                                    businesses, trade and
                                                    industries

  careers-opportunity     Careers & Opportunity   Employment,
                                                    professional growth,
                                                    skills and economic
                                                    mobility

  politics-power          Politics & Power        Leadership, public
                                                    policy, elections,
                                                    governance and
                                                    political influence

  society-justice         Society & Justice       Inequality, crime,
                                                    institutions, public
                                                    accountability and
                                                    social issues

  health-behaviour        Health & Human          Physical health,
                            Behaviour               psychology,
                                                    neuroscience and human
                                                    behaviour

  relationships-life      Relationships & Life    Marriage, family,
                                                    personal development
                                                    and life experiences

  faith-spirituality      Faith & Spirituality    Religion, spirituality,
                                                    belief and questions
                                                    about meaning

  technology-innovation   Technology & Innovation Technology,
                                                    engineering, digital
                                                    media and emerging
                                                    ideas

  culture-identity        Culture & Identity      Music, entertainment,
                                                    media, identity and
                                                cultural experiences
Category assignment policy
- Assign a category based on the substance of the conversation, not
  only a keyword in the title.
- Use a primary category for the strongest subject and optional
  secondary categories when they materially improve discovery.
- Use tags for narrower themes, people, industries, or concepts that
  do not need their own top-level category.
- Leave ambiguous episodes unclassified until editorial review.
- Revisit category boundaries after the initial catalogue has been
  reviewed.
5. Playlist catalogue
The following list preserves the order found in the supplied playlist.
The Guest(s) as separated in source column is only parsed when the
title line contains ||. If the source did not clearly separate a
guest, the original title line is retained and the guest is marked as
not separately identified.
          Order Duration      Episode title as  Guest(s) as      Category
                              listed            separated in     status
                                                source           
              1 1:25:29       Wealth By         Bob Mwiti        Pending
                              Exposure                           editorial
                                                                 review

              2 1:22:19       When Does         Dr. Stanley      Pending
                              Medicine Make     Mwenda Aruyaru   editorial
                              Cents?                             review

              3 1:21:43       Poverty By Ego    Andrew Muthee    Pending
                                                Gitau            editorial
                                                                 review

              4 1:42:12       What Happens at   Dr. Mwaka        Pending
                              3AM?                               editorial
                                                                 review

              5 1:30:17       Systemic Poverty  Jimi Wanjigi     Pending
                              Explained                          editorial
                                                                 review

              6 1:06:52       The Psychology of Juliani          Pending
                              Poverty                            editorial
                                                                 review

              7 54:16         Employment for    Not separately   Pending
                              Who? Purity Odawa identified in    editorial
                                                source           review

              8 47:32         Lump sum VS       Gabriel Maketh   Pending
                              Growing Money                      editorial
                                                                 review

              9 1:29:59       Getting Rich by   Dr. George       Pending
                              Lifestyle         Wachiuri         editorial
                                                                 review

             10 1:34:49       Young Money       Khalif Kairo     Pending
                              Problems                           editorial
                                                                 review

             11 1:32:53       How Legit are     John Mbui        Pending
                              Money Market                       editorial
                              Funds?                             review

             12 1:26:31       Principles Vs     Martha Karua     Pending
                              Dirty Money                        editorial
                                                                 review

             13 2:28:50       The Lie About     Nick mwendwa     Pending
                              Small Businesses                   editorial
                                                                 review

             14 1:44:00       The Lie Bankers   Naftaly Mwangi   Pending
                              Live                               editorial
                                                                 review

             15 2:47:35       Witchcraft &      Apostle Ndura    Pending
                              Political Power   Waruinge         editorial
                                                                 review

             16 1:57:28       This Will Reset   Dr. Keith Dindi  Pending
                              Your Life                          editorial
                                                                 review

             17 1:28:46       The Biology of    Dr. Bundi Karau  Pending
                              Happiness                          editorial
                                                                 review

             18 1:56:19       Blood Money:      Ali Said Ali     Pending
                              Inside the Red                     editorial
                              Sea Smuggling                      review
                              Trade                              

             19 2:05:47       The Curse of The  Dr. Isaac Kalua  Pending
                              First Million     Green            editorial
                                                                 review

             20 1:31:55       The Problem With  Ed Thiong'o      Pending
                              Too Much                           editorial
                              Employment                         review

             21 1:45:51       The Message Your  Anwar Saa Zone   Pending
                              Watch Sends                        editorial
                                                                 review

             22 49:38         Why Is It SO Hard Not separately   Pending
                              To Escape         identified in    editorial
                              Poverty?          source           review

             23 1:20:10       The Side Hustles  Eric Kimani      Pending
                              Lie                                editorial
                                                                 review

             24 1:30:14       Are You Destined  John Kamau       Pending
                              To Be Rich Or                      editorial
                              Poor?                              review

             25 2:01:13       I See Money       David Ole Sankok Pending
                              Everywhere                         editorial
                                                                 review

             26 2:27:01       Normal Money      Ndura Waruinge   Pending
                              Versus Spiritual                   editorial
                              Money                              review

             27 1:48:21       The Loophole That George IQ Watson Pending
                              Can Make Anyone                    editorial
                              Rich                               review

             28 2:03:23       Surviving A Kill  Gwada Ogot       Pending
                              Order                              editorial
                                                                 review

             29 2:20:44       Why Most Rappers  Octopizzo        Pending
                              Stay Broke                         editorial
                                                                 review

             30 1:24:44       The Trust Fund    Peter Wachira    Pending
                              Baby Formula                       editorial
                                                                 review

             31 2:15:11       Here's How S£X Is George IQ Watson Pending
                              Holding You Back                   editorial
                                                                 review

             32 1:32:31       Job Security:     Phyllis Wakiaga  Pending
                              Luck or Skill or                   editorial
                              Connections?                       review

             33 1:33:55       Degree Versus     Gwada Ogot       Pending
                              Connections                        editorial
                                                                 review

             34 24:43         Neuroscientist    Dr. Bundi Karau  Pending
                              Explains How To                    editorial
                              Rewire Your Brain                  review

             35 55:50         Money Lessons at  Joe Gichuru      Pending
                              80                                 editorial
                                                                 review

             36 1:26:53       Secret Behind     Dr. Ken Aluora   Pending
                              Perfect Curves                     editorial
                                                                 review

             37 2:05:43       Why So Many       Dr. Muthomi      Pending
                              'Rich' Kenyans    Thiankolu        editorial
                              Are Actually                       review
                              Broke                              

             38 2:00:15       Who Keeps Kenyans Ng'ang'a Muigai  Pending
                              Poor?                              editorial
                                                                 review

             39 2:25:04       Jobless           Joakim Simiyu    Pending
                              Millionaires of                    editorial
                              Kenya                              review

             40 1:19:05       Building After    Patrick Car Soko Pending
                              Losing Everything                  editorial
                                                                 review

             41 1:45:12       Where's The Money Abdinoor         Pending
                              Really Coming     Alimahdi         editorial
                              From?                              review

             42 1:17:34       Making Money Is   Barack Obatsa    Pending
                              Easier Than You                    editorial
                              Think                              review

             43 59:23         A Million Jobs Is Dan Njiriri      Pending
                              Not Rocket                         editorial
                              Science                            review

             44 1:08:47       Don't Be Lied To  Phylis Njuguna   Pending
                              About Stocks &                     editorial
                              Options Trading                    review

             45 1:34:53       Who Makes Real    Eng. Kiruki      Pending
                              Money in          Mwithimbu        editorial
                              Long-Distance                      review
                              Transport?                         

             46 37:04         Business Lessons  Not separately   Pending
                              from Matatu       identified in    editorial
                              Industry          source           review
                              Pioneers..                         

             47 1:40:39       Making Money Vs   Odhiambo Ramogi  Pending
                              Keeping Money                      editorial
                                                                 review

             48 2:11:40       Jirongo's money   Wafula Buke      Pending
                              destroyed me                       editorial
                                                                 review

             49 1:48:56       This will change  Odoyo Owidi      Pending
                              how you view                       editorial
                              politics & money                   review
                              distribution                       

             50 1:15:02       The Secret World  Paul Muema       Pending
                              Of Exporters In                    editorial
                              Agribusiness                       review

             51 1:47:56       Stop Wasting time Dr. Harun        Pending
                              in the gym        Njago -          editorial
                                                Neurologist      review

             52 1:48:22       What if you're    Not separately   Pending
                              wrong about       identified in    editorial
                              reality? Dr. Joe  source           review
                              Mwai                               

             53 1:23:07       Here's Where      Mbira Rimi       Pending
                              Couples Lose The                   editorial
                              Money Game                         review

             54 1:33:50       How a Small       Stephen Gitagama Pending
                              Salary Can Set                     editorial
                              You Up For                         review
                              Greatness                          

             55 1:28:53       How Europe        Weyni Tesfai     Pending
                              Becomes Hell When                  editorial
                              You Start Making                   review
                              Money                              

             56 1:34:52       Financial Freedom Elisha Ongoya -  Pending
                              Beyond Money      Advocate         editorial
                                                                 review

             57 1:55:41       Why Nigerians     Chude Jideonwo   Pending
                              Keep Winning the                   editorial
                              Global Money Game                  review

             58 1:47:36       This Investment   Linda Waiyaki    Pending
                              Banker's Money                     editorial
                              Secrets Could                      review
                              Change Your Life                   

             59 2:34:14       Would You Rather  Not separately   Pending
                              Earn 200K in      identified in    editorial
                              Kenya or 1        source           review
                              Million in                         
                              America? Kirunda                   
                              Kiruthi                            

             60 23:58         What If Financial Not separately   Pending
                              Freedom Is Not    identified in    editorial
                              What You Think?   source           review

             61 1:55:54       Rose Muhando      Not separately   Pending
                              Money Mistakes &  identified in    editorial
                              Lessons           source           review

             62 1:26:51       PR Legend Reveals Gina Din         Pending
                              What They Don't                    editorial
                              Tell You about                     review
                              Networking                         

             63 1:43:18       My Tried and      Dr. Zippy Okoth  Pending
                              Tested Rent Free                   editorial
                              Strategy                           review

             64 1:48:39       The Money You Can Dr. Julius       Pending
                              Make By Just      Kipng'etich      editorial
                              Keeping Quiet                      review

             65 2:19:30       Don't Borrow      Hon. Kimani      Pending
                              Money- Do This    Ngunjiri         editorial
                              Instead                            review

             66 1:52:58       Street Smarts     John High        Pending
                              That Can Make You Definition       editorial
                              a Millionaire                      review

             67 1:46:01       Making money      Pastor T. Mwangi Pending
                              without believing                  editorial
                              in God?                            review

             68 1:23:37       Cash Flow King on Krg The Don      Pending
                              where you go                       editorial
                              wrong with money                   review

             69 1:24:16       The thing about   Melanie &        Pending
                              self made         Dr. Paul         editorial
                              millionaires      Kaumbutho        review

             70 1:40:40       If this doesn't   Andrew Muthee    Pending
                              make you rich,    Gitau            editorial
                              It'll make you                     review
                              wealthy                            

             71 27:28         Surprising        Dr. King'ori     Pending
                              Connection                         editorial
                              Between Your                       review
                              Birth Date &                       
                              Financial Destiny                  

             72 1:40:40       Former GSU        George Musamali  Pending
                              trainer's mind                     editorial
                              blowing account                    review
                              of police                          
                              operations                         

             73 2:08:19       Poverty that      Robert Mwangi,   Pending
                              looks like wealth MBA              editorial
                                                                 review

             74 1:38:42       Best way you can  Mark Denver      Pending
                              punish police     Karubiu, Wakili  editorial
                              misconduct        Otieno Willis    review

             75 2:15:51       Your Grace period Peter Nduati     Pending
                              for making money                   editorial
                                                                 review

             76 1:27:02       How sleeping      Mbote Njogu      Pending
                              hungry changed my                  editorial
                              life                               review

             77 1:49:21       How I beat the    Kapedo           Pending
                              hand to mouth     Photography      editorial
                              economy                            review

             78 2:12:05       My money lessons  Awinja Nyamwalo- Pending
                              from TV to the    Jacky Vike       editorial
                              internet space                     review

             79 1:09:16       Terms of          General Michael  Pending
                              engagement for    Langley          editorial
                              military training                  review
                              for African                        
                              countries                          

             80 2:46:07       The calls that    Njugush          Pending
                              changed my life                    editorial
                              financially                        review

             81 1:55:20       Money lessons     Omar Papa        Pending
                              from self taught                   editorial
                              engineer & Pilot                   review

             82 1:48:46       Why and how your  Mary Gichuki     Pending
                              electronic                         editorial
                              devices are                        review
                              listening                          

             83 1:29:12       Why you made the  Dem wa Facebook  Pending
                              right person                       editorial
                              famous                             review

             84 1:59:22       Assessing the     Byron Adera      Pending
                              Kasipul MP hit                     editorial
                              job with a                         review
                              Special Forces                     
                              Soldier                            

             85 2:34:38       Truth about how   Lee Njiru        Pending
                              some billionaires                  editorial
                              you know made                      review
                              money                              

             86 2:08:14       Metaphysics :     Dr. Joseph Mwai  Pending
                              Giving Proof of a                  editorial
                              spiritual world                    review

             87 1:47:01       The calls that    Abel Mutua       Pending
                              changed my life                    editorial
                              Financially                        review

             88 2:46:13       Marijuana or      David Ogot       Pending
                              alcohol, which                     editorial
                              one makes people                   review
                              smarter?                           

             89 1:38:39       Pilots are not    Eric Mutiso -    Pending
                              paid for flying,  EOTWE            editorial
                              here's where the                   review
                              money is                           

             90 1:20:34       Truth about       Caroline         Pending
                              circulation &     Loontubu         editorial
                              cycles of money                    review
                              in Kenya                           

             91 1:20:00       My experience     Njoroge Muigai   Pending
                              serving in the US                  editorial
                              Army vs Kenya                      review
                              Military                           

             92 1:50:54       Why it is so hard Mordecai Ogada   Pending
                              to escape poverty                  editorial
                                                                 review

             93 1:52:47       The dark          Nicha Kente      Pending
                              psychology of                      editorial
                              real estate                        review

             94 1:51:58       Chain of events   Njoroge Muigai,  Pending
                              that caused a     David Njau       editorial
                              dark decade for                    review
                              Kenya Military                     

             95 1:39:17       Computer sales    Sapna Deadly &   Pending
                              pioneer's million Shiva Singh      editorial
                              dollar mindset                     review

             96 2:22:38       How to spot       Nameless & Habib Pending
                              Greatness before  on E-Sir's Life  editorial
                              it hits           before the fame  review

             97 1:56:36       How cartels lock  Bishop Dr. Luke  Pending
                              you out of Money  Mwangi           editorial
                              circulation                        review

             98 2:11:41       Link between s£x  Bamboo           Pending
                              and wealth                         editorial
                                                                 review

             99 1:31:47       Making money is   Abdinoor         Pending
                              easier than you   Alimahdi         editorial
                              think                              review

            100 1:47:05       My experience     Mr. Nice         Pending
                              will totally                       editorial
                              change how you                     review
                              view money                         

            101 2:20:56       You're looking    Robert Mwangi    Pending
                              for jobs in the   Mba              editorial
                              wrong places                       review

            102 3:22:13       Little known      Morara Kebaso    Pending
                              strategies I've                    editorial
                              used to access                     review
                              big money                          

            103 1:29:58       This will change  Dan Oguma        Pending
                              your mind about                    editorial
                              small businesses                   review

            104 1:28:35       Don't be lied to  Rufas Kamau      Pending
                              about Forex                        editorial
                              trading                            review

            105 1:47:28       This will         Mbira Rimi       Pending
                              permanently                        editorial
                              change your view                   review
                              of s£x                             

            106 1:38:36       Understanding     Wairimu Mukuru   Pending
                              African                            editorial
                              Spirituality                       review

            107 1:10:13       A legal money     Fanya Mambo      Pending
                              making            Kinuthia         editorial
                              opportunity                        review
                              hiding in the                      
                              open                               

            108 2:20:04       Can witchcraft    Dr. Mwaka        Pending
                              affect you if you Episode 2        editorial
                              don't believe in                   review
                              it?                                

            109 1:02:07       Inside the world  Not separately   Pending
                              of sperm banking  identified in    editorial
                                                source           review

            110 1:45:03       Fmr. World bank   Dr. David        Pending
                              employee spills   Wachira          editorial
                              the beans on how                   review
                              to win with debt                   

            111 1:07:07       You DON'T need    Bunny Asila      Pending
                              FAME to make                       editorial
                              money                              review

            112 1:36:41       Why you keep      Ed Thiong'o      Pending
                              paying more than                   editorial
                              you should                         review

            113 2:14:24       Former Catholic   Fr. Gathang'i    Pending
                              Priest links      Waiguru          editorial
                              Christmas to                       review
                              satanism                           

            114 1:20:16       Facts about       Gabriel Maketh   Pending
                              generational                       editorial
                              wealth                             review

            115 3:10:29       The only person   Jacob Aliet,     Pending
                              you should marry  Venus Kyengo,    editorial
                                                Robert Burale &  review
                                                Kerry Kagiri     

            116 18:32         What it takes to  Evance Omondi    Pending
                              be a dollar       Otieno           editorial
                              millionaire in                     review
                              Africa                             

            117 1:36:52       Link between cash Bamboo           Pending
                              and witchcraft                     editorial
                                                                 review

            118 1:32:34       This will change  Venus Kyengo     Pending
                              your mind about                    editorial
                              marriage                           review

            119 1:31:19       The wonders of    Miano Muthii     Pending
                              starting small                     editorial
                                                                 review

            120 1:13:46       Use statistics to Evance Omondi    Pending
                              win the money     Otieno           editorial
                              game                               review

            121 1:48:26       Unmasking the     Director Trevor  Pending
                              business of                        editorial
                              content                            review

            122 1:07:43       You are wrong     Jayne Marquard   Pending
                              about healthy                      editorial
                              living                             review

            123 1:29:02       King of car       Peter Mbiria     Pending
                              modifications :                    editorial
                              This engineering                   review
                              genius will                        
                              modernize any car                  

            124 1:49:07       Regain control of Chomba Njoka     Pending
                              your destiny &                     editorial
                              get unstuck in                     review
                              life                               

            125 1:10:42       Common fixtures   Morris Kariuki,  Pending
                              that make your    Eng. Sam         editorial
                              home unsafe       Wanyoike         review

            126 1:29:46       This will change  Caleb Karuga     Pending
                              your mind about                    editorial
                              Agribusiness                       review

            127 1:44:04       Dubai chronicles  Madina           Pending
                              of a World Class                   editorial
                              Jack of all                        review
                              Trades                             

            128 1:03:48       This will change  Prof. Charles    Pending
                              your mind about   Ondieki          editorial
                              employment                         review

            129 1:16:25       You can make      Joyce Gachugi    Pending
                              millions from                      editorial
                              trash                              review

            130 1:42:30       Why & When        Jacob Aliet      Pending
                              Kugongewa is                       editorial
                              constant                           review

            131 1:26:05       Killing you       Geoffrey Mosiria Pending
                              softly in the                      editorial
                              name of healthy                    review
                              Living                             

            132 1:29:40       Loopholes you     Peter Kibugi,    Pending
                              should exploit in Hellen Wangui    editorial
                              Real Estate                        review

            133 1:31:35       How to safely     Stomzy Mwendwa   Pending
                              invest outside                     editorial
                              Kenya                              review

            134 1:25:40       Why impeaching    Dorn Anaclet     Pending
                              Rigathi Gachagua                   editorial
                              is easier                          review
                              compared to Ruto                   
                              as DP                              

            135 1:41:01       I'll show you the Edwin Khiranga   Pending
                              money                              editorial
                                                                 review

            136 1:55:21       The Morara        Engineer Evans   Pending
                              accident was a    Kimori           editorial
                              test                               review

            137 1:15:22       You can get from  Cleven Lang'i    Pending
                              average to super                   editorial
                              human                              review

            138 1:52:40       The big lie of    Roselyne Wanjiru Pending
                              savings                            editorial
                                                                 review

            139 1:40:41       The thin line     Jabes Hosea      Pending
                              between killing                    editorial
                              and murder                         review

            140 35:09         How safe is your  Peter Mwangi     Pending
                              money in                           editorial
                              cryptocurrency?                    review

            141 1:38:51       If you want       Dr. Esther       Pending
                              people to give    Muchemi          editorial
                              you their                          review
                              money...                           

            142 1:37:40       How A Nurse Toto  Eddie Butita     Pending
                              Makes money                        editorial
                                                                 review

            143 25:30         This determines   Prof. Mwachofi   Pending
                              how long you will Ngure            editorial
                              live                               review

            144 25:09         How internet      Eddie Butita     Pending
                              money is shared                    editorial
                                                                 review

            145 25:21         Don't believe     Former IEBC      Pending
                              what you see in   Chairman, Ahmed  editorial
                              the News          Issack Hassan    review

            146 26:12         When politicians  Former IEBC      Pending
                              draw the line to  Chairman, Ahmed  editorial
                              make money        Issack Hassan,   review
                                                CBS              

            147 1:32:39       The features of   Tonnie Mello     Pending
                              small businesses                   editorial
                              that succeed                       review

            148 1:28:02       Career Forex      Rufas Kamau      Pending
                              trader will blow                   editorial
                              your mind with                     review
                              unique view of                     
                              money                              

            149 1:57:56       Never leave your  Bob Mwiti        Pending
                              country without                    editorial
                              this info                          review

            150 1:51:41       The true cost of  Architect Morris Pending
                              construction &    Kariuki          editorial
                              Risky Housing                      review

            151 1:32:08       Story of song     Gidi Gidi        Pending
                              that brought down                  editorial
                              a regime                           review

            152 1:35:39       President Ruto's  Gor Semalang'o   Pending
                              only way out                       editorial
                                                                 review

            153 1:38:33       The reality of    John Allan Namu  Pending
                              reporting on                       editorial
                              corruption                         review

            154 2:04:05       Laying bare the   Okiya Omtata     Pending
                              money trail                        editorial
                                                                 review

            155 1:23:36       The hidden agenda Ed Thiong'o      Pending
                              in the 2024                        editorial
                              Finance Bill                       review

            156 1:25:31       Truth about self  Erick Wokabi,    Pending
                              made millionaires Joseph Ogada     editorial
                                                                 review

            157 1:47:30       You'll Never lose Ed Thion'go      Pending
                              money when you                     editorial
                              understand                         review
                              this...                            

            158 1:33:49       Investment banker Rina Hicks       Pending
                              on how to access                   editorial
                              real money                         review

            159 4:42          Effect of making  Dr. David        Pending
                              200k per minute   Wachira          editorial
                              in Forex                           review

            160 1:44:41       Why they chose    Hon. Kimani      Pending
                              Rigathi Gachagua  Ngunjiri         editorial
                                                                 review

            161 1:31:21       The New age       Silas Nyanchwani Pending
                              loyalty test                       editorial
                                                                 review

            162 2:00:58       All the money but Wairimu Mukuru   Pending
                              no peace                           editorial
                                                                 review

            163 2:02:17       Last generation   Moses Muriithi   Pending
                              to afford land?                    editorial
                                                                 review

            164 1:04:21       London flight     Captain Peter    Pending
                              that almost ended Kiboi            editorial
                              in disaster                        review

            165 1:35:36       I would have left Colleen Cheptoo  Pending
                              Canada with                        editorial
                              nothing                            review

            166 1:36:25       How spiritual is  Apostle T.       Pending
                              money?            Mwangi           editorial
                                                                 review

            167 1:48:01       If this doesn't   Waithaka Gatumia Pending
                              make you rich,                     editorial
                              it'll make you                     review
                              wealthy                            

            168 1:33:26       Sure bet          CPA Wangeci      Pending
                              businesses you    Warui            editorial
                              can run in Kenya                   review

            169 1:23:56       Handling          Walter Mongare   Pending
                              redukyulass money                  editorial
                              & rules of                         review
                              getting paid                       

            170 1:40:28       Ways you can      Purity Wakahiu & Pending
                              start a business  Joram Ndung'u    editorial
                              without Money                      review

            171 1:51:13       Budget master on  Dr. David        Pending
                              how to Get        Wachira          editorial
                              Unstuck                            review
                              Financially                        

            172 1:44:13       Why the innocent  Not separately   Pending
                              always get hurt   identified in    editorial
                              in University     source           review

            173 1:28:56       What people with  Gor Semelang'o   Pending
                              money never tell                   editorial
                              you                                review

            174 1:00:31       When you survive  Ndrendende,      Pending
                              exchange of fire  James Kwatenge & editorial
                              with the police   Davis Mirara     review

            175 1:26:38       The hardest thing Eng. Sammy       Pending
                              about sniper      Onyango          editorial
                              training                           review

            176 1:46:07       Kamiti & Beyond   Ndrendende,      Pending
                              reasonable doubt  James Khwatenge, editorial
                              tricks            Mirara Davis &   review
                                                Pete Ouko        

            177 10:42         Ceasefire & Petty Brigadier        Pending
                              reasons countries General          editorial
                              have gone to war  Dr. Wallace      review
                              for               Williams         

            178 21:02         The curse of the  Dr. Wallace      Pending
                              Breadwinner       Williams         editorial
                                                                 review

            179 1:48:43       Bank Owner on Bad Dr. David        Pending
                              ideas of home     Wachira          editorial
                              ownership                          review

            180 1:34:14       How to win the    Dama wa Mobile   Pending
                              Money game        Spares           editorial
                              without a Payslip                  review

            181 1:31:49       Military General  Ambassador Brig  Pending
                              talks diplomacy & General          editorial
                              Rules of war      Dr. Wallace      review
                                                Williams         
6. Suggested website behaviour
Conversation library
- Render episode cards from the data records.
- Show a verified thumbnail, title, guest name(s), and duration where
  available.
- Link to a verified episode URL or to an internal detail page with
  the verified media embed.
- Do not render broken or guessed links for records that have not yet
  been verified.
Category discovery
- Display category names and optional descriptions from the category
  data.
- Selecting a category filters the conversation records by category
  slug.
- Because a conversation can have multiple categories, it may appear
  in multiple category views without duplicating the underlying
  record.
Search
Search should cover at least episode titles and guest names. Tags can be
included as editorial metadata becomes available.
Homepage
Keep the homepage curated and editorial. It can feature a small
selection of conversations while the full catalogue lives on a dedicated
library page.
7. Suggested vanilla JavaScript file boundaries
Adapt these names to the existing repository after inspecting its
current structure; do not duplicate files or introduce a build system
unnecessarily.
scripts/
  main.js
  conversations/
    data.js        # Conversation records
    categories.js  # Category definitions
    render.js      # Episode cards and category lists
    filters.js     # Search, category filtering, sorting
The initial implementation should use HTML, CSS, and vanilla JavaScript
ES modules, consistent with the current project.
8. Recommended implementation sequence
1. Confirm this schema and the category taxonomy.
2. Verify and normalize the source metadata, especially titles, guest
   names, and durations.
3. Add verified YouTube IDs/URLs and approved thumbnail paths.
4. Categorize a representative sample and review it before assigning
   categories to all entries.
5. Implement category filtering and conversation rendering using a
   small test dataset.
6. Test multi-category membership, search, missing thumbnails, missing
   URLs, and mobile layouts.
7. Migrate the full catalogue and verify each published record.
9. Editorial checklist
- [ ] Confirm the category names and boundaries.
- [ ] Review episode titles for extraction errors while preserving the
  original source wording.
- [ ] Verify guest names and multi-guest episodes.
- [ ] Verify episode URLs or YouTube IDs.
- [ ] Identify approved episode thumbnails and their local paths.
- [ ] Add publication dates and descriptions only from a reliable
  source.
- [ ] Assign primary and secondary categories.
- [ ] Confirm the two hidden/unavailable entries separately if they
  are needed.
- [ ] Test the library with real records before applying visual
  polish.
Catalogue principle: one canonical record per conversation, reusable
category metadata, verified media links, and no invented metadata.