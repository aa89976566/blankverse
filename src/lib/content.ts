const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (path: string) =>
  `${base}${path.startsWith("/") ? path : `/${path}`}`;

export type Credit = { role: string; name: string };

export type Project = {
  slug: string;
  title: string;
  /** lowercase label under poster, Justine-style */
  label: string;
  type: string;
  year: string;
  status: string;
  color: string;
  transitionColor: string;
  scrollbarColor: string;
  poster: string;
  cover: string;
  gallery: string[];
  video?: string;
  externalVideo?: string;
  synopsis: string;
  details: string[];
  credits: Credit[];
  links?: { label: string; href: string }[];
  introBg?: string;
  introText?: string;
  typeBg?: string;
  typeText?: string;
};

export const site = {
  name: "Blank Verse Films",
  tagline: "for the love of filmmaking",
  honesty: "Where Art means Honesty",
  email: "udbhavi.films@gmail.com",
  url: "https://www.blankversefilms.com",
  youtube: "https://www.youtube.com/watch?v=MDB41TwlpUg",
  instagram: "https://www.instagram.com/blank_verse_films/",
  udbhaviIg: "https://www.instagram.com/udbhavi_films/",
  bases: ["London", "Mumbai"],
  intro: "Hello — we're Blank Verse Films",
};

export const studioCopy = [
  "A dream by two sisters, Meghna and Udbhavi Upadhyay, Blank Verse Films is a production house operating across the UK and India. We offer end-to-end production services across a wide range of formats. Our work includes short films that have been officially nominated, selected, and screened at national and international film festivals. We have also produced a feature film shot in London and Malaysia, which is currently in post-production.",
  "At Blank Verse Films, we create across multiple formats. For us, these formats are simply different mediums through which stories can be told. We believe in impactful, responsible storytelling that resonates across borders.",
  "We do independent films to well-budgeted projects and have a wonderful pool of people who we work with.",
];

