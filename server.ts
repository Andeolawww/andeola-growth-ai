import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK safely
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Helper for realistic fallback analysis
function getFallbackWebsiteAnalysis(url: string) {
  const cleanUrl = url.replace(/https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
  
  if (cleanUrl.includes('fashion') || cleanUrl.includes('apparel') || cleanUrl.includes('cloth') || cleanUrl.includes('threads')) {
    return {
      businessName: cleanUrl.split('.')[0].toUpperCase() + ' Apparel',
      url: url,
      industry: 'Fashion & DTC Apparel',
      businessModel: 'Direct-to-Consumer Ecommerce (Shopify)',
      productsServices: [
        'Sustainable streetwear collection',
        'Seasonal outerwear',
        'Organic cotton basics',
        'Direct-to-consumer global shipping',
      ],
      targetMarket: 'European & North American Gen Z & Millennial consumers (ages 18–35)',
      valueProposition: 'Modern, ethically sourced everyday apparel with minimalist aesthetics and transparent supply chains.',
      whatItSells: 'Premium minimalist apparel, streetwear garments, and sustainable everyday essentials designed for modern urban lifestyles.',
      whoBuysIt: 'Design-conscious urban consumers, eco-aware young professionals, and lifestyle fashion shoppers seeking quality over fast fashion.',
      customerPainPoints: [
        'Fast fashion items degrade rapidly after a few wash cycles',
        'Difficulty finding verified sustainable materials that still look modern',
        'High markup pricing without proportional material quality in luxury brands',
      ],
      marketOpportunities: [
        'Expansion into European boutique concept stores and multibrand retailers',
        'Wholesale partnerships with sustainable department stores in Germany and France',
        'B2B corporate gifting collections for modern tech startups',
      ],
      recommendedProspectTypes: [
        'Independent fashion boutique owners',
        'Sustainable department store category buyers',
        'Ecommerce wholesale distributors in DACH & UK',
        'Modern lifestyle retail buyers',
      ],
    };
  }

  if (cleanUrl.includes('saas') || cleanUrl.includes('metrics') || cleanUrl.includes('analytics') || cleanUrl.includes('tech') || cleanUrl.includes('app') || cleanUrl.includes('cloud')) {
    return {
      businessName: cleanUrl.split('.')[0].toUpperCase() + ' Tech',
      url: url,
      industry: 'B2B SaaS / Enterprise Analytics',
      businessModel: 'Subscription SaaS (Tiered Pricing & Enterprise Contracts)',
      productsServices: [
        'Automated revenue tracking dashboard',
        'Customer retention analytics',
        'Cohort churn analysis engine',
        'One-click Stripe & HubSpot integrations',
      ],
      targetMarket: 'Mid-market SaaS founders, Chief Revenue Officers, and Growth Marketing Leads ($1M–$25M ARR)',
      valueProposition: 'Turn raw subscription data into predictive growth insights with real-time churn early warning triggers.',
      whatItSells: 'An intelligence platform that aggregates recurring subscription data to predict customer churn before it happens.',
      whoBuysIt: 'SaaS CEOs, VP of Growth, Customer Success directors, and RevOps managers managing high-volume recurring accounts.',
      customerPainPoints: [
        'Hidden churn blind spots in monthly billing cohorts',
        'Manual reconciliation of fragmented customer databases and CRM tables',
        'Inability to identify at-risk enterprise accounts in time for renewal interventions',
      ],
      marketOpportunities: [
        'Targeting venture-backed Series A/B SaaS companies scaling over 50 employees',
        'Integration partnerships with popular fintech billing platforms',
        'Outreach to RevOps consultants who advise dozens of scaling SaaS clients',
      ],
      recommendedProspectTypes: [
        'VPs of Customer Success at SaaS companies with 20-200 employees',
        'Chief Revenue Officers at subscription businesses',
        'Head of RevOps / Operations Directors',
        'Founders and Managing Partners at SaaS acceleration studios',
      ],
    };
  }

  // General fallback
  const domainCapitalized = cleanUrl.split('.')[0].replace(/[^a-zA-Z0-9]/g, ' ');
  const formattedName = domainCapitalized.charAt(0).toUpperCase() + domainCapitalized.slice(1);

  return {
    businessName: formattedName || 'Andeola Growth Partner',
    url: url,
    industry: 'Digital Services & Technology Solutions',
    businessModel: 'B2B Value Provider (Retainer & Solutions)',
    productsServices: [
      'Tailored business workflow optimization',
      'Automated digital pipeline architecture',
      'Strategic market expansion advisory',
      'Performance analytics and operational monitoring',
    ],
    targetMarket: 'Growing SMEs, fast-moving agency founders, and forward-thinking operational directors',
    valueProposition: 'Empowers modern businesses to streamline customer acquisition and elevate operational velocity using intelligent systems.',
    whatItSells: 'Comprehensive business solutions and specialized workflow infrastructure that drive measurable client revenue.',
    whoBuysIt: 'Founders, C-level executives, and department leads aiming to cut operational inefficiencies and scale their customer base.',
    customerPainPoints: [
      'Disjointed tool stacks that leak high-value prospects and internal hours',
      'High client acquisition costs through traditional saturated ad channels',
      'Lack of personalized, data-backed outreach methods to reach decision makers',
    ],
    marketOpportunities: [
      'Direct outreach to high-margin service businesses expanding regionally',
      'Strategic co-marketing with complementary B2B platforms',
      'Automated outbound prospecting to newly funded scale-ups',
    ],
    recommendedProspectTypes: [
      'Founders and Managing Directors at growing agencies',
      'Heads of Growth and Business Development',
      'Chief Operating Officers at 10-100 employee firms',
      'Category buyers and commercial decision makers',
    ],
  };
}

// 1. Website Analyzer Endpoint
app.post('/api/analyze-website', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Valid URL is required' });
  }

  // If Gemini is available, attempt real AI analysis
  if (genAI) {
    try {
      const prompt = `You are an elite B2B sales strategist and business intelligence analyst.
Analyze the following company website or domain: "${url}".
Infer the business type, industry, products/services, target market, customer pain points, value proposition, and prospective B2B outreach profile.
Return a STRICT JSON object with the following fields:
{
  "businessName": string,
  "industry": string,
  "businessModel": string,
  "productsServices": string[],
  "targetMarket": string,
  "valueProposition": string,
  "whatItSells": string,
  "whoBuysIt": string,
  "customerPainPoints": string[],
  "marketOpportunities": string[],
  "recommendedProspectTypes": string[]
}`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({
          ...parsed,
          url,
          source: 'gemini-3.8-flash',
        });
      }
    } catch (geminiError) {
      console.warn('Gemini API call failed, falling back to heuristic engine:', geminiError);
    }
  }

  // Fallback heuristic analysis
  const fallback = getFallbackWebsiteAnalysis(url);
  res.json({
    ...fallback,
    source: 'andeola-heuristic-engine',
  });
});

