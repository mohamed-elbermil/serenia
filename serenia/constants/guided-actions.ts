export type ActionStep = {
  text: string;
  duration?: number;
};

export type ActionPlan = {
  preface: string;
  steps: ActionStep[];
  completion: string;
  followUp: string;
};

export type ActionKey =
  | 'Écriture guidée'
  | 'Respiration'
  | 'Marche légère'
  | 'Playlist apaisante'
  | 'Appeler un proche'
  | 'Ancrage'
  | 'Prendre RDV'
  | 'Urgence';

const plans: Record<ActionKey, ActionPlan> = {
  'Respiration': {
    preface: "On va pratiquer une respiration en douceur, ensemble.",
    steps: [
      { text: "Installez-vous confortablement, épaules relâchées.", duration: 1500 },
      { text: "Inspiration 5 secondes…", duration: 5000 },
      { text: "Expiration 5 secondes…", duration: 5000 },
      { text: "Encore 3 cycles: inspire 5s, expire 5s.", duration: 15000 },
    ],
    completion: "Bien. Laissez votre souffle revenir naturellement.",
    followUp: "Comment vous sentez-vous après cette respiration ?",
  },
  'Marche légère': {
    preface: "Je vous propose une marche légère, ici et maintenant.",
    steps: [
      { text: "Levez-vous si possible, portez attention à vos appuis.", duration: 2000 },
      { text: "Marchez doucement pendant 2 minutes, rythme tranquille.", duration: 120000 },
      { text: "Notez votre respiration et ce que vous percevez autour de vous.", duration: 4000 },
    ],
    completion: "Vous pouvez vous arrêter et revenir à votre place.",
    followUp: "Comment est votre état après cette marche ?",
  },
  'Ancrage': {
    preface: "Allons vers un exercice d’ancrage 5-4-3-2-1.",
    steps: [
      { text: "5 choses que vous voyez.", duration: 6000 },
      { text: "4 choses que vous pouvez toucher.", duration: 6000 },
      { text: "3 sons que vous entendez.", duration: 6000 },
      { text: "2 odeurs que vous percevez.", duration: 6000 },
      { text: "1 goût ou sensation interne.", duration: 6000 },
    ],
    completion: "Restez encore un instant, respirez calmement.",
    followUp: "Qu’est-ce qui a changé dans votre ressenti ?",
  },
  'Écriture guidée': {
    preface: "Prenons un moment d’écriture simple.",
    steps: [
      { text: "Pendant 5 minutes, répondez: «Qu’est-ce qui me pèse le plus aujourd’hui ?»", duration: 300000 },
      { text: "Ensuite: «Quelle petite action accessible pourrais-je tenter ?»", duration: 120000 },
    ],
    completion: "Relisez brièvement sans jugement.",
    followUp: "Que retenez-vous de votre écriture ?",
  },
  'Playlist apaisante': {
    preface: "Musique apaisante: choisissez un titre calme ou une playlist douce.",
    steps: [
      { text: "Écoutez 3 minutes, respirez doucement, fermez les yeux si vous voulez.", duration: 180000 },
    ],
    completion: "Coupez le son progressivement.",
    followUp: "Comment était ce moment musical pour vous ?",
  },
  'Appeler un proche': {
    preface: "Se relier peut aider. Choisissez une personne ressource.",
    steps: [
      { text: "Envoyez un message ou appelez 2-3 minutes pour donner des nouvelles.", duration: 180000 },
    ],
    completion: "Revenez à vous, notez ce que cela a changé.",
    followUp: "Comment vous sentez-vous après ce contact ?",
  },
  'Prendre RDV': {
    preface: "Planifions un prochain rendez-vous si vous le souhaitez.",
    steps: [
      { text: "Ouvrez votre agenda ou un lien de prise de RDV.", duration: 4000 },
      { text: "Choisissez un créneau. Prenez 2 minutes.", duration: 120000 },
    ],
    completion: "Validez le créneau et notez-le.",
    followUp: "Souhaitez-vous recevoir un rappel ?",
  },
  'Urgence': {
    preface: "Si vous vivez une situation de gravité élevée, priorisons votre sécurité.",
    steps: [
      { text: "Appelez un service d’urgence ou un contact ressource immédiatement.", duration: 60000 },
    ],
    completion: "Restez en ligne ici si besoin, vous n’êtes pas seul·e.",
    followUp: "Souhaitez-vous que je propose d’autres options de soutien ?",
  },
};

export function getActionPlan(key: ActionKey): ActionPlan {
  return plans[key];
}
