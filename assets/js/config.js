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
        "Happy birthday to the person who has seen me at my absolute worst and " +
        "still texts me every morning.\n\nHere's to another year of you being " +
        "ridiculous and me enabling it."
    },
    {
      name: "Sreehitha",
      full: "Sreehitha Reddy",
      photo: "assets/img/sreehitha.jpg",
      caption: "The one who always says yes to a plan.",
      quote: "You are the reason my camera roll is full.",
      letter:
        "Twenty-two looks good on you.\n\nThank you for every 1am phone call, " +
        "every terrible idea, and every single time you picked up on the first ring."
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