export const projects: Project[] = [
  {
    slug: "therapist",
    title: "Therapist",
    label: "therapist",
    type: "proof of concept · 12 min",
    year: "2023",
    status: "Festival circuit",
    color: "#ffe4ec",
    transitionColor: "#ff6b8a",
    scrollbarColor: "#ff6b8a",
    poster: "/media/therapist-crew.jpg",
    cover: "/media/therapist-crew.jpg",
    gallery: [
      "/media/therapist-crew.jpg",
      "/media/still-a.jpg",
      "/media/portrait-a.jpg",
      "/media/still-b.jpg",
      "/media/production-wide.jpg",
    ],
    video: "/video/clip-a.mp4",
    synopsis:
      "A 12-minute proof-of-concept short that explores the mental health of a child born of rape. Currently submitted to film festivals.",
    details: [
      "Proof of concept short film",
      "Runtime ≈ 12 minutes",
      "Submitted to national & international festivals",
    ],
    credits: [
      { role: "Studio", name: "Blank Verse Films" },
      { role: "Producers", name: "Meghna Upadhyay · Udbhavi Upadhyay" },
    ],
    introBg: "#f7f7f7",
    introText: "#8c8080",
    typeBg: "#ff6b8a",
    typeText: "#ffffff",
  },
  {
    slug: "one-to-one",
    title: "1 – 1",
    label: "1 – 1",
    type: "psychological crime short",
    year: "2024",
    status: "In post-production",
    color: "#e4ecff",
    transitionColor: "#5b8def",
    scrollbarColor: "#5b8def",
    poster: "/media/night-still.jpg",
    cover: "/media/night-still.jpg",
    gallery: [
      "/media/night-still.jpg",
      "/media/still-c.png",
      "/media/set-alley.jpg",
      "/media/production-wide.jpg",
    ],
    video: "/video/clip-b.mp4",
    synopsis:
      "A psychological crime short film currently in post-production — tense, intimate, and built around what people refuse to say out loud.",
    details: ["Psychological crime", "Short film", "Status: post-production"],
    credits: [
      { role: "Studio", name: "Blank Verse Films" },
      { role: "Bases", name: "UK · India" },
    ],
    introBg: "#f4f0ed",
    introText: "#8c8080",
    typeBg: "#5b8def",
    typeText: "#ffffff",
  },
  {
    slug: "athi-athikka",
    title: "Athi-Athikka",
    label: "athi-athikka",
    type: "tamil feature · london & malaysia",
    year: "2025",
    status: "In post-production",
    color: "#dff7f0",
    transitionColor: "#2db89a",
    scrollbarColor: "#2db89a",
    poster: "/media/hero-wide.jpg",
    cover: "/media/hero-wide.jpg",
    gallery: [
      "/media/hero-wide.jpg",
      "/media/set-alley.jpg",
      "/media/still-d.png",
      "/media/portrait-c.jpg",
    ],
    synopsis:
      "A Tamil-language feature film shot in London and Malaysia. Currently in post-production and seeking distribution pathways.",
    details: [
      "Feature film",
      "Language: Tamil",
      "Filmed in London & Malaysia",
      "Status: post-production",
    ],
    credits: [
      { role: "Studio", name: "Blank Verse Films" },
      { role: "Producer", name: "Udbhavi Upadhyay" },
    ],
    introBg: "#f4f0ed",
    introText: "#8c8080",
    typeBg: "#2db89a",
    typeText: "#ffffff",
  },
  {
    slug: "whiskey-sour",
    title: "Whiskey Sour",
    label: "whiskey sour",
    type: "lgbtq drama · hindi · 17′33″",
    year: "2024",
    status: "Official Selection · Mumbai Shorts",
    color: "#fff6d6",
    transitionColor: "#f5c518",
    scrollbarColor: "#f5c518",
    poster: "/media/whiskey-sour.jpg",
    cover: "/media/external/whiskey-sour-yt.jpg",
    gallery: [
      "/media/whiskey-sour.jpg",
      "/media/external/whiskey-sour-yt.jpg",
      "/media/square-a.jpg",
      "/media/portrait-b.jpg",
    ],
    externalVideo: "https://www.youtube.com/watch?v=MDB41TwlpUg",
    synopsis:
      "Two former lovers meet awkwardly in a café and unveil true feelings over a conversation. An LGBTQ relationship drama written, directed and produced by Udbhavi Upadhyay.",
    details: [
      "Runtime: 17 minutes 33 seconds",
      "Language: Hindi · Subtitles: English",
      "Genre: LGBTQ · Drama · Romance",
      "Completion: 30 June 2024",
      "IMDb: tt32392458",
      "13th Mumbai Shorts Int. Film Festival — Official Selection",
    ],
    credits: [
      { role: "Written & Directed by", name: "Udbhavi Upadhyay" },
      { role: "Produced by", name: "Manjula Roy · Udbhavi Upadhyay" },
      { role: "Starring", name: "Sanjana Deshmukh · Meghna Upadhyay" },
      { role: "DOP", name: "Diksha Agrawal" },
      { role: "Editor", name: "Dipti Ronghe" },
      { role: "Colourist", name: "Sahil Amin" },
      { role: "Sound Design", name: "Sahishnu Tongaonkar" },
      { role: "Music", name: "Jyotiraditya Bhujang · Palash Jain" },
      { role: "Sound Recordist", name: "Arunabh Nath" },
      { role: "Make Up", name: "Palak Wadhwani & Team" },
      { role: "Production", name: "Blank Verse Films · Radicle Films" },
    ],
    links: [
      {
        label: "Watch on YouTube",
        href: "https://www.youtube.com/watch?v=MDB41TwlpUg",
      },
      { label: "IMDb", href: "https://www.imdb.com/title/tt32392458/" },
    ],
    introBg: "#fafaf7",
    introText: "#8c8080",
    typeBg: "#f5c518",
    typeText: "#252422",
  },
  {
    slug: "baat-baaki",
    title: "Baat Baaki",
    label: "baat baaki",
    type: "vertical series",
    year: "2025",
    status: "Live on Instagram",
    color: "#ffe8cc",
    transitionColor: "#e8a14a",
    scrollbarColor: "#e8a14a",
    poster: "/media/baat-baaki.png",
    cover: "/media/baat-baaki.png",
    gallery: [
      "/media/baat-baaki.png",
      "/media/night-still.jpg",
      "/media/still-a.jpg",
      "/media/square-a.jpg",
    ],
    synopsis:
      "A vertical series that dabbles with loneliness in the world of AI — rare in the Indian vertical-series space. Directed by Udbhavi, written by Meghna, shot in Mumbai on extremely limited time and resources.",
    details: [
      "Vertical / micro series",
      "Themes: loneliness · AI · intimacy",
      "Shot in Mumbai",
    ],
    credits: [
      { role: "Director", name: "Udbhavi Upadhyay" },
      { role: "Writer", name: "Meghna Upadhyay" },
      { role: "DOP", name: "Hibban Ashraf" },
      { role: "Camera assistant", name: "Qaanith Masoodi" },
      { role: "Editor", name: "Nihit Srivastava" },
      { role: "Assistant directors", name: "Aaditi · Aditya" },
      { role: "Art", name: "Sanjana Deshmukh" },
      { role: "Make up", name: "Nafisa" },
      { role: "Special thanks", name: "OnToes pub and restaurant" },
      { role: "Production", name: "Blank Verse Films" },
    ],
    links: [
      {
        label: "Instagram @blank_verse_films",
        href: "https://www.instagram.com/blank_verse_films/",
      },
    ],
    introBg: "#fff8ef",
    introText: "#8c8080",
    typeBg: "#e8a14a",
    typeText: "#ffffff",
  },
  {
    slug: "waiting-room",
    title: "Waiting Room",
    label: "waiting room",
    type: "short · presented by bvf",
    year: "2025",
    status: "In post-production",
    color: "#ece4ff",
    transitionColor: "#9b7bff",
    scrollbarColor: "#9b7bff",
    poster: "/media/set-alley.jpg",
    cover: "/media/set-alley.jpg",
    gallery: [
      "/media/set-alley.jpg",
      "/media/filmmaker-portrait.jpg",
      "/media/production-wide.jpg",
      "/media/still-b.jpg",
    ],
    synopsis:
      "Blank Verse Films presents Waiting Room — a short produced by Udbhavi Upadhyay. Cast includes Paula Lindblom.",
    details: [
      "Short film",
      "Presented by Blank Verse Films",
      "Producer: Udbhavi Upadhyay",
    ],
    credits: [
      { role: "Presented by", name: "Blank Verse Films" },
      { role: "Producer", name: "Udbhavi Upadhyay" },
      { role: "Cast", name: "Paula Lindblom" },
    ],
    introBg: "#f4f0ed",
    introText: "#8c8080",
    typeBg: "#9b7bff",
    typeText: "#ffffff",
  },
  {
    slug: "oh-good-grief",
    title: "Oh Good Grief",
    label: "oh good grief",
    type: "short · produced by udbhavi",
    year: "2024",
    status: "Completed",
    color: "#d9f7f4",
    transitionColor: "#4ecdc4",
    scrollbarColor: "#4ecdc4",
    poster: "/media/oh-good-grief.jpg",
    cover: "/media/oh-good-grief.jpg",
    gallery: [
      "/media/oh-good-grief.jpg",
      "/media/portrait-b.jpg",
      "/media/still-a.jpg",
    ],
    synopsis:
      "A short film produced by Udbhavi Upadhyay — part of the growing slate of intimate, character-led work around Blank Verse Films.",
    details: ["Short film", "Producer: Udbhavi Upadhyay"],
    credits: [
      { role: "Producer", name: "Udbhavi Upadhyay" },
      { role: "Studio", name: "Blank Verse Films" },
    ],
    introBg: "#f4f0ed",
    introText: "#8c8080",
    typeBg: "#4ecdc4",
    typeText: "#ffffff",
  },
  {
    slug: "showreel",
    title: "Showreel",
    label: "showreel",
    type: "studio cut · uk & india",
    year: "2026",
    status: "Studio cut",
    color: "#ffe5d9",
    transitionColor: "#ff8a5c",
    scrollbarColor: "#ff8a5c",
    poster: "/media/poster-a.png",
    cover: "/media/still-c.png",
    gallery: [
      "/media/poster-a.png",
      "/media/still-c.png",
      "/media/still-d.png",
      "/media/hero-wide.jpg",
      "/media/filmmaker-portrait.jpg",
    ],
    video: "/video/showreel.mp4",
    synopsis:
      "A living collage of Blank Verse Films work — festival shorts, features in post, vertical experiments, and the people who make them.",
    details: ["Compiled from studio productions"],
    credits: [
      { role: "Studio", name: "Blank Verse Films" },
      { role: "Founders", name: "Meghna Upadhyay · Udbhavi Upadhyay" },
    ],
    links: [
      {
        label: "Whiskey Sour on YouTube",
        href: "https://www.youtube.com/watch?v=MDB41TwlpUg",
      },
    ],
    introBg: "#f4f0ed",
    introText: "#8c8080",
    typeBg: "#ff8a5c",
    typeText: "#ffffff",
  },
];

