/* ==========================================================================
   ✏️  EDIT THIS FILE — it is the whole magazine's content.
   Change the text between the quotes. Add or remove items from the lists.
   Photographs go in assets/img/ and are named here.
   ========================================================================== */

const SITE = {
  /* ---------- The issue ---------- */
  magazineName: "RAVEEN",
  issueLine: "Vol. {age} · Special Edition",
  strapline: "Worldwide Birthday Release",
  edition: "Collector's Issue",
  coverPrice: "Priceless",
  barcodeNo: "9 780220 200322",
  editionNo: "Edition N° {age}",

  /* ---------- The birthday girl ----------
     Change `age` and the whole magazine follows: the cover line, the volume
     number, the edition, the editorial quote and the finale all read it. */
  name: "Raveen",
  fullName: "Lakkakula Sai Raveena Sowgandhika",
  age: 22,
  coverLine: "Turning {age} & looking undeniably iconic",
  birthday: "2026-11-14",           // drives the countdown on the cover
  coverPhoto: "assets/img/cover.jpg",

  /* ---------- The contents page ---------- */
  // The little stats strip under the contents list.
  // `count` lets the magazine count for itself: pages, spreads, besties, family.
  issueStats: [
    { count: "pages",   label: "Pages" },
    { count: "chapters", label: "Chapters" },
    { count: "besties", label: "Besties" },
    { n: "01",          label: "Copy ever" }
  ],

  /* ---------- Contents ---------- */
  editorialQuote:
    "{age} years. Countless memories. Too many unhinged phone calls at 1 AM. " +
    "One irreplaceable Raveen.",
  editorialBy: "The Editorial Board (Your Squad)",

  /* ---------- Chapter One · The Lore ---------- */
  lore: {
    kicker: "Chapter 01 · The Biography",
    title: "The Raveen Lore",
    photo: "assets/img/lore.jpg",
    entries: [
      {
        label: "Vital Survival Checklist",
        text: "Late night snacks, intense gossip debriefs, iced matcha & aesthetic photo dumps."
      },
      {
        label: "Superpower",
        text: "Lighting up any room within 3 seconds of walking through the door."
      },
      {
        label: "Natural Habitat",
        text: "Anywhere with good lighting, bad decisions and at least one person to argue with."
      }
    ]
  },

  /* ---------- The report card ---------- */
  reportCard: {
    title: "Official Raveen Report Card",
    stamp: "★ Certified Best Girl by Board of Besties ★",
    rows: [
      { label: "Being Iconic & Slaying Outfits", pct: 100, shown: "100%" },
      { label: "Replying to Texts on Time", pct: 95, shown: "95%" },
      { label: "Drama & Expressive Storytelling", pct: 90, shown: "90%" },
      { label: "Stealing Food From Everyone's Plate", pct: 50, shown: "50%" },
      { label: "Loyalty & Love to Her Besties", pct: 100, shown: "100%" },
      { label: "Winning Arguments She Started", pct: 75, shown: "75%" },
      { label: "Saying \"I'm Five Minutes Away\"", pct: 95, shown: "95%" },
      { label: "Actually Being Five Minutes Away", pct: 95, shown: "95%" }
    ]
  },

  /* ---------- A design for each page ----------
     Give a spread a look of its own by naming a theme against its id. A
     generated spread (gallery-3, besties-2) follows the one it was copied
     from, so a chapter stays of a piece. Leave a spread out and it keeps the
     magazine's own cream-and-pink look.

     Themes available so far:
       "scrapbook"  photographs taped onto black card, handwritten captions
       "beige"      a collage on tan paper, black frames, sweeping white arcs
       "card"       a keepsake album, maroon mounts on warm ruled paper

     The ids are: cover, lore, gallery, besties, family.                    */
  pageStyles: {
    gallery: "scrapbook",
    family: "keepsake"
  },

  /* ---------- Chapter Two · The Archive ----------
     A gallery spread. Add or remove filenames and the grid re-lays itself;
     four to a page reads best. Any file in assets/img/ can go here. */
  gallery: {
    kicker: "Chapter 02 · The Archive",
    title: "The Archive",
    dek: "Every photograph we have of her. No occasion, no reason \u2014 just her.",
    photos: [
      { src: "assets/img/gallery-34.jpg", caption: "That smile, completely unedited." },
      { src: "assets/img/gallery-33.jpg", caption: "Laughing before we were ready." },
      { src: "assets/img/gallery-24.jpg", caption: "Somewhere green, glowing." },
      { src: "assets/img/gallery-31.jpg", caption: "All dressed up, still our girl." },
      { src: "assets/img/gallery-29.jpg", caption: "Golden hour found her first." },
      { src: "assets/img/gallery-22.jpg", caption: "Caught mid-laugh, as usual." },
      { src: "assets/img/gallery-27.jpg", caption: "Soft day, softer heart." },
      { src: "assets/img/gallery-5.jpg", caption: "College days, the best days." },
      { src: "assets/img/gallery-4.jpg", caption: "Terrace evenings with her." },
      { src: "assets/img/gallery-21.jpg", caption: "Quiet, and quietly wonderful." },
      { src: "assets/img/gallery-32.jpg", caption: "Every colour suits her." },
      { src: "assets/img/gallery-26.jpg", caption: "Six yards and all that grace." },
      { src: "assets/img/about.jpg", caption: "Caught being soft." },
      { src: "assets/img/gallery-10.jpg", caption: "Saree days on our street." },
      { src: "assets/img/gallery-11.jpg", caption: "One more, just in case." },
      { src: "assets/img/gallery-13.jpg", caption: "Butterflies and best friends." },
      { src: "assets/img/gallery-14.jpg", caption: "Drawn, because a photo wasn’t enough." },
      { src: "assets/img/gallery-15.jpg", caption: "Held on tight." },
      { src: "assets/img/gallery-16.jpg", caption: "Our girl, illustrated." },
      { src: "assets/img/gallery-17.jpg", caption: "The cafe, in cartoon form." },
      { src: "assets/img/gallery-18.jpg", caption: "Somewhere sunny, in pencil." },
      { src: "assets/img/gallery-19.jpg", caption: "Matching energy, always." },
      { src: "assets/img/gallery-2.jpg", caption: "Evening light and good company." },
      { src: "assets/img/gallery-20.jpg", caption: "That look, drawn from memory." },
      { src: "assets/img/gallery-23.jpg", caption: "Fairy lights and a full heart." },
      { src: "assets/img/gallery-25.jpg", caption: "Looking up at something good." },
      { src: "assets/img/gallery-28.jpg", caption: "All dressed up on an ordinary day." },
      { src: "assets/img/gallery-3.jpg", caption: "The three of us, no occasion." },
      { src: "assets/img/gallery-30.jpg", caption: "Blue skies suited her." },
      { src: "assets/img/gallery-6.jpg", caption: "Mid-scroll, caught." },
      { src: "assets/img/gallery-7.jpg", caption: "Camera-shy for exactly one second." },
      { src: "assets/img/gallery-8.jpg", caption: "Black and white, still glowing." },
      { src: "assets/img/gallery-9.jpg", caption: "Anywhere becomes a photo spot." },
      { src: "assets/img/portrait.jpg", caption: "Partners in every plan." },
      { src: "assets/img/record.jpg", caption: "The whole crew, dressed up." },
      { src: "assets/img/strip-2.jpg", caption: "Shopping trips that took hours." },
      { src: "assets/img/strip-3.jpg", caption: "The laugh that ends conversations." },
      { src: "assets/img/strip-4.jpg", caption: "Out, and in no hurry to go home." },
      { src: "assets/img/us.jpg", caption: "A whole year in one frame." }
    ]
  },

  /* ---------- Chapter Three · Besties Confidential ----------
     One friend to a page, however many there are. An odd number leaves a last
     page for the closing note below. */
  besties: [
    {
      name: "Priya",
      full: "Priya Sen",
      photo: "assets/img/priya.jpg",
      caption: "Laughing till crying in the car.",
      quote: "Still can't believe we survived that trip.",
      letter:
        "Hey disaster ❤️,\n" +
        "\n" +
        "Mana friendship ela start ayyindo gurthosthe ippatiki Naku navvu vastundi 😂. First day nuvvu naatho WhatsApp lo chat chesav, adi nuvve ani kuda naaku teliyadu. Nenu ninnu “akka” ani pilichanu. 😂 Akkada nunchi start ayina mana friendship 4 years varaku ila untundi ani appudu asalu anukoledu.\n" +
        "\n" +
        "Hostel lo manam kalisi spend chesina time naaku eppatiki special. Kalisi cooking cheyyadam, cooking chestu matladadam cheyyadam, pakkana vallani comment cheyyadam 😂,  dance cheyyadam, songs padadam… roju edo oka allari. Appudu avi normal moments laga anipinchayi, kani ippudu avi gurthosthe chala miss avtunna.\n" +
        "\n" +
        "Nuvvu chala naughty ee😂,ni tho vuna valaki kuda chala conform zone estav. Nannu mi intiki teesukellav, akkada kuda manam kalisi time spend chesam. Aa memory kuda naaku chala istam and most memorable kuda❤️.\n" +
        "\n" +
        "4 years ayyaka manam separate avvadam matram chala sad anipinchindi. Endukante inthavaraku almost every day kalisi unde vallam roju ani share chesukoni epudu atleast month ki kuda call levu gaa ante sharing chesukovadam martham missing. Eppudaina edaina cheppali ante immediate ga cheppukune vallam. Suddenly inka eppudu kalustamo? ani anipinchindi. 🥹\n" +
        "\n" +
        "Kani manam daily kalisi undakapoyina mana friendship matram ala end avvakudadhu. Life lo entha busy aina, enni days ayina kalavakunda unna, malli kalisinappudu mana madhya same comfort, same navvulu, same madness and a crazy jokes martham alane untayi ❤️.\n" +
        "\n" +
        "Malli kalisinappudu mana first topic kuda mana hostel days eh untayi 😂. Appudu manam chesina pichi panulu  anni gurthu techukoni malli alane  navvukundam.\n" +
        "\n" +
        "Thank you for being such a beautiful part of my 4 years. ❤️🫶🏻\n" +
        "\n" +
        "Love you ra Raveen ❤️\n" +
        "Nee forever friend and commenting partner 😂❤️"
    },
    {
      name: "Sreehitha",
      full: "Sreehitha Reddy",
      photo: "assets/img/sreehitha.jpg",
      caption: "The one who always says yes to a plan.",
      quote: "You are the reason my camera roll is full.",
      letter:
        "Wish you a very very happy birthday, Raveena 🎂❤️\n" +
        "\n" +
        "I wish you a wonderful year ahead filled with lots of fun, happiness, love and beautiful memories.\n" +
        "\n" +
        "Eppudu ilage happy ga, smiling ga undali 🫶🏻 Nee life lo nuvvu korukune prati okkati jaragali, always you should have reasons to smile and be happy.\n" +
        "\n" +
        "I genuinely feel great to have a friend like you 😁 Life lo konni people just ala random ga enter avtharu, but somehow they become really special… and I feel you are one of those people for me ❤️\n" +
        "\n" +
        "I feel everything happens for a reason in our life, and maybe destiny always had its own way of making us stay together and keeping our bond strong 🏋️ Enni situations vachina, enni changes vachina, somehow mana iddarini kalisi unchadaniki destiny oka reason create chesthune untundi anipisthundi. No matter what happens or how things change, somehow we always find our way back to each other. And I feel that's what made our bond this special 💕\n" +
        "\n" +
        "We've shared so many random talks, laughs, jokes and memories, and I hope we keep creating many more together 🫶🏻\n" +
        "\n" +
        "Enjoy your special day like anything! 🥳🎉 Always celebrate yourself, keep that beautiful smile 😄 and maintain it as long as possible. Ee roju full ga enjoy cheyyi, because today is completely yours! 🥳\n" +
        "\n" +
        "Always create your own happiness, believe in yourself and accomplish all the goals you have for yourself. Nee dreams anni nijam avvali, and nuvvu anukunna life ni create cheskovali. Never let anything or anyone take away your peace and happiness.\n" +
        "\n" +
        "Stay strong 💪🏻, stay healthy 🥗 and most importantly, stay the same crazy and happy person you are 😂 Eppudu ilage untu, nannu kuda nee craziness tho torture chesthu undu 😂\n" +
        "\n" +
        "Once again, happiest birthday, birthday girl!!! 🥳 Have the best day ever and make lots of beautiful memories! ✨"
    },
    {
      name: "Bhavya",
      full: "Bhavya Patel",
      photo: "assets/img/bhavya.jpg",
      caption: "The first friend college gave me.",
      quote: "Some friends feel like home antaru ga \u2014 adhi nuvvey.",
      letter:
        "Hoi raveen \u2764\ufe0f... firstly wish you a very happy birthday. Na life lo nenu okaru " +
        "chala bagundali anukuney vallalo nuvvu kachithamga oka dhanivii\ud83d\ude07 Nuvvu nee " +
        "life lo eppudu success ayina first claps kotti santhosam ga feel ayyedhi " +
        "neney\ud83d\ude18\u2728\ufe0flove you sooo much... and thanks making me feel warmth \u2764\ufe0f  one of the " +
        "reasons nee valley na clg life meaningfull ga marindhiii\ud83d\ude18 you and sanju are my " +
        "jaaan jigiriess\ud83d\ude18 and you guys gave gift that is sreehitha\u2764\ufe0f a pure soul and " +
        "two more akshaya and priyaa\u2764\ufe0f such a sweet frnds.. chaaaaala pedda thanks " +
        "naaku kudaa manchi friends unnaru ani dhairiyam ga cheppukoniki meeru unnaru " +
        "naaaku chaalu... inka nuvvu naaku eppudu chala speacial nuvvey clg lo first " +
        "frnd \u2764\ufe0f and till now the bessstesttest frnd\ud83e\udd70sorry nenu kachithamga ninnu hurt " +
        "chesa starting lo but ala ayipoindhii adhi \ud83e\udd72 and i promise that i will never " +
        "gonna leave you in rest of my reamaining years left... Nuvvu chala success " +
        "avvali nee life lo neeku kavalsinavi anni neeku dhakkali manchi husband " +
        "raavali manchiga chuskovalii ninnu \ud83e\udd70  inkaa neetho unta chala navvutha chaala " +
        "share cheskovachu asalu eppudu frnd anipinchala frnd kanna chala ekkuva ippudu " +
        "mee family anteyna ma intlovallaki kuda chala ekkuva \u2764\ufe0f\ud83d\ude0c thanks antha manchi " +
        "uncle ni ichav ... na life lo eppatiki neeku runapadi unta raa.. asalu enthooo " +
        "chesav naakosam nenu andhariki cheidamey gaani naaku evari em chesi nenu adhi " +
        "feel ayyindhi ledhu ra life lo first tym meeru naaku antha chesthuntey meeru " +
        "chaalu eee life ki anipichindhiii nizam ganey nuvvu sanju leka pothey nenu " +
        "emaipoyedhanno thaluchukunteyney bayamvesthundhi\ud83e\udd72 in all situation chaaala " +
        "thanks meeru na life loki vachinandhuku\ud83e\udd70\ud83e\udd70\ud83e\udd70 eppudu naaku meeru kaavali eey " +
        "situation ayina elanti situation ayina matladadam matiku manodhu\ud83e\udd79\u2764\ufe0f Some " +
        "friends feel like home antaru ga adhi nuvvey\u2764\ufe0f\ud83d\ude18 once again wish you a many " +
        "more happy returns of the day\u2764\ufe0f\ud83d\ude18 love you bye take care\u2764\ufe0f"
    },
    {
      name: "Akshaya",
      full: "Akshaya Nair",
      photo: "assets/img/akshaya.jpg",
      caption: "Conversations that never found their topic.",
      quote: "Ela kuda manushulu untara?",
      letter:
        "Huhuuu heeheee Raveeen  \ud83d\ude01\u2764\ufe0f" + "\n" +
        "" + "\n" +
        "Some people just come into your life and somehow become a very special part of it. Nuvvu kuda alanti person na life looo....Mana random conversations start ayyi, hours hours continue ayyevi \ud83d\ude02. Topic enti ani start chesamo kuda marchipoye vallam. Even exam time lo kuda mana discussions ki oka separate importance undedi \ud83d\ude02. And I genuinely love the way you call me Akshh \u2764\ufe0f." + "\n" +
        "" + "\n" +
        "Last year 2025 ni birthday shopping ki vellina day kuda chala special. Shopping kanna ekkuva memories create cheskunnam \ud83d\ude02. And yes, you looked really cute in those jeans, Raveen\ud83d\udd25\ud83e\udef6\ud83c\udffc" + "\n" +
        "" + "\n" +
        "Somewhere between all these conversations, jokes and memories, we became so close without even realising it. Nenu normally andaritho easy ga kalavanu, but nuvvu nannu mee andarilo ala kalipesav that I started feeling like I was one among you guys. Family la anipincharu meeru antha \u2764\ufe0f" + "\n" +
        "" + "\n" +
        "And honestly, sometimes I still wonder, Ela kuda manushulu untara?  The love and care you gave  me in all the situations  is something I'll always be grateful for..." + "\n" +
        "" + "\n" +
        "You know how special you are to all of us. \u2764\ufe0f" + "\n" +
        "" + "\n" +
        "I just want to see you happy, successful and in a really good position in life. And yes, one day IAS Raveen / CEO Raveena ni  chudali  \ud83d\ude01" + "\n" +
        "" + "\n" +
        "Inka chala unnayi cheppadaniki\u2026 kani ala mention cheyali teliyataledhu . But you are truly a heartful,calm, charming person \ud83d\ude0a\ud83d\ude02edo comdey ga antuna le pedha serious ga tesukoku \ud83d\ude02,sar lee kani ekkada na heart chala miss avuthundi manam spend chesina time and aa comments ,navulu ani \ud83e\udd72\ud83e\udd27 emotional." + "\n" +
        "" + "\n" +
        "Many many moreeeee Happy returns of the dayhyy Raveennnn \u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f" + "\n" +
        "" + "\n" +
        "So happy to have you in my life. Keep being the same crazy, caring and beautiful person you are\ud83e\udec2\u2764\ufe0f\ud83c\udf89\ud83d\udc83\ud83c\udffc" + "\n" +
        "" + "\n" +
        "Aksh\ud83e\udef6\ud83c\udffc"
    },
    {
      name: "Sanjana",
      full: "Sanjana Joshi",
      photo: "assets/img/sanjana.jpg",
      caption: "The one who made this whole thing.",
      quote: "I built you a magazine. Say thank you.",
      letter:
        "Firstly, wishing you a very, very happy birthday! 🎉🎂❤️♾️\n" +
        "\n" +
        "Edhi aina feelings ni words lo rayadam koncham kastam… because some people and some relationships are just too special to explain completely. No matter how much I write, I feel like I still won’t be able to put into words what you mean to me. But today, I want to try to express at least a small part of everything I feel and all the memories we have created together.\n" +
        "\n" +
        "I genuinely feel blessed to have a person like you in my life. There are very few people with whom we can be completely ourselves, without thinking about how we look, what we say, or what the other person might think. Somehow, you became that person for me. You made me feel that being completely comfortable with someone and sharing every little thing can happen naturally.And when I look back, I still wonder how beautifully everything happened.\n" +
        "\n" +
        "Four years....Four whole years of being together through almost everything.\n" +
        "\n" +
        "From morning chores to college vibes, from eating and sleeping to fighting and making up, from random conversations to serious discussions, from laughing at the most stupid things to supporting each other during difficult times… what not? 😂❤️\n" +
        "\n" +
        "We literally experienced so many phases of life together.Those four years gave me some of the most beautiful and unforgettable memories of my life. I remember our conversations, our silly fights, our laughs, our arguments, our understanding, our random plans, and all those little moments that felt normal at that time but feel incredibly precious now.\n" +
        "\n" +
        "As life passes, things naturally start changing. After college, our lives slowly started moving in different directions. Responsibilities increased, priorities changed, and our routines became different.\n" +
        "\n" +
        "We became apart…Not by hearts, but by distance.And honestly, I think that is what makes our bond even more special.Because even though we don’t talk or meet the way we used to, I never felt that we actually left each other.Life simply became busy.\n" +
        "\n" +
        "These days, sometimes I think twice before calling you. Not because I don’t want to talk to you or because I don’t miss you. It’s actually the opposite.\n" +
        "\n" +
        "I know your life has become more busy and stressful. You have your work, your responsibilities, your people, and your own beautiful moments. And because I always believe that we should give time to the people who are physically around us, sometimes I stop myself from calling because I don’t want to disturb your work, your peace, your time, or any beautiful moment you might be having.So if there are times when I don’t call or don’t disturb you, please never misunderstand my silence.Sometimes silence also comes from care.\n" +
        "\n" +
        "But there is one thing I will never forget how much you supported me.Only I know personally how much you have done for me and how many times you tried to bring me out of all the things that were distracting me or keeping me stuck.You somehow always found a way to support me.Sometimes through your words, sometimes through your actions, and sometimes simply by being there.\n" +
        "\n" +
        "If someone else had been in your place, maybe they wouldn’t have cared as much. But you somehow always tried to help me in whatever way was possible.\n" +
        "\n" +
        "And I genuinely admire you for that.\n" +
        "\n" +
        "Thank you for listening to me.\n" +
        "\n" +
        "Thank you for understanding me.\n" +
        "\n" +
        "Thank you for correcting me when I needed it.\n" +
        "\n" +
        "Thank you for supporting me when I needed someone.\n" +
        "\n" +
        "Thank you for trying to bring me back whenever I was getting distracted.\n" +
        "\n" +
        "And thank you for all those little things you probably don’t even remember doing.\n" +
        "\n" +
        "I remember them.And I am truly grateful for them.\n" +
        "\n" +
        "Another thing I want to say is about your family.I genuinely feel so comfortable with you and your family. I never felt like I was part of someone else’s family whenever I was around you all.Instead, somewhere along the way, I started feeling like **this is my family too.** ❤️The love, care, comfort, and acceptance I feel with you all is something I consider a blessing.Sometimes I genuinely feel like I have two moms and two dads. ❤️\n" +
        "\n" +
        "And honestly, not everyone gets to experience that kind of comfort outside their own home. So I will always be thankful for that.I hope that no matter how much life changes, this bond and comfort will always remain.\n" +
        "\n" +
        "I hope we never become strangers just because life gets busy.I hope that even if we don’t talk for months, whenever we finally meet, it still feels like nothing changed.Like we just picked up from where we left off.And most importantly, I want you to know that **I will always be there for you.**\n" +
        "\n" +
        "I may not always be physically present, and I may not always know what to say or how to solve your problems, but I will always genuinely wish the best for you.\n" +
        "\n" +
        "I will always be happy to see you happy.\n" +
        "\n" +
        "I will always want you to succeed.\n" +
        "\n" +
        "And I will always want life to give you everything you truly deserve.\n" +
        "\n" +
        "On your birthday, I wish you nothing but happiness, peace, success, and beautiful moments.\n" +
        "\n" +
        "I hope all your hard work gives you the results you deserve.\n" +
        "\n" +
        "I hope you achieve everything you dream about.\n" +
        "\n" +
        "I hope you laugh more, travel more, enjoy more, and live more.\n" +
        "\n" +
        "And most importantly, I hope you never lose the beautiful person you are while trying to become everything you want to be.\n" +
        "\n" +
        "Life will keep changing. People will come and go. Responsibilities will increase. Distances may come between us. But some people remain special no matter how much time passes.\n" +
        "\n" +
        "You will always be one of those people for me.\n" +
        "\n" +
        "I genuinely hope we meet soon. I hope we get to sit together again, talk for hours, laugh about our old memories, discuss our lives, and create new memories that we can look back on years later.\n" +
        "\n" +
        "Maybe things will never be exactly like those college days again.\n" +
        "\n" +
        "And that’s okay.\n" +
        "\n" +
        "Because every phase of life has its own beauty.\n" +
        "\n" +
        "What matters is that no matter how much life changes, we never stop caring for each other.\n" +
        "\n" +
        "So today, on your birthday, I just want to say **Thank you for being you.**\n" +
        "\n" +
        "**Happy Birthday once again! 🎉🎂❤️**\n" +
        "\n" +
        "Lots and lots of love. 😘❤️♾️\n" +
        "\n" +
        "And no matter how old we grow, how busy life gets, or how far we are **you’ll always be one of my favourite people and one of the most beautiful chapters of my life.** ❤️♾️"
    }
  ],

  /* ---------- The closing page of Chapter Three ----------
     Used when the number of friends is odd and one page is left over.
     The whole page is the picture, with a note underneath. */
  /* Everything handwritten on the family spread: the notes pinned round the
     photographs, the badge, and the ones scattered over the last page. Change
     the words here and the pages change with them. */
  keepsake: {
    ammaNote: "home always\nfeels like you",
    nanaNote: "my first\nfriend",
    badge: "Family\nfirst always",
    notes: [
      "same girl\u2026\nbigger dreams",
      "collect moments\nnot things",
      "you are\nenough",
      "good things\ntake time",
      "proud of how\nfar you\u2019ve come",
      "happier\nhere"
    ],
    books: ["More faith", "More self love", "More good days", "More of you"]
  },

  /* The two of them with her, under the letters they wrote. */
  familyAlbum: [
    { src: "assets/img/family-riverside.jpg", caption: "my safe place \u2661" },
    { src: "assets/img/nana-laughing.jpg",    caption: "endless love \u2661" },
    { src: "assets/img/family-home.jpg",      caption: "my everything \u2661" }
  ],

  /* The page the magazine closes on: everyone's picture, and what they all
     wanted to say. */
  sendoff: {
    kicker: "From all of us",
    title: "Chapters to Cherish",
    photo: "assets/img/college-life.jpg",
    caption: "Six friends. Hundreds of memories. One unforgettable journey.",
    strap: "College life \u00b7 chapters to cherish, always",
    note: [
      "We all remember you on your special day, but that doesn\u2019t mean we " +
      "love you only on your special day. We will always love and cherish you, " +
      "every single day. \u2764\ufe0f",

      "You have left your footprints in each of our lives, and you are special " +
      "to every one of us in one way or another. No matter how far apart we " +
      "are, the bond and memories we share will always remain close to our " +
      "hearts.",

      "As we are all apart, we just wanted to make your day a little more " +
      "special with whatever we could do. This picture is a little reminder of " +
      "all the naughty things, crazy moments, endless laughter, and beautiful " +
      "memories we have shared together. \ud83e\udd79\u2764\ufe0f",

      "We may not be together today, but every memory brings us back to those " +
      "days when we were all together.",

      "Wishing you a very, very Happy Birthday! \ud83c\udf82\u2764\ufe0f",

      "May your life always be filled with happiness, love, laughter, and " +
      "countless beautiful memories. You will always be special to all of us. " +
      "\u2728"
    ],
    signoff: "Always yours, all of us."
  },

  pact: {
    kicker: "Filed \u00b7 Chapter 03",
    title: "Twenty-Two Years",
    photo: "assets/img/life.jpg",
    note:
      "The little girl with big dreams, the school mornings, the hostel " +
      "years, the late nights and deep talks, the first salary, the girl " +
      "who did it \u2014 every version of her, all on one page. Twenty-two " +
      "years of becoming exactly who she is."
  },

  /* ---------- Chapter Three · Family ---------- */
  familyTitle: "Pillars of Strength",
  family: [
    {
      name: "Dear Raveena",
      from: "From Amma",
      photo: "assets/img/amma.jpg",
      letter:
        "My whole heart, walking around outside my body.\n\nYou were the easiest " +
        "baby and the hardest teenager and you have grown into someone I would " +
        "choose as a friend. Come home soon. I have made too much food again."
    },
    {
      name: "Dear Raveen",
      from: "From Nana",
      photo: "assets/img/nana.jpg",
      letter:
        "Forever your biggest cheerleader.\n\nI do not say these things out loud, " +
        "so I am writing them down. I am proud of you. I have always been proud " +
        "of you."
    }
  ],

  /* ---------- The finale ---------- */
  finale: {
    kicker: "The Grand Finale · Back Cover",
    badge: "Golden Milestone",
    title: "Happy {ageOrdinal}, {name}!",
    message:
      "You are the loudest laugh in every room and the safest place in every " +
      "crisis. Thank you for every ordinary day you made better just by being " +
      "in it.\n\nHere's to twenty-two.",
    signoff: "With all our love — your squad",
    button: "Throw confetti",
    tease: "One last thing before you close it."
  },

  /* ---------- Stickers ----------
     Pasted onto a page, not laid out with it, so they fill space without
     pushing the writing about. A sticker whose file is missing simply does
     not appear, so it is safe to list one before adding the file.

       on:   the spread's id  — cover, lore, gallery, besties, family
       side: "left" or "right"
       at:   top-left, top-right, bottom-left, bottom-right, mid-left, mid-right
       size: share of the page's width (0.18 = 18%)
       tilt: degrees                                                        */
  stickers: [
    /* One to a page, chosen for the page it sits on rather than for the corner
       it fills, and given a clear band at the foot of the page to sit in. A
       sticker whose picture is not in assets/img takes itself off the page, so
       adding one is a matter of dropping the file in, and removing one a
       matter of deleting it. */

    { src: "assets/img/sticker-graduate.png",   on: "lore",      side: "left",
      at: "bottom-right", size: 0.15, tilt: 4 },
    { src: "assets/img/sticker-girlboss.png",   on: "lore",      side: "right",
      at: "bottom-right", size: 0.17, tilt: -5 },

    { src: "assets/img/sticker-friends.png",    on: "besties",   side: "left",
      at: "bottom-right", size: 0.28, tilt: -4 },
    { src: "assets/img/sticker-bow.png",        on: "besties",   side: "right",
      at: "bottom-right", size: 0.24, tilt: 5 },

    { src: "assets/img/sticker-tulips.png",     on: "besties-2", side: "left",
      at: "bottom-right", size: 0.24, tilt: -6 },
    { src: "assets/img/sticker-forever.png",    on: "besties-2", side: "right",
      at: "bottom-right", size: 0.22, tilt: 6 },

    { src: "assets/img/sticker-headphones.png", on: "besties-3", side: "left",
      at: "bottom-right", size: 0.18, tilt: -7 },

    /* the eye that keeps the bad luck off her, on the page for the people who
       raised her, and the wish on the page the magazine closes with */
    { src: "assets/img/sticker-wish.png",       on: "cover",     side: "right",
      at: "bottom-right", size: 0.17, tilt: 5 },
    { src: "assets/img/sticker-evileye.png",    on: "sendoff",   side: "right",
      at: "bottom-right", size: 0.17, tilt: -6 }
  ],

  /* ---------- The song on the cover ---------- */
  song: {
    title: "Our song",
    sub: "the one that is always playing",
    link: ""                        // paste a Spotify or YouTube link
  }
};

/* "22" -> "22nd", so the finale headline follows the age as well. */
SITE.ageOrdinal = (function (n) {
  var tens = n % 100;
  if (tens >= 11 && tens <= 13) return n + "th";
  return n + ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th");
})(SITE.age);

if (typeof window !== "undefined") window.SITE = SITE;