// 2. Generate ICP Endpoint
app.post('/api/generate-icp', async (req: Request, res: Response) => {
  const { businessOverview } = req.body;

  if (genAI && businessOverview) {
    try {
      const prompt = `Based on this business overview:
${JSON.stringify(businessOverview, null, 2)}

Generate an Ideal Customer Profile (ICP) for outbound B2B sales prospecting.
Return a STRICT JSON object with these keys:
{
  "title": string,
  "summary": string,
  "industries": string[],
  "companySizes": string[],
  "targetCountries": string[],
  "buyerRoles": string[],
  "budget": string,
  "painPoints": string[],
  "buyingSignals": string[],
  "interests": string[],
  "recommendedMarkets": string[]
}`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json(parsed);
      }
    } catch (err) {
      console.warn('Gemini ICP generation failed, using fallback:', err);
    }
  }

  // Fallback ICP based on industry
  const ind = (businessOverview?.industry || 'Ecommerce').toLowerCase();
  const isEcommerce = ind.includes('ecommerce') || ind.includes('fashion') || ind.includes('apparel');
  const isSaas = ind.includes('saas') || ind.includes('tech') || ind.includes('software');

  if (isEcommerce) {
    return res.json({
      title: 'High-Growth DTC & Premium Retail Brands',
      summary: 'DTC and multi-brand retailers looking for wholesale partnerships, premium suppliers, and European distribution channels with modern digital presence.',
      industries: ['Fashion Ecommerce', 'Sustainable Retail', 'Multi-Brand Boutiques', 'Consumer Goods'],
      companySizes: ['11–50 employees', '51–200 employees'],
      targetCountries: ['United Kingdom', 'Germany', 'France', 'Netherlands', 'United States'],
      buyerRoles: ['Founder / Co-Founder', 'Head of Buying & Merchandising', 'VP of Retail Partnerships', 'Chief Commercial Officer'],
      budget: '$25,000 – $150,000 / year',
      painPoints: [
        'Finding ethical manufacturers with consistent QC and prompt delivery',
        'Stagnating organic customer acquisition requiring new partner channels',
        'Need to differentiate catalog from commoditized fast-fashion marketplaces',
      ],
      buyingSignals: [
        'Recently launched Shopify Plus or international localized storefront',
        'Announced new sustainability pledge or circularity initiative',
        'Hiring Head of E-commerce or International Wholesale Manager',
      ],
      interests: ['Sustainable Sourcing', 'Omnichannel Retailing', 'Direct-to-Consumer Growth', 'Boutique Curation'],
      recommendedMarkets: ['Western Europe (UK, DACH, Nordics)', 'North America (East & West Coast urban hubs)'],
    });
  }

  if (isSaas) {
    return res.json({
      title: 'Scaling B2B Subscription Companies ($2M–$20M ARR)',
      summary: 'Post-Product Market Fit SaaS companies with established sales and marketing teams seeking to optimize cohort retention and pipeline efficiency.',
      industries: ['B2B Software', 'Fintech', 'HR Tech & Workplace', 'Marketing & Sales Tech'],
      companySizes: ['20–100 employees', '101–500 employees'],
      targetCountries: ['United States', 'United Kingdom', 'Canada', 'Germany', 'Australia'],
      buyerRoles: ['Chief Revenue Officer (CRO)', 'VP of Customer Success', 'Head of Revenue Operations', 'Founder / CEO'],
      budget: '$15,000 – $80,000 / year',
      painPoints: [
        'Hidden churn in mid-tier enterprise accounts eroding net retention',
        'Disparate data silos across CRM, payment processor, and product telemetry',
        'Sales and Customer Success alignment delays during renewal negotiations',
      ],
      buyingSignals: [
        'Recent Series A or Series B funding announcement',
        'Actively expanding Customer Success or RevOps headcount on LinkedIn',
        'Migrating or consolidating subscription management tooling',
      ],
      interests: ['Net Revenue Retention (NRR)', 'Churn Mitigation', 'RevOps Automation', 'Predictive Pipeline'],
      recommendedMarkets: ['Silicon Valley & Austin', 'London & Berlin Tech Corridors', 'Toronto Tech Ecosystem'],
    });
  }

  return res.json({
    title: 'Mid-Market Service & Technology Organizations',
    summary: 'Growth-oriented businesses actively modernizing their outbound acquisition channels and streamlining internal client delivery.',
    industries: ['Digital Consulting', 'Creative & Growth Agencies', 'Professional Services', 'Commercial Technology'],
    companySizes: ['10–50 employees', '50–250 employees'],
    targetCountries: ['United States', 'United Kingdom', 'Germany', 'Australia'],
    buyerRoles: ['Managing Director', 'Partner / Owner', 'Head of Business Development', 'Chief Operating Officer'],
    budget: '$12,000 – $60,000 / year',
    painPoints: [
      'Inconsistent lead pipeline relying too heavily on referrals and word-of-mouth',
      'Long sales cycles without automated follow-up workflows',
      'Difficulty articulating differentiated technical value to busy executives',
    ],
    buyingSignals: [
      'Expanding leadership team or adding dedicated sales roles',
      'Recent rebrand or new service line launch on company website',
      'Active content publication showcasing business expansion',
    ],
    interests: ['Pipeline Predictability', 'Client Retention', 'Operational Scalability', 'B2B Sales Innovation'],
    recommendedMarkets: ['Tier-1 Metropolitan business hubs across North America & Europe'],
  });
});

