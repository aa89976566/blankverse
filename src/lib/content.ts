const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const asset = (path: string) => `${base}${path.startsWith("/") ? path : `/${path}`}`;

export const site = {
  name: "Blank Verse Films",
  tagline: "for the love of filmmaking",
  email: "udbhavi.films@gmail.com",
  url: "https://www.blankversefilms.com",
  youtubeShowreel: "https://www.youtube.com/watch?v=MDB41TwlpUg",
  year: "©2026",
  place: "London, UK · Mumbai, India",
  type: "Production",
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Showreel", href: "#showreel" },
  { label: "Studio", href: "#studio" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "Studio",
  categories: ["Film", "Production"],
  title: "Blank Verse Films",
  year: "©2026",
  meta: "Production house\nUK & India",
  caption: "for the love of filmmaking",
  image: "/media/hero-wide.jpg",
  pitch:
    "A production house built by two sisters — stories told with restraint, across borders.",
};

export const about = {
  title: "About",
  paragraphs: [
    "A dream by two sisters, Meghna and Udbhavi Upadhyay, Blank Verse Films is a production house operating across the UK and India. We offer end-to-end production services across a wide range of formats. Our work includes short films that have been officially nominated, selected, and screened at national and international film festivals. We have also produced a feature film shot in London and Malaysia, which is currently in post-production.",
    "At Blank Verse Films, we create across multiple formats. For us, these formats are simply different mediums through which stories can be told. We believe in impactful, responsible storytelling that resonates across borders.",
    "We do independent films to well-budgeted projects and have a wonderful pool of people who we work with.",
  ],
};

export const projects = [
  {
    title: "Therapist",
    detail: "Short · Proof of concept · 12 min · Festival circuit",
  },
  {
    title: "1 – 1",
    detail: "Psychological crime short · In post-production",
  },
  {
    title: "Athi-Athikka",
    detail: "Feature · London & Malaysia · In post-production",
  },
  {
    title: "Whiskey Sour",
    detail: "Short · Dir. Udbhavi Upadhyay",
  },
  {
    title: "Baat Baaki",
    detail: "Short · Dir. Udbhavi · Writer Meghna Upadhyay",
  },
  {
    title: "Oh Good Grief",
    detail: "Short · Producer Udbhavi Upadhyay",
  },
];

export const mandate = {
  title: "Mandate",
  body: "From proof-of-concept shorts to features, we take stories from the page to the screen — development, writing, directing, producing, and line producing. Fiction, documentary, music video, vertical series. The through-line stays the same: characters on emotional or societal margins, told with restraint and a clear visual language.",
};

export const approach = {
  title: "Approach",
  body: "Every format is a different door into the same question: how do people live with what they cannot say out loud? Sets stay small when they should, larger when the story asks. Crews in London and Mumbai. Festivals when the film is ready — not before.",
};

export const people = [
  {
    name: "Udbhavi Upadhyay",
    role: "Filmmaker · Writer · Producer",
    base: "London",
    image: "/media/filmmaker-portrait.jpg",
    bio: [
      "Udbhavi Upadhyay is a London-based filmmaker and writer originally from India. With over five years of experience in development and writing in Mumbai’s film industry, her work is rooted in emotionally driven storytelling that explores complex human relationships, silence, and unspoken truths. With a Master’s degree in Filmmaking at the London Film Academy, Udbhavi is focused on honing her directorial voice while building an international body of work. Her films have screened and been recognized at national and international film festivals.",
      "Udbhavi is particularly interested in stories that challenge social perceptions and give voice to characters who exist in emotional or societal margins. Her storytelling is marked by sensitivity, restraint, and a strong visual language shaped by her background as a writer who found her voice through cinema.",
      "She has directed several short films, music videos and documentaries and is preparing for her debut as a feature director. She has also produced shorts and a feature film currently in post-production, and has line produced on UK projects.",
    ],
  },
  {
    name: "Meghna Upadhyay",
    role: "Writer · Producer · Poet",
    base: "Mumbai",
    image: "/media/set-alley.jpg",
    bio: [
      "Meghna is a Mumbai-based spoken word poet, storyteller and writer with four years of stage experience across curated events, theatre shows and literature festivals. Venues include Kommune, Habitat, Rasa–the stage, Balgandharv Mandir, Mukti Manch and Cat Cafe Studio.",
      "She has written and produced a vertical series that deals with loneliness in the world of AI — a rare theme in the Indian vertical series space. Her writing is offbeat and nuanced; themes of feeling ‘out of this world’ run through her stories, songs and poems.",
      "She has produced a proof-of-concept short currently in post-production, and works on the Blank Verse Films slate as a writer and producer.",
    ],
  },
];

export const credits = [
  { label: "Studio", value: "Blank Verse Films" },
  { label: "Founders", value: "Meghna Upadhyay, Udbhavi Upadhyay" },
  { label: "Bases", value: "London, UK · Mumbai, India" },
  { label: "Formats", value: "Short · Feature · Documentary · Music video · Vertical" },
  { label: "Contact", value: "udbhavi.films@gmail.com" },
];

export const nextProject = {
  eyebrow: "Next Project",
  title: "Therapist",
  year: "©2023",
  meta: "Short film\nFestival circuit",
  image: "/media/therapist-crew.jpg",
  href: "#work",
};

export const gallery = [
  "/media/therapist-crew.jpg",
  "/media/night-still.jpg",
  "/media/baat-baaki.png",
  "/media/whiskey-sour.jpg",
  "/media/oh-good-grief.jpg",
  "/media/still-a.jpg",
];
