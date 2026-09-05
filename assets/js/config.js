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
    { n: "03",          label: "Chapters" },
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
      { label: "Replying to Texts on Time", pct: 15, shown: "15%" },
      { label: "Drama & Expressive Storytelling", pct: 99, shown: "99%" },
      { label: "Stealing Food From Everyone's Plate", pct: 92, shown: "92%" },
      { label: "Loyalty & Love to Her Besties", pct: 100, shown: "∞ INFINITE" },
      { label: "Winning Arguments She Started", pct: 87, shown: "87%" },
      { label: "Saying \"I'm Five Minutes Away\"", pct: 96, shown: "96%" },
      { label: "Actually Being Five Minutes Away", pct: 9, shown: "9%" }
    ]
  },

  /* ---------- Chapter Two · Besties Confidential ----------
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
      caption: "Partner in every bad decision.",
      quote: "We do not talk about what happened last year.",
      letter:
        "You are dramatic and I would not change a thing.\n\nHappy birthday to " +
        "the loudest, funniest, most impossible person I know."
    },
    {
      name: "Akshaya",
      full: "Akshaya Nair",
      photo: "assets/img/akshaya.jpg",
      caption: "Same bench, every year.",
      quote: "Twelve years and you still steal my fries.",
      letter:
        "Same bench, same fries, same terrible jokes.\n\nI don't remember life " +
        "before you and I don't plan on finding out what it's like after."
    },
    {
      name: "Sanjana",
      full: "Sanjana Joshi",
      photo: "assets/img/sanjana.jpg",
      caption: "The one who made this whole thing.",
      quote: "I built you a magazine. Say thank you.",
      letter:
        "I made you an entire magazine, which should tell you everything about " +
        "how much you mean to me.\n\nHappy birthday, Raveen. Every page of this " +
        "is true."
    }
  ],

  // the chapter's closing page, used when the number of friends is odd
  bestiesRollTitle: "The Board of Besties",
  bestiesClosing:
    "Between them they have covered every era, every haircut and every " +
    "questionable decision. No notes.",
  bestiesClosingBy: "Filed by the Board of Besties",

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