// 3. Generate Personalized Outreach Endpoint
app.post('/api/generate-outreach', async (req: Request, res: Response) => {
  const { lead, channel = 'email', tone = 'professional', senderCompany = 'Andeola Growth AI', valueProposition } = req.body;

  if (genAI && lead) {
    try {
      const prompt = `You are a world-class personalized B2B sales outreach copywriter.
Write an authentic, highly tailored ${channel} outreach message for the following prospect.
Prospect Details:
- Name: ${lead.contact}
- Role: ${lead.role}
- Company: ${lead.company}
- Industry: ${lead.industry}
- Country: ${lead.country}
- Company Overview: ${lead.description || 'Rapidly growing business'}
- Match Score: ${lead.matchScore}%
- Key Pain Points: ${JSON.stringify(lead.potentialPainPoints || [])}
- Why This Lead Matches: ${lead.whyMatches || 'High alignment with your target ICP'}

Outreach Tone: ${tone} (e.g. professional, friendly, direct, consultative)
Sender Company: ${senderCompany}
Value Proposition: ${valueProposition || 'Helping businesses scale high-intent customer acquisition using intelligent AI prospecting.'}

Guidelines:
- NEVER make up fake verifiable facts or claim you saw private internal reports.
- Reference their public role, company positioning, or industry movement naturally.
- Keep it punchy, respectful, and conversion-focused.

Return a STRICT JSON object:
{
  "subject": string (relevant subject line, especially if email),
  "opening": string (warm opening mentioning their company/role),
  "observation": string (thoughtful personalized observation about their market or positioning),
  "valueProp": string (concise value proposition tailored to their specific pain points),
  "callToAction": string (clear, low-friction call to action asking for 10-15 min conversation),
  "fullText": string (the complete, cohesive message ready to send)
}`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json(parsed);
      }
    } catch (err) {
      console.warn('Gemini outreach generation failed, falling back:', err);
    }
  }

  // Fallback intelligent message generator
  const contactName = lead?.contact?.split(' ')[0] || 'there';
  const company = lead?.company || 'your team';
  const role = lead?.role || 'Leader';

  let subject = '';
  let opening = '';
  let observation = '';
  let valueProp = '';
  let cta = '';

  if (channel === 'linkedin') {
    subject = `Quick note regarding ${company}'s growth initiatives`;
    opening = `Hi ${contactName}, noticed your impactful work driving ${company}'s market expansion as ${role}.`;
    observation = `Given the rapid pace in ${lead?.industry || 'your sector'}, ensuring high-intent lead flow while keeping outreach genuine is often a delicate balance.`;
    valueProp = `We've engineered a workflow that uncovers pre-qualified prospects and crafts personalized outreach in seconds.`;
    cta = `Would you be open to a quick 10-minute exchange next Tuesday to see if this fits ${company}'s roadmap?`;
  } else if (channel === 'dm') {
    subject = `${company} + modern prospecting`;
    opening = `Hey ${contactName} — congratulations on recent momentum at ${company}!`;
    observation = `Saw your focus in ${lead?.country || 'the region'} and wanted to share a quick perspective on modern B2B discovery.`;
    valueProp = `We help teams identify exact-match business leads and automate tailored messaging without losing the human touch.`;
    cta = `Worth a brief 5-minute chat this week?`;
  } else {
    // Default email
    subject = `${contactName} — quick question regarding ${company}'s pipeline strategy`;
    opening = `Hi ${contactName},`;
    observation = `I've been following ${company}'s footprint in ${lead?.industry || 'the industry'} and noticed how thoughtfully your team has positioned your offerings across ${lead?.country || 'international markets'}.`;
    valueProp = `At ${senderCompany}, we help founders and growth leaders turn their business positioning into a continuous stream of verified, high-scoring leads with bespoke outreach.`;
    cta = `Are you free for a 12-minute virtual coffee next Wednesday morning?`;
  }

  const fullText = channel === 'email'
    ? `${subject}\n\n${opening}\n\n${observation}\n\n${valueProp}\n\n${cta}\n\nBest regards,\nAndeola Team`
    : `${opening}\n\n${observation}\n\n${valueProp}\n\n${cta}`;

  res.json({
    subject,
    opening,
    observation,
    valueProp,
    callToAction: cta,
    fullText,
    source: 'andeola-smart-copy-engine',
  });
});

