export interface MITLecture {
  id: number;
  title: string;
  videoUrl: string;
  duration: string;
  description?: string;
  subtitles?: {
    en?: string;
    tr?: string;
    ru?: string;
    ar?: string;
  };
}

export const mitBlockchainLectures: MITLecture[] = [
  {
    id: 1,
    title: "Lecture 1 – Introduction",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec01_300k.mp4",
    duration: "1:28:00",
    description: "Introduction to the course and blockchain technology",
    subtitles: {
      en: "/subtitles/mit-blockchain/lecture-01-en.vtt",
      tr: "/subtitles/mit-blockchain/lecture-01-tr.vtt",
      ru: "/subtitles/mit-blockchain/lecture-01-ru.vtt",
      ar: "/subtitles/mit-blockchain/lecture-01-ar.vtt",
    }
  },
  {
    id: 2,
    title: "Lecture 2 – Money, Ledgers & Bitcoin",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec02_300k.mp4",
    duration: "1:22:00",
    description: "Understanding money, ledgers, and Bitcoin basics"
  },
  {
    id: 3,
    title: "Lecture 3 – Blockchain Basics & Cryptography",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec03_300k.mp4",
    duration: "1:24:00",
    description: "Core concepts of blockchain technology"
  },
  {
    id: 4,
    title: "Lecture 4 – Blockchain Basics & Transactions, UTXO & Script Code",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec04_300k.mp4",
    duration: "1:23:00",
    description: "Bitcoin transactions and UTXO model"
  },
  {
    id: 5,
    title: "Lecture 5 – Blockchain Basics & Consensus",
    videoUrl: "https://ia803107.us.archive.org/23/items/MIT15.S12F18/MIT15_S12F18_lec05_300k.mp4",
    duration: "1:25:00",
    description: "Understanding distributed consensus mechanisms"
  },
  {
    id: 6,
    title: "Lecture 6 – Smart Contracts & DApps",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec06_300k.mp4",
    duration: "1:26:00",
    description: "Introduction to smart contracts and decentralized applications"
  },
  {
    id: 7,
    title: "Lecture 7 – Technical Challenges",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec07_300k.mp4",
    duration: "1:27:00",
    description: "Scalability, privacy, and other technical challenges"
  },
  {
    id: 8,
    title: "Lecture 8 – Public Policy",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec08_300k.mp4",
    duration: "1:24:00",
    description: "Regulatory and policy considerations"
  },
  {
    id: 9,
    title: "Lecture 9 – Permissioned Systems",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec09_300k.mp4",
    duration: "1:21:00",
    description: "Enterprise blockchain and permissioned networks"
  },
  {
    id: 10,
    title: "Lecture 10 – Financial System Challenges & Opportunities",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec10_300k.mp4",
    duration: "1:23:00",
    description: "How blockchain impacts traditional finance"
  },
  {
    id: 11,
    title: "Lecture 11 – Blockchain Economics",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec11_300k.mp4",
    duration: "1:25:00",
    description: "Economic models and incentives in blockchain"
  },
  {
    id: 12,
    title: "Lecture 12 – Assessing Use Cases",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec12_300k.mp4",
    duration: "1:22:00",
    description: "Evaluating real-world blockchain applications"
  },
  {
    id: 13,
    title: "Lecture 13 – Payments, Part 1",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec13_300k.mp4",
    duration: "1:20:00",
    description: "Blockchain in payment systems"
  },
  {
    id: 14,
    title: "Lecture 14 – Payments, Part 2",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec14_300k.mp4",
    duration: "1:24:00",
    description: "Advanced payment use cases"
  },
  {
    id: 15,
    title: "Lecture 15 – Central Banks & Commercial Banking, Part 1",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec15_300k.mp4",
    duration: "1:26:00",
    description: "Blockchain's impact on banking"
  },
  {
    id: 16,
    title: "Lecture 16 – Central Banks & Commercial Banking, Part 2",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec16_300k.mp4",
    duration: "1:23:00",
    description: "Central bank digital currencies"
  },
  {
    id: 17,
    title: "Lecture 17 – Secondary Markets & Crypto Exchanges",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec17_300k.mp4",
    duration: "1:25:00",
    description: "Cryptocurrency exchanges and markets"
  },
  {
    id: 18,
    title: "Lecture 18 – A Framework for Blockchain Ventures",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec18_300k.mp4",
    duration: "1:21:00",
    description: "Building blockchain startups"
  },
  {
    id: 19,
    title: "Lecture 19 – Primary Markets, ICOs & Venture Capital, Part 1",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec19_300k.mp4",
    duration: "1:27:00",
    description: "Token sales and fundraising"
  },
  {
    id: 20,
    title: "Lecture 20 – Primary Markets, ICOs & Venture Capital, Part 2",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec20_300k.mp4",
    duration: "1:24:00",
    description: "Regulatory aspects of ICOs"
  },
  {
    id: 21,
    title: "Lecture 21 – Post Trade Clearing, Settlement & Processing",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec21_300k.mp4",
    duration: "1:22:00",
    description: "Blockchain in post-trade infrastructure"
  },
  {
    id: 22,
    title: "Lecture 22 – Trade Finance & Supply Chain",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec22_300k.mp4",
    duration: "1:23:00",
    description: "Supply chain and trade finance applications"
  },
  {
    id: 23,
    title: "Lecture 23 – Digital ID",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec23_300k.mp4",
    duration: "1:20:00",
    description: "Digital identity on blockchain"
  },
  {
    id: 24,
    title: "Lecture 24 – Conclusion",
    videoUrl: "https://dn720003.ca.archive.org/0/items/MIT15.S12F18/MIT15_S12F18_lec24_300k.mp4",
    duration: "1:25:00",
    description: "Course wrap-up and future outlook"
  }
];
