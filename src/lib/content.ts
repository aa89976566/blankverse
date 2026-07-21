const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (path: string) =>
  `${base}${path.startsWith("/") ? path : `/${path}`}`;

export type Credit = { role: string; name: string };

export type Project = {
  slug: string;
  title: string;
  shortTitle?: string;
  label: string;
  year: string;
  status: string;
  format: string;
  accent: string;
  wash: string;
  poster: string;
  cover: string;
  gallery: string[];
  video?: string;
  externalVideo?: string;
  synopsis: string;
  details: string[];
  credits: Credit[];
  links?: { label: string; href: string }[];
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
    label: "Therapist",
    year: "2023",
    status: "Festival circuit",
    format: "Short · Proof of concept · 12 min",
    accent: "#ff6b8a",
    wash: "#ffe4ec",
    poster: "/media/therapist-crew.jpg",
    cover: "/media/therapist-crew.jpg",
    gallery: [
      "/media/therapist-crew.jpg",
      "/media/still-a.jpg",
      "/media/portrait-a.jpg",
      "/media/still-b.jpg",
    ],
    video: "/video/clip-a.mp4",
    synopsis:
      "A 12-minute proof-of-concept short that explores the mental health of a child born of rape. Currently submitted to film festivals.",
    details: [
      "Proof of concept short film",
      "Runtime ≈ 12 minutes",
      "Submitted to national & international festivals",
      "Produced under Blank Verse Films",
    ],
    credits: [
      { role: "Studio", name: "Blank Verse Films" },
      { role: "Producers", name: "Meghna Upadhyay · Udbhavi Upadhyay" },
    ],
  },
  {
    slug: "one-to-one",
    title: "1 – 1",
    shortTitle: "1–1",
    label: "1 – 1",
    year: "2024",
    status: "In post-production",
    format: "Psychological crime short",
    accent: "#5b8def",
    wash: "#e4ecff",
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
    details: [
      "Psychological crime",
      "Short film",
      "Status: post-production",
    ],
    credits: [
      { role: "Studio", name: "Blank Verse Films" },
      { role: "Bases", name: "UK · India" },
    ],
  },
  {
    slug: "athi-athikka",
    title: "Athi-Athikka",
    label: "Athi-Athikka",
    year: "2025",
    status: "In post-production",
    format: "Tamil feature · London & Malaysia",
    accent: "#2db89a",
    wash: "#dff7f0",
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
  },
  {
    slug: "whiskey-sour",
    title: "Whiskey Sour",
    label: "Whiskey Sour",
    year: "2024",
    status: "Official Selection · Mumbai Shorts",
    format: "LGBTQ drama · Hindi · 17′33″",
    accent: "#f5c518",
    wash: "#fff6d6",
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
      "Country: India",
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
      {
        label: "IMDb",
        href: "https://www.imdb.com/title/tt32392458/",
      },
    ],
  },
  {
    slug: "baat-baaki",
    title: "Baat Baaki",
    shortTitle: "बात बाकी",
    label: "Baat Baaki",
    year: "2025",
    status: "Vertical series · Live on Instagram",
    format: "Micro / vertical series",
    accent: "#e8a14a",
    wash: "#ffe8cc",
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
      "Available via Blank Verse Films Instagram",
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
  },
  {
    slug: "waiting-room",
    title: "Waiting Room",
    label: "Waiting Room",
    year: "2025",
    status: "In post-production",
    format: "Short · Blank Verse Films presents",
    accent: "#9b7bff",
    wash: "#ece4ff",
    poster: "/media/set-alley.jpg",
    cover: "/media/set-alley.jpg",
    gallery: [
      "/media/set-alley.jpg",
      "/media/filmmaker-portrait.jpg",
      "/media/production-wide.jpg",
      "/media/still-b.jpg",
    ],
    synopsis:
      "Blank Verse Films presents Waiting Room — a short produced by Udbhavi Upadhyay with support from the London Film Academy ecosystem. Cast includes Paula Lindblom.",
    details: [
      "Short film",
      "Presented by Blank Verse Films",
      "Producer: Udbhavi Upadhyay",
      "Status: post-production",
    ],
    credits: [
      { role: "Presented by", name: "Blank Verse Films" },
      { role: "Producer", name: "Udbhavi Upadhyay" },
      { role: "Cast", name: "Paula Lindblom" },
    ],
  },
  {
    slug: "oh-good-grief",
    title: "Oh Good Grief",
    label: "Oh Good Grief",
    year: "2024",
    status: "Completed",
    format: "Short · Produced by Udbhavi",
    accent: "#4ecdc4",
    wash: "#d9f7f4",
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
  },
  {
    slug: "showreel",
    title: "Showreel",
    label: "Showreel",
    year: "2026",
    status: "Studio cut",
    format: "Selected clips · UK & India",
    accent: "#ff8a5c",
    wash: "#ffe5d9",
    poster: "/media/poster-a.png",
    cover: "/media/still-c.png",
    gallery: [
      "/media/poster-a.png",
      "/media/still-c.png",
      "/media/still-d.png",
      "/media/hero-wide.jpg",
    ],
    video: "/video/showreel.mp4",
    synopsis:
      "A living collage of Blank Verse Films work — festival shorts, features in post, vertical experiments, and the people who make them.",
    details: [
      "Compiled from studio productions",
      "Includes on-set and finished work",
    ],
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
  },
];

export const people = [
  {
    id: "udbhavi",
    name: "Udbhavi Upadhyay",
    role: "Filmmaker · Writer · Producer",
    place: "London",
    image: "/media/filmmaker-portrait.jpg",
    accent: "#ff6b8a",
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
    accent: "#5b8def",
    socials: [
      { label: "Studio IG", href: "https://www.instagram.com/blank_verse_films/" },
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
