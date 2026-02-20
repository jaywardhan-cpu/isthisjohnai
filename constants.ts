
import { Lead, Industry, Difficulty, VoiceSettings } from './types';

export const INDUSTRIES: Industry[] = [
  "Solar Energy (B2C)",
  "SaaS - Cybersecurity (B2B)",
  "Insurance - Medicare/Life (B2C)",
  "Marketing Agency (B2B)",
  "Medical Logistics (B2B)",
  "Commercial HVAC (B2B)"
];

export const SERVICE_BRIEFINGS: Record<Industry, string> = {
  "Solar Energy (B2C)": "You are pitching a 'Free Home Energy Audit'. Your goal is to identify efficiency leaks in their home and book a follow-up consultation with a specialist to show them how to zero out their utility bill.",
  "SaaS - Cybersecurity (B2B)": "You are pitching a 'Vulnerability Discovery Call'. Your goal is to highlight the risks of recent phishing trends and book a 15-minute diagnostic session with your Lead Engineer.",
  "Insurance - Medicare/Life (B2C)": "You are pitching a 'Policy Comparison Review'. Your goal is to help seniors find gaps in their current coverage and book a review with a licensed broker to ensure they aren't overpaying.",
  "Marketing Agency (B2B)": "You are pitching a 'Complimentary Lead-Gen Audit'. Your goal is to show local business owners where they are losing traffic to competitors and book a strategy session to fix their conversion funnels.",
  "Medical Logistics (B2B)": "You are pitching 'On-Demand Lab Courier Services'. Your goal is to demonstrate how your platform improves specimen turnaround times and book a site visit to optimize their logistics route.",
  "Commercial HVAC (B2B)": "You are pitching 'Preventative Maintenance Contracts'. Your goal is to explain how regular servicing prevents $10k+ emergency repairs and book an inspection for their facility's rooftop units."
};

