/* ==========================================================================
   ✏️  EDIT THIS FILE — it is the whole website's content.
   Nothing here is code you need to understand. Change the text between the
   quotes, add or delete items from the lists, and the pages update themselves.

   Photos: drop your images into  assets/img/  and write the file name, e.g.
        photo: "assets/img/sarah.jpg"
   Leave a photo as ""  and a pretty placeholder shows up instead.
   ========================================================================== */

const SITE = {
  /* ---------- The magazine ---------- */
  magazineName: "The Archive",
  magazineSub: "The Birthday Issue · One copy · Never reprinted",
  issueLine: "Issue No. 23",
  coverPrice: "Priceless",

  // The lines printed down the sides of the cover.
  // side: "left" or "right" — right-hand lines are hidden on phones.
  coverlines: [
    { side: "left",  title: "The Contributors",  text: "Everyone who had the privilege of knowing {name} — in their own words." },
    { side: "left",  title: "A Life in Chapters", text: "From a dropped water bottle to right now." },
    { side: "left",  title: "The Unpublished",   text: "Photographs that should not exist. Printed anyway." },
    { side: "right", title: "Moving Pictures",   text: "Footage filmed vertically, treated as cinema." },
    { side: "right", title: "Letters",           text: "Correspondence from people who love her." },
    { side: "right", title: "The Last Word",     text: "Do not turn to this page early." }
  ],

  // Editor's letter
  letterTitle: "A note before you begin",
  letterPull: "Ten years from now this is the only thing you'll still have from today.",
  marginNote: "keep this one.",

  /* ---------- The birthday person ---------- */
  name: "Sowgandhika",
  nickname: "Sow",
  age: 23,
  // Format: YYYY-MM-DD  (used for the countdown on the home page)
  birthday: "2026-11-14",
  since: "Est. 2024",
  tagline: "Everything we refuse to forget, in one place.",

  // The short letter on the home page
  intro:
    "This is not a website. It's a shoebox — the kind you shove under a bed and " +
    "open ten years later. Inside: the photos we swore we'd delete, the voice " +
    "notes at 3am, the inside jokes nobody else will ever get. All of it, for you.",

  signoff: "with our whole chaotic hearts,",
  signedBy: "everyone who loves you",

  /* ---------- THE DOSSIER (the panel on the front board) ---------- */
  // Mock official paperwork. Keep it stupid — that is the whole point.
  dossier: {
    stamp: "Approved for another year",
    ref: "Ref. SOW/23/BDAY",
    rows: [
      { label: "Drama",              pct: 94, note: "unmedicated" },
      { label: "Punctuality",        pct: 11, note: "aspirational" },
      { label: "Snack theft",        pct: 88, note: "yours, specifically" },
      { label: "Voice notes sent",   pct: 97, note: "4 minutes minimum" },
      { label: "Accepting a compliment", pct: 6, note: "under review" }
    ],
    warnings: [
      "Do not feed after midnight. She will not stop talking.",
      "Contains 100% of your recommended daily chaos.",
      "May spontaneously cry at a dog advert.",
      "Known to say \"one more episode\" at 2am. Do not believe her."
    ],
    smallprint:
      "Subject has been continuously operational for twenty-three years with no " +
      "recall notice issued. Warranty void if she finds out we wrote this."
  },

  /* ---------- ABOUT YOU (chapter one) ---------- */
  about: {
    title: "About you",
    text:
      "Twenty-three years of being the loudest laugh in the room and the first " +
      "person everyone calls when it all goes wrong. You remember birthdays " +
      "nobody told you about. You cry at adverts. You have never once let a " +
      "friend walk home alone.\n\nThis is the part of the book where we try to " +
      "write you down, and fail, and print it anyway.",

    // Small facts, printed as a list. Add or remove freely.
    facts: [
      { label: "Known for",        value: "Being three minutes late, every time" },
      { label: "Dangerous around", value: "Anything with cheese in it" },
      { label: "Would fight over", value: "The last samosa" },
      { label: "Best at",          value: "Making a bad day feel survivable" },
      { label: "Worst at",         value: "Accepting a compliment" }
    ]
  },

  /* ---------- FRIENDS ---------- */
  // "tag" must match one of the filter chips below.
  friendTags: [
    "Besties",
    "Day Ones",
    "Partners in Crime",
    "School Era",
    "College Era",
    "Travel Buddies"
  ],

  friends: [
    {
      name: "Sarah J.",
      tag: "Besties",
      emoji: "🎀",
      photo: "assets/img/friend-1.jpg",
      photoHint: "coffee shop chronicles, winter '24",
      quote: "Still can't believe we survived that trip to Miami…",
      letter:
        "Happy birthday to the person who has seen me at my absolute worst and " +
        "still texts me every morning.\n\nRemember the Miami trip? You lost your " +
        "shoe, I lost my mind, and somehow it's still the best week of my life.\n\n" +
        "Here's to another year of you being ridiculous and me enabling it."
    },
    {
      name: "Mike T.",
      tag: "Partners in Crime",
      emoji: "😜",
      photo: "assets/img/friend-2.jpg",
      style: "note",
      quote: "I'm only here for the cake. But seriously, happy birthday to the most dramatic person I know.",
      letter:
        "You are dramatic. That is the whole message.\n\nOkay fine — you're also " +
        "the first person I call when something goes wrong, and the first person " +
        "I call when something goes right. Happy birthday, drama queen."
    },
    {
      name: "The Study Group",
      tag: "College Era",
      emoji: "🎓",
      photo: "assets/img/friend-3.jpg",
      photoHint: "graduation day, blurry and perfect",
      quote: "We carried you through Econ 101. You're welcome.",
      letter:
        "From all of us: happy birthday.\n\nThank you for the shared notes, the " +
        "panicked 2am voice notes, and for never once letting any of us give up.\n\n" +
        "We made it. Partly because of you."
    },
    {
      name: "Ananya",
      tag: "Day Ones",
      emoji: "🌸",
      photo: "assets/img/friend-4.jpg",
      photoHint: "same bench, every year",
      quote: "Twelve years and you still steal my fries.",
      letter:
        "Twelve years. Same bench, same fries, same terrible jokes.\n\nI don't " +
        "remember life before you and I don't plan on finding out what it's like " +
        "after. Happy birthday, oldest friend."
    },
    {
      name: "Rhea & Kabir",
      tag: "Travel Buddies",
      emoji: "✈️",
      photo: "assets/img/friend-5.jpg",
      photoHint: "airport floor, 4am, no regrets",
      quote: "Next trip is on you. That's the gift.",
      letter:
        "Three countries, one missed flight, zero regrets.\n\nHappy birthday to " +
        "our favourite travel disaster. Pack a bag — we're going again."
    },
    {
      name: "Class of '19",
      tag: "School Era",
      emoji: "📚",
      photo: "assets/img/friend-6.jpg",
      style: "note",
      quote: "You were loud in the back row and we're grateful for it.",
      letter:
        "The back row misses you.\n\nHappy birthday from everyone who spent four " +
        "years laughing when they should have been listening."
    }
  ],

  /* ---------- FAMILY (chapter three) ---------- */
  // Same shape as the friends list. "tag" is the relation.
  family: [
    {
      name: "Amma",
      tag: "Mother",
      photo: "assets/img/family-1.jpg",
      photoHint: "assets/img/amma.jpg",
      quote: "My whole heart, walking around outside my body.",
      letter:
        "You were the easiest baby and the hardest teenager and you have grown " +
        "into someone I would choose as a friend.\n\nHappy birthday, kanna. " +
        "Come home soon. I have made too much food again."
    },
    {
      name: "Nanna",
      tag: "Father",
      photo: "assets/img/family-2.jpg",
      photoHint: "assets/img/nanna.jpg",
      quote: "Still my little girl. Still arguing with me about everything.",
      letter:
        "I do not say these things out loud, so I am writing them down.\n\n" +
        "I am proud of you. I have always been proud of you. Happy birthday."
    },
    {
      name: "Dev",
      tag: "Brother",
      photo: "assets/img/family-3.jpg",
      photoHint: "assets/img/dev.jpg",
      quote: "You owe me \u20b9200 from 2022. Happy birthday anyway.",
      letter:
        "Congratulations on getting old.\n\nYou are the only person who has " +
        "never once made me feel stupid for asking a question. That is worth " +
        "more than \u20b9200. But I still want the \u20b9200."
    },
    {
      name: "The cousins",
      tag: "Chaos division",
      photo: "assets/img/family-4.jpg",
      photoHint: "assets/img/cousins.jpg",
      quote: "Every wedding, same corner, same trouble.",
      letter:
        "From all of us at the back of every family function: happy birthday.\n\n" +
        "Next one is at your place. We have already decided."
    }
  ],

  /* ---------- CRINGE ARCHIVE ---------- */
  cringeTitle: "Things we should probably delete",
  cringeSub: "(but won't)",

  cringe: [
    { photo: "", caption: "no context.", hint: "the face. you know the one." },
    { photo: "", caption: "delete this immediately.", hint: "3am group chat, screenshotted forever" },
    { photo: "", caption: "help.", hint: "the coffee incident" },
    { photo: "", caption: "character development was not happening.", style: "note" },
    { photo: "", caption: "we do not talk about this year.", hint: "the fringe era" },
    { photo: "", caption: "peak confidence, zero evidence.", hint: "karaoke night" }
  ],

  /* ---------- VIDEOS ---------- */
  // "src" can be a local file (assets/video/x.mp4) or a YouTube EMBED link
  // e.g. "https://www.youtube.com/embed/XXXXXXXX"
  videos: [
    { title: "The interpretive dance era.", src: "", poster: "", note: "Recorded without consent. Kept without shame." },
    { title: "Attempting to cook (failed).", src: "", poster: "", note: "The smoke alarm has a cameo." },
    { title: "Birthday message compilation", src: "", poster: "", note: "Everyone talking over each other, as usual." },
    { title: "That road trip singalong", src: "", poster: "", note: "Nobody knew the second verse." }
  ],

  /* ---------- TIMELINE ---------- */
  timeline: [
    { year: "2014", title: "The beginning", text: "A hallway, a dropped water bottle, and an apology that turned into a decade." },
    { year: "2017", title: "The chaos years", text: "Late buses, shared earphones, and a group chat that has never once been muted." },
    { year: "2019", title: "Graduation", text: "Everyone cried. You cried the loudest and then denied it in the parking lot." },
    { year: "2021", title: "The move", text: "New city, new everything. Same 2am phone calls." },
    { year: "2023", title: "The trip", text: "Three countries, one missed flight, and a photo album we still argue about." },
    { year: "2026", title: "This year", text: "You turned another year older and somehow got even more insufferable. We're proud." }
  ],

  /* ---------- WISHES WALL ---------- */
  wishes: [
    { from: "Amma", text: "My whole heart, walking around outside my body. Happy birthday, kanna." },
    { from: "Dev", text: "You owe me ₹200 from 2022. Happy birthday anyway." },
    { from: "Priya", text: "Thank you for being the person who always texts first. Nobody does that anymore." },
    { from: "Your 3am friend", text: "Still awake. Still here. Always will be." },
    { from: "Nithya", text: "You make ordinary Tuesdays feel like something worth showing up for." },
    { from: "The whole gang", text: "HAPPY BIRTHDAY!!! (yes we're shouting)" }
  ],

  /* ---------- THE FILMSTRIP (right-hand page of the photo essay) ---------- */
  // Four small square photos running down a strip of film.
  // Leave the list as "" entries and they show as blank frames.
  filmstrip: [
    "assets/img/strip-1.jpg",   // peach kurta, white wall
    "assets/img/strip-2.jpg",   // pink kurta, garden
    "assets/img/strip-3.jpg",   // holding the palm trunk
    "assets/img/strip-4.jpg"    // lavender kurta
  ],

  /* ---------- THE GALLERY (a whole spread of her, in Life) ---------- */
  // Add or remove freely — the spread lays out however many you give it.
  gallery: [
    { src: "assets/img/gallery-1.jpg", caption: "" },
    { src: "assets/img/gallery-2.jpg", caption: "" },
    { src: "assets/img/gallery-3.jpg", caption: "" },
    { src: "assets/img/gallery-4.jpg", caption: "" }
  ],

  /* ---------- NOW PLAYING (the song card over the full-page photo) ------- */
  nowPlaying: {
    title: "Stuck with you",          // written in the handwriting font
    sub: "my love all mine...",
    art: "",                          // e.g. "assets/img/song-art.jpg"
    elapsed: "0:02",
    total: "3:12",
    link: ""                          // paste a Spotify/YouTube song link
  },

  /* ---------- PLAYLIST ---------- */
  playlistTitle: "The soundtrack",
  playlistLink: "", // paste a Spotify/YouTube playlist link here
  tracks: [
    { title: "Dancing Queen", artist: "ABBA", note: "the anthem. non-negotiable.", len: "3:51" },
    { title: "Ribs", artist: "Lorde", note: "for the 2am car rides.", len: "4:19" },
    { title: "Best Friend", artist: "Rex Orange County", note: "self explanatory.", len: "3:33" },
    { title: "Cruel Summer", artist: "Taylor Swift", note: "you screamed this in a moving car.", len: "2:58" },
    { title: "Kabira", artist: "Pritam", note: "the one that makes you quiet.", len: "3:43" },
    { title: "September", artist: "Earth, Wind & Fire", note: "kitchen dancing, every time.", len: "3:35" }
  ],

  /* ---------- FINAL SURPRISE ---------- */
  final: {
    title: "make a wish",
    sub: "then blow out the candle",
    message:
      "You are the loudest laugh in every room and the " +
      "safest place in every crisis. Thank you for every single ordinary day you " +
      "made better just by being in it.\n\nWe hope this year is kind to you. And " +
      "if it isn't — you know where to find us.",
    button: "Read it again"
  },

  /* ---------- FOOTER ---------- */
  footer: "Made with too much love and not enough sleep."
};

// makes SITE available to every page — don't edit this line
if (typeof window !== "undefined") window.SITE = SITE;