export const people = [
  {
    id: "udbhavi",
    name: "Udbhavi Upadhyay",
    role: "Filmmaker · Writer · Producer",
    place: "London",
    image: "/media/filmmaker-portrait.jpg",
    color: "#ffe4ec",
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/udbhavi_films/" },
      { label: "Email", href: "mailto:udbhavi.films@gmail.com" },
    ],
    bio: [
      "Udbhavi Upadhyay is a London-based filmmaker and writer originally from India. With over five years of experience in development and writing in Mumbai’s film industry, her work is rooted in emotionally driven storytelling that explores complex human relationships, silence, and unspoken truths.",
      "With a Master’s in Filmmaking from the London Film Academy, she is honing her directorial voice while building an international body of work. Her films have screened and been recognized at national and international festivals. She received the Emerging Filmmaker Award ’25 (LFA).",
      "She started as a photojournalist with the Times Group, worked in writers’ rooms including Golden Ratio Films, and contributed to projects such as the National Award-winning Goshta Eka Paithanichi, Baby Crasto (UK Asian Film Festival), and an upcoming Jio Studios feature Ghamasaan.",
      "She has directed shorts, a music video and documentaries; wrote, directed and produced Whiskey Sour; directed Baat Baaki; produced Waiting Room and Oh Good Grief; and produced the Tamil feature Athi Athikka (London & Malaysia, in post). She is preparing a feature to be shot in India.",
    ],
  },
  {
    id: "meghna",
    name: "Meghna Upadhyay",
    role: "Writer · Producer · Poet",
    place: "Mumbai",
    image: "/media/set-alley.jpg",
    color: "#e4ecff",
    socials: [
      {
        label: "Studio IG",
        href: "https://www.instagram.com/blank_verse_films/",
      },
    ],
    bio: [
      "Meghna is a Mumbai-based spoken word poet, storyteller and writer with four years of stage experience across curated events, theatre shows and literature festivals. Venues include Kommune, Habitat, Rasa–the stage, Balgandharv Mandir, Mukti Manch and Cat Cafe Studio.",
      "She wrote Baat Baaki, a vertical series about loneliness in the world of AI — rare in the Indian vertical-series space. Her writing is offbeat and nuanced; themes of feeling ‘out of this world’ run through her stories, songs and poems.",
      "She acts in Whiskey Sour, has produced a proof-of-concept short in post-production, and works on the Blank Verse Films slate as a writer and producer.",
    ],
  },
];

export const archiveStills = [
  "/media/hero-wide.jpg",
  "/media/therapist-crew.jpg",
  "/media/filmmaker-portrait.jpg",
  "/media/night-still.jpg",
  "/media/baat-baaki.png",
  "/media/whiskey-sour.jpg",
  "/media/oh-good-grief.jpg",
  "/media/set-alley.jpg",
  "/media/still-a.jpg",
  "/media/still-c.png",
  "/media/still-d.png",
  "/media/poster-a.png",
  "/media/portrait-a.jpg",
  "/media/portrait-b.jpg",
  "/media/portrait-c.jpg",
  "/media/square-a.jpg",
  "/media/production-wide.jpg",
  "/media/external/whiskey-sour-yt.jpg",
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