const INDUSTRY_PAIN_POINTS: Record<Industry, Record<Difficulty, string[]>> = {
  "Solar Energy (B2C)": {
    "Easy": [
      "Utility rates just hiked by 15% and they are looking for options.",
      "Neighbor recently installed solar and they are curious about the $0 bill.",
      "Home feels drafty and AC runs constantly, they want to save money."
    ],
    "Medium": [
      "Worried about grid reliability after a recent outage but hates door knockers.",
      "Interested in going green but suspicious of high upfront costs and loans.",
      "Inherited an older home with inefficient appliances and high bills."
    ],
    "Hard": [
      "A previous solar company promised savings but left them with a broken system.",
      "Thinks solar is a 'government scam' and doesn't trust anyone in the industry.",
      "In a legal battle with their utility company over net metering rights."
    ]
  },
  "SaaS - Cybersecurity (B2B)": {
    "Easy": [
      "A minor phishing scare last week made them realize they need better training.",
      "Currently using a legacy firewall and knows they are out of date.",
      "Executive leadership is asking for a basic security review for insurance."
    ],
    "Medium": [
      "Worried about customer data in the cloud but thinks their current IT is 'fine'.",
      "Onboarding remote employees and struggling with basic access protocols.",
      "A competitor just got hit with a virus and they are feeling a bit nervous."
    ],
    "Hard": [
      "They are currently under a ransomware attack and are extremely hostile and panicked.",
      "An internal audit just flagged 'catastrophic' vulnerabilities they can't fix.",
      "Burned by a previous vendor who failed to prevent a massive data breach."
    ]
  },
  "Insurance - Medicare/Life (B2C)": {
    "Easy": [
      "Approaching 65 and feeling overwhelmed by the mail, looking for guidance.",
      "Currently paying for a plan that doesn't cover their specific heart medication.",
      "Just wants to make sure they aren't overpaying compared to their friends."
    ],
    "Medium": [
      "Recently had a claim denied for a technicality and feels slightly cheated.",
      "Policy doesn't include dental or vision, which are becoming high priorities.",
      "Suspicious that their agent of 10 years is no longer looking out for them."
    ],
    "Hard": [
      "Their spouse just passed away and they are being harassed by aggressive agents.",
      "Thinks all insurance is a 'scam' after losing a massive payout on a technicality.",
      "Living on a fixed income so tight that even a $10 increase feels like a threat."
    ]
  },
  "Marketing Agency (B2B)": {
    "Easy": [
      "Website traffic is steady but phone isn't ringing, they know they need a change.",
      "Has a huge email list but hasn't sent a single campaign in over a year.",
      "Looking for a way to stop relying purely on word-of-mouth referrals."
    ],
    "Medium": [
      "Main competitor just started running aggressive, targeted social media ads.",
      "Spent $5,000 on a new website that looks pretty but generates zero leads.",
      "Local SEO rankings dropped from page 1 to page 4 and they are annoyed."
    ],
    "Hard": [
      "Their previous agency 'ghosted' them after stealing $10,000 in ad spend.",
      "Currently bleeding money on Google Ads with zero ROI and hates marketers.",
      "Business is failing due to lack of leads and they are extremely defensive."
    ]
  },
  "Medical Logistics (B2B)": {
    "Easy": [
      "Current courier is often 30 mins late and they want something more reliable.",
      "Patient satisfaction scores are slightly dropping due to turnaround times.",
      "Looking for a way to digitize their specimen tracking instead of logbooks."
    ],
    "Medium": [
      "Costs for 'Stat' pickups increased by 40% and it's eating their budget.",
      "Specimens were exposed to heat last month and they need a climate solution.",
      "Current provider lacks GPS tracking and it's causing anxiety in the lab."
    ],
    "Hard": [
      "Lost two critical specimens last month due to negligence, causing a lawsuit.",
      "Current courier service failed a site inspection and they are in crisis mode.",
      "Lab manager hates 'tech startups' and only trusts their local courier friend."
    ]
  },
  "Commercial HVAC (B2B)": {
    "Easy": [
      "Energy bills are slightly higher than usual and they want an inspection.",
      "Current service tech only shows up when something breaks; wants a plan.",
      "The building manager is tired of managing 5 different vendors for 5 units."
    ],
    "Medium": [
      "Tenants in the North wing are complaining about humidity and low airflow.",
      "Rooftop units are 15 years old and they want to avoid a massive replacement.",
      "Units are leaking refrigerant and they are worried about compliance fines."
    ],
    "Hard": [
      "Rooftop unit failed on the hottest day, costing $15k in lost inventory.",
      "Last repair was 'band-aided' by a cheap tech and it just failed again.",
      "The owner thinks maintenance is a 'racket' and refuses to pay for 'nothing'."
    ]
  }
};