// 4. AI Assistant Endpoint ("Andeola AI")
app.post('/api/ai-assistant', async (req: Request, res: Response) => {
  const { message, context } = req.body;

  if (genAI && message) {
    try {
      const systemInstruction = `You are "Andeola AI", an elite sales prospecting, ICP generation, and outbound strategy assistant inside the "Andeola Growth AI" SaaS platform.
You are sharp, helpful, professional, and concise.
You understand the user's current context:
${context ? JSON.stringify(context, null, 2) : 'No specific business selected yet'}

Help users with:
1. Refining their target customer criteria (ICP)
2. Brainstorming high-converting cold email and LinkedIn angles
3. Suggesting relevant market niches and prospect titles
4. Explaining campaign analytics and how to improve reply rates
Keep responses structured, inspiring, and actionable (under 250 words unless asked for a complete template).`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.4,
        },
      });

      if (response.text) {
        return res.json({ reply: response.text });
      }
    } catch (err) {
      console.warn('Gemini AI Assistant error:', err);
    }
  }

  // Fallback assistant logic
  const lowerMsg = (message || '').toLowerCase();
  let reply = '';

  if (lowerMsg.includes('website') || lowerMsg.includes('analyze')) {
    reply = `To analyze your business, head over to the **Website Analyzer** tab in the sidebar and enter your website URL (e.g., https://yourwebsite.com). Our AI will break down your core offerings, ideal market, pain points, and generate instant prospect recommendations.`;
  } else if (lowerMsg.includes('icp') || lowerMsg.includes('customer profile') || lowerMsg.includes('ideal')) {
    reply = `Your **Ideal Customer Profile (ICP)** is the cornerstone of high-converting outbound. Focus on 3 key anchors:
1. **Trigger Signals:** Look for companies hiring your buyer persona or adopting new tech.
2. **Economic Buyer:** Target Decision Makers (Founders, VP of Sales, CROs, Heads of Buying).
3. **Pervasive Pain Point:** Address the bottleneck costing them either lost revenue or manual operational hours.
Click **Ideal Customer Profile** in the navigation to review and edit your current profile!`;
  } else if (lowerMsg.includes('ecommerce') || lowerMsg.includes('europe') || lowerMsg.includes('prospects')) {
    reply = `For European ecommerce prospects:
- **Top Locations:** United Kingdom, Germany (DACH), France, and Netherlands.
- **Key Decision Makers:** Head of Buying, Founder, VP of Retail Partnerships, Wholesale Director.
- **Outreach Angle:** Focus on sustainable margins, faster fulfillment turnaround, or exclusive regional product differentiation.
You can filter for these exact criteria in the **Find Leads** tab right now!`;
  } else if (lowerMsg.includes('campaign') || lowerMsg.includes('performance') || lowerMsg.includes('reply rate')) {
    reply = `To boost campaign reply rates beyond 18%:
1. **Hyper-Personalized Observation:** Reference a tangible aspect of their brand rather than a generic compliment.
2. **Low-Friction Ask:** Instead of asking for a 30-min demo, propose a quick 10-minute insight exchange.
3. **Multi-Channel Sequence:** Follow up an email with a soft LinkedIn connection or profile visit 3 days later.`;
  } else {
    reply = `I'm **Andeola AI**, your dedicated outbound strategist. I can help you evaluate your website positioning, generate laser-targeted ICPs, brainstorm multi-touch outreach copy, or optimize campaign conversion rates. What are you looking to achieve today?`;
  }

  res.json({ reply });
});

// Setup Vite middlewares in development, or serve static assets in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Andeola Growth AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
