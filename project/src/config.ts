// Member blog RSS feed URLs for aggregation
// Posts with tag "pwnissa" will be included on the main blog
// to make this work a <meta title:pwnissa content:true> tag must be present in the
// head of the blogpost. also a rss feed must be present from which the blog can query.
// Only at deploy time the script checks the blogs, in the future this should be changed
// to a separate github action but i am too lazy.
export interface MemberFeed {
  nickname: string;
  rssFeed: string;
}

export const memberBlogFeeds: MemberFeed[] = [
  {
    nickname: "Ub1k",
    rssFeed: "https://blog.davidherm.es/rss.xml",
  },
  // Add more members with RSS feeds here
  // {
  //   nickname: "StealthGuy",
  //   rssFeed: "https://stealthguy.net/rss.xml",
  // },
];

export interface Member {
  nickname: string;
  name?: string;
  photo: string;
  link?: string;
  tags: string[];
}

export const members: Member[] = [
  {
    nickname: "StealthGuy",
    name: "Gabriele Alessandria",
    photo: "/immagini_membri/gabriele_alessandria.jpg",
    link: "https://stealthguy.net",
    tags: ["web", "network", "misc"],
  },
  {
    nickname: "Ubik",
    name: "David Hermes",
    photo: "/immagini_membri/david_hermes.jpg",
    link: "https://blog.davidherm.es/",
    tags: ["pwn", "bureaucracy"],
  },
  {
    nickname: "AndyVale",
    name: "Andrea Valentino Ricotti",
    photo: "/immagini_membri/andrea_ricotti.jpg",
    link: "https://github.com/AndyVale",
    tags: ["crypto"],
  },
  {
    nickname: "ThePirate",
    name: "Pietro Zignaigo",
    photo: "/immagini_membri/pietro_zignaigo.jpg",
    link: "https://github.com/ThePirate42",
    tags: ["crypto", "reverse"],
  },
  {
    nickname: "Redistan",
    name: "Riccardo Cherchi",
    photo: "/immagini_membri/riccardo_cherchi.jpg",
    link: "https://www.linkedin.com/in/riccardo-cherchi-2847b0181/",
    tags: ["web", "misc", "infra"],
  },
  {
    nickname: "e3py",
    name: "Giacomo Quarto",
    photo: "/immagini_membri/giacomo_quarto.jpg",
    link: "https://github.com/lmvjack",
    tags: ["pwn", "misc"],
  },
  {
    nickname: "Goligx",
    name: "Gabriele Olivieri",
    photo: "/immagini_membri/gabriele_olivieri.jpg",
    link: "https://github.com/Goligx",
    tags: ["crypto", "misc"],
  },
  {
    nickname: "Alicia",
    name: "Marta Castello",
    photo: "/immagini_membri/marta_castello.jpg",
    link: "https://www.linkedin.com/in/marta-castello-2a7376378",
    tags: ["pwn"],
  },
  {
    nickname: "Parcometro",
    name: "Maciej Costa",
    photo: "/immagini_membri/maciej_costa.jpg",
    link: "https://aboutmaciej.altervista.org/",
    tags: ["web", "network", "pwn"],
  },
  {
    nickname: "0x1Dav",
    name: "Davide Caldirola",
    photo: "/immagini_membri/davide_caldirola.jpg",
    link: "https://github.com/DavideCaldirola/CTF-Writeups",
    tags: ["web", "misc"],
  },
  {
    nickname: "gerert",
    name: "Giovanni B. Aragone",
    photo: "/immagini_membri/giovanni_aragone.jpg",
    link: "",
    tags: ["misc", "web"],
  },
  {
    nickname: "eriseisarai",
    name: "Erika Corbo",
    photo: "/immagini_membri/erika_corbo.jpg",
    link: "https://github.com/eriseisarai",
    tags: ["misc", "web", "bureaucracy"],
  },
  {
    nickname: "marco",
    name: "Marco Pellero",
    photo: "/immagini_membri/marco_pellero.jpg",
    link: "https://www.github.com/MarcoPellero",
    tags: ["pwn"],
  },
  {
    nickname: "il_vero_gabriele",
    name: "[REDACTED]",
    photo:
      "https://static.wikia.nocookie.net/spongebob/images/f/fc/SpongeBob_SquarePants_Theme_Song_%281998%29_01.png",
    link: "",
    tags: ["pwn"],
  },
  {
    nickname: "Pwny",
    name: "Pwny the Horse",
    photo: "/immagini_membri/pwny.jpg",
    link: "https://github.com/WAPEETY/ASCII-horses",
    tags: ["pwn", "gambling"],
  },
];

export interface Pet {
  name: string;
  photo: string;
  tags: string[];
}

export const pets: Pet[] = [
  {
    name: "Lupina",
    info: "In loving memory of Lupina, forever in my heart.",
    photo: "/img-pets/crop_lupina.jpeg", // Make sure to have these image paths
    tags: ["dog"],
  },
  {
    name: "Tofu",
    info: "Cat",
    photo: "/img-pets/tofu.jpg",
    tags: ["cat"],
  },

  {
    name: "Benny",
    info: "A leopard gecko that loves to hang upside down in its free time",
    photo: "/img-pets/benny.jpg",
    tags: ["reptile", "exotic"],
  },
  {
    name: "Giorgia",
    info: "She's blonde",
    photo: "/img-pets/giorgia.jpg",
    tags: ["reptile", "exotic"],
  },
  {
    name: "Muammy",
    info: "He likes to hide in his cave all day long",
    photo: "/img-pets/muammy.jpg",
    tags: ["reptile", "exotic"],
  },
  {
    name: "Macchia",
    info: "Why does he sit like that? Nobody knows",
    photo: "/img-pets/macchia.jpg",
    tags: ["cat"],
  },
  {
    name: "Malinka",
    info: "",
    photo: "/img-pets/malinka.jpg",
    tags: ["cat"],
  },
  {
    name: "Alicia",
    info: "Gargantuan, majestic and super intelligent.",
    photo: "/img-pets/alicia.jpg",
    tags: ["cat"],
  },
  {
    name: "Roberto",
    info: "",
    photo: "/img-pets/roberto.jpg",
    tags: ["wild boar"],
  },
];
