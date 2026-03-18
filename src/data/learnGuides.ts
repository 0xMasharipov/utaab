export interface Guide {
  id: string;
  titleKey: string;
  descriptionKey: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  icon: string;
}

export interface VideoTutorial {
  id: string;
  titleKey: string;
  descriptionKey: string;
  durationMinutes: number;
  thumbnail?: string;
  category: string;
}

export const guides: Guide[] = [
  {
    id: 'what-is-blockchain',
    titleKey: 'learnPage.guides.blockchain.title',
    descriptionKey: 'learnPage.guides.blockchain.description',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    icon: 'Blocks',
  },
  {
    id: 'create-wallet',
    titleKey: 'learnPage.guides.wallet.title',
    descriptionKey: 'learnPage.guides.wallet.description',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    icon: 'Wallet',
  },
  {
    id: 'intro-web3',
    titleKey: 'learnPage.guides.web3.title',
    descriptionKey: 'learnPage.guides.web3.description',
    difficulty: 'beginner',
    estimatedMinutes: 20,
    icon: 'Globe',
  },
  {
    id: 'smart-contracts',
    titleKey: 'learnPage.guides.smartContracts.title',
    descriptionKey: 'learnPage.guides.smartContracts.description',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    icon: 'FileCode',
  },
  {
    id: 'dao-participation',
    titleKey: 'learnPage.guides.dao.title',
    descriptionKey: 'learnPage.guides.dao.description',
    difficulty: 'intermediate',
    estimatedMinutes: 25,
    icon: 'Users',
  },
  {
    id: 'defi-fundamentals',
    titleKey: 'learnPage.guides.defi.title',
    descriptionKey: 'learnPage.guides.defi.description',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    icon: 'TrendingUp',
  },
];

export const videoTutorials: VideoTutorial[] = [
  {
    id: 'blockchain-explained',
    titleKey: 'learnPage.videos.blockchainExplained.title',
    descriptionKey: 'learnPage.videos.blockchainExplained.description',
    durationMinutes: 12,
    category: 'fundamentals',
  },
  {
    id: 'first-smart-contract',
    titleKey: 'learnPage.videos.firstContract.title',
    descriptionKey: 'learnPage.videos.firstContract.description',
    durationMinutes: 25,
    category: 'development',
  },
  {
    id: 'wallet-setup',
    titleKey: 'learnPage.videos.walletSetup.title',
    descriptionKey: 'learnPage.videos.walletSetup.description',
    durationMinutes: 8,
    category: 'fundamentals',
  },
  {
    id: 'defi-overview',
    titleKey: 'learnPage.videos.defiOverview.title',
    descriptionKey: 'learnPage.videos.defiOverview.description',
    durationMinutes: 18,
    category: 'defi',
  },
  {
    id: 'nft-creation',
    titleKey: 'learnPage.videos.nftCreation.title',
    descriptionKey: 'learnPage.videos.nftCreation.description',
    durationMinutes: 20,
    category: 'development',
  },
  {
    id: 'ton-ecosystem',
    titleKey: 'learnPage.videos.tonEcosystem.title',
    descriptionKey: 'learnPage.videos.tonEcosystem.description',
    durationMinutes: 15,
    category: 'ecosystem',
  },
];
