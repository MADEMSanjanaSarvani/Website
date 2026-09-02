/* ==========================================================================
   ✏️  EDIT THIS FILE — it is the whole website's content.
   Nothing here is code you need to understand. Change the text between the
   quotes, add or delete items from the lists, and the pages update themselves.

   Photos: drop your images into  assets/img/  and write the file name, e.g.
        photo: "assets/img/sarah.jpg"
   Leave a photo as ""  and a pretty placeholder shows up instead.
   ========================================================================== */

const SITE = {
  /* ---------- The birthday person ---------- */
  name: "Sowgandhika",
  nickname: "Sow",
  age: 23,
  // Format: YYYY-MM-DD  (used for the countdown on the home page)
  birthday: "2026-11-14",
  since: "Est. 2024",
  tagline: "a scrapbook of everything we refuse to forget",

  // The short letter on the home page
  intro:
    "This is not a website. It's a shoebox — the kind you shove under a bed and " +
    "open ten years later. Inside: the photos we swore we'd delete, the voice " +
    "notes at 3am, the inside jokes nobody else will ever get. All of it, for you.",

  signoff: "with our whole chaotic hearts,",
  signedBy: "everyone who loves you",

  /* ---------- Navigation ---------- */
  // Delete a line to remove that page from the menu.
  nav: [
    { label: "Home ♡",   icon: "⌂", href: "index.html" },
    { label: "Friends",  icon: "☺", href: "friends.html" },
    { label: "Timeline", icon: "❋", href: "timeline.html" },
    { label: "Cringe",   icon: "☂", href: "cringe.html" },
    { label: "Videos",   icon: "▶", href: "videos.html" },
    { label: "Wishes",   icon: "✎", href: "wishes.html" },
    { label: "Playlist", icon: "♪", href: "playlist.html" },
    { label: "Final",    icon: "✦", href: "final.html" }
  ],

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
      photo: "",
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
      photo: "",
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
      photo: "",
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
      photo: "",
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
      photo: "",
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
      photo: "",
      style: "note",
      quote: "You were loud in the back row and we're grateful for it.",
      letter:
        "The back row misses you.\n\nHappy birthday from everyone who spent four " +
        "years laughing when they should have been listening."
    }
  ],

  /* ---------- CRINGE ARCHIVE ---------- */
  cringeTitle: "things we should probably delete",
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

  /* ---------- PLAYLIST ---------- */
  playlistTitle: "songs that are legally about you",
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
    button: "Replay the whole thing"
  },

  /* ---------- FOOTER ---------- */
  footer: "made with too much love and not enough sleep ♡"
};

// makes SITE available to every page — don't edit this line
if (typeof window !== "undefined") window.SITE = SITE;