const generateLeads = (): Lead[] => {
  const industries: Industry[] = INDUSTRIES;
  const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];
  const database: Lead[] = [];
  
  const personas = [
    { type: "The High-Status Alpha", trait: "Dominant, wants to feel in control. If you sound submissive, they lose respect. If you challenge them too early, they hang up." },
    { type: "The 'I'm Fine' Avoider", trait: "Uses 'everything is great' as a defensive wall. High reactance to being told they have a problem." },
    { type: "The Analytical Perfectionist", trait: "Needs data, hates 'fluff'. Will catch you in a lie or exaggeration instantly." },
    { type: "The Burned Visionary", trait: "Had a big dream, got screwed by a vendor, now hyper-vigilant and cynical." },
    { type: "The Overwhelmed Firefighter", trait: "Literally has no time. If you don't earn 30 seconds in the first 3, you're dead." },
    { type: "The Passive-Aggressive Agree-er", trait: "Says 'yes' and 'that makes sense' just to get you off the phone. Hardest to pin down." },
    { type: "The Status-Seeking Socialite", trait: "Wants to know who else is using it. Cares about prestige and 'being in the know'." },
    { type: "The Risk-Averse Bureaucrat", trait: "Terrified of making a mistake. Needs social proof and 'safety' more than 'results'." },
    { type: "The Direct Blunt", trait: "No small talk. 'What do you want?' If you stutter, they hang up." },
    { type: "The Friendly Talker", trait: "Wastes time on rapport. Uses friendliness to avoid answering hard questions." }
  ];

  const firstNames = [
    "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "William", "Elizabeth", 
    "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
    "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
    "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Alice", "Andrew", "Donna", "Joshua", "Emily",
    "Kevin", "Michelle", "Brian", "Laura", "George", "Sarah", "Edward", "Kim", "Ronald", "Deborah"
  ];
  
  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", 
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Hall", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
    "Adams", "Campbell", "Stewart", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy"
  ];

  // Generate 180 leads (30 leads per industry, 10 per difficulty)
  for (let industryIndex = 0; industryIndex < industries.length; industryIndex++) {
    const industry = industries[industryIndex];
    
    for (let diffIndex = 0; diffIndex < difficulties.length; diffIndex++) {
      const difficulty = difficulties[diffIndex];
      const difficultyPainPoints = INDUSTRY_PAIN_POINTS[industry][difficulty];
      
      for (let count = 0; count < 10; count++) {
        const globalIndex = (industryIndex * 30) + (diffIndex * 10) + count;
        
        // Select persona based on overall index
        const persona = personas[globalIndex % personas.length];
        
        // Select names and pain points using difficulty-specific lists where appropriate
        const first = firstNames[(globalIndex + (diffIndex * 13)) % firstNames.length];
        const last = lastNames[(globalIndex + (count * 17)) % lastNames.length];
        
        // Ensure that leads of the same difficulty within an industry have similar but slightly varied pain points
        const painPoint = difficultyPainPoints[count % difficultyPainPoints.length];
        
        database.push({
          id: `lead-${globalIndex}`,
          name: `${first} ${last}`,
          industry,
          difficulty,
          persona: persona.type + ". " + persona.trait,
          context: `${painPoint} They are characterized as ${persona.trait.toLowerCase()}`,
        });
      }
    }
  }
  
  return database;
};

export const LEAD_DATABASE: Lead[] = generateLeads();

export const GOLDEN_RULES = `
1. TONE: Avoid sales enthusiasm. Use a neutral, curious, or concerned tone. Lower the pitch.
2. OPENER (PATTERN INTERRUPT): Use a questioning inflection with the prospect's name (e.g., "John?").
3. DISARMING: Acknowledge you aren't sure if you can help yet. "I'm not sure if we can even help you yet, but..."
4. CONNECTING (GAP BUILDING): Ask "Problem Awareness" questions. "What's been the biggest challenge with [X] lately?"
5. CONSEQUENCE: Explore the "Pain of Staying the Same". "If you don't fix [X], what does that look like for the business in 6 months?"
6. SOLUTION AWARENESS: Let them tell YOU why they need it. "Why is this a priority for you now, rather than later?"
7. THE CLOSE: Ask for a specific date and time for a follow-up. Assume the next step.
`;

export const getVoiceForLead = (name: string): string => {
  const femaleNames = [
    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
    'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Alice', 'Donna', 'Emily',
    'Michelle', 'Laura', 'Deborah'
  ];
  const isFemale = femaleNames.some(fn => name.includes(fn));
  if (isFemale) {
    return (name.charCodeAt(0) % 2 === 0) ? 'Kore' : 'Zephyr';
  } else {
    const code = name.charCodeAt(0);
    if (code % 3 === 0) return 'Fenrir';
    if (code % 3 === 1) return 'Puck';
    return 'Charon';
  }
};

export const getRandomVoiceSettings = (): VoiceSettings => {
  const pitches: VoiceSettings["pitch"][] = ["Deep", "Balanced", "High"];
  const speeds: VoiceSettings["speed"][] = ["Slow", "Normal", "Fast"];
  const accents: VoiceSettings["accent"][] = ["Neutral", "Southern US", "New York", "Midwestern"];
  
  return {
    pitch: pitches[Math.floor(Math.random() * pitches.length)],
    speed: speeds[Math.floor(Math.random() * speeds.length)],
    accent: accents[Math.floor(Math.random() * accents.length)]
  };
};
