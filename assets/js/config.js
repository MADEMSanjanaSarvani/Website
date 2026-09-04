/* ==========================================================================
   ✏️  EDIT THIS FILE — it is the whole magazine's content.
   Change the text between the quotes. Add or remove items from the lists.
   Photographs go in assets/img/ and are named here.
   ========================================================================== */

const SITE = {
  /* ---------- The issue ---------- */
  magazineName: "RAVEEN",
  issueLine: "Vol. 22 · Special Edition",
  strapline: "Worldwide Birthday Release",
  edition: "Collector's Issue",
  coverPrice: "Priceless",
  barcodeNo: "9 780220 200322",
  editionNo: "Edition N° 22",

  /* ---------- The birthday girl ---------- */
  name: "Raveen",
  fullName: "Lakkakula Sai Raveena Sowgandhika",
  age: 22,
  coverLine: "Turning 22 & looking undeniably iconic",
  birthday: "2026-11-14",           // drives the countdown on the cover
  coverPhoto: "assets/img/cover.jpg",

  /* ---------- Contents ---------- */
  editorialQuote:
    "22 years. Countless memories. Too many unhinged phone calls at 1 AM. " +
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
      { label: "Loyalty & Love to Her Besties", pct: 100, shown: "∞ INFINITE" }
    ]
  },

  /* ---------- Chapter Two · Besties Confidential ---------- */
  // The first two get a page each; the rest share a page.
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
    title: "Happy 22nd, Raveen!",
    message:
      "You are the loudest laugh in every room and the safest place in every " +
      "crisis. Thank you for every ordinary day you made better just by being " +
      "in it.\n\nHere's to twenty-two.",
    signoff: "With all our love — your squad",
    button: "Throw confetti"
  },

  /* ---------- The song on the cover ---------- */
  song: {
    title: "Our song",
    sub: "the one that is always playing",
    link: ""                        // paste a Spotify or YouTube link
  }
};

if (typeof window !== "undefined") window.SITE = SITE;
