import { groq } from 'next-sanity';
import { client } from './sanity';

export async function getNews(limit?: number) {
  const query = groq`*[_type == "news"] | order(publishedAt desc)${limit ? `[0...${limit}]` : ''} {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    featuredImage,
    isFeatured
  }`;
  return await client.fetch(query);
}

export async function getFeaturedNews() {
  const query = groq`*[_type == "news" && isFeatured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    featuredImage
  }`;
  return await client.fetch(query);
}

export async function getDocuments(category?: string) {
  const categoryFilter = category ? `&& category == "${category}"` : '';
  const query = groq`*[_type == "competitionDocument" ${categoryFilter}] | order(publishedAt desc) {
    _id,
    title,
    description,
    category,
    file {
      asset-> {
        url,
        originalFilename,
        size,
        mimeType
      }
    },
    publishedAt,
    isFeatured
  }`;
  return await client.fetch(query);
}

export async function getSponsors(tier?: string) {
  const tierFilter = tier ? `&& tier == "${tier}"` : '';
  const query = groq`*[_type == "sponsor" ${tierFilter}] | order(tier asc, order asc) {
    _id,
    name,
    logo,
    website,
    tier,
    order
  }`;
  return await client.fetch(query);
}

export async function getPageContent(page: string) {
  const query = groq`*[_type == "pageContent" && page == "${page}"][0] {
    _id,
    title,
    content
  }`;
  return await client.fetch(query);
}

export async function getHomePageContent() {
  const query = groq`*[_type == "homePage"][0] {
    _id,
    heroTitle,
    heroSubtitle,
    competitionTitle,
    competitionDescription,
    quickLinksTitle
  }`;
  return await client.fetch(query);
}

export async function getSiteSettings() {
  const query = groq`*[_type == "siteSettings"][0] {
    title,
    tagline,
    contact,
    social,
    footer
  }`;
  return await client.fetch(query);
}

export async function getPosts(limit?: number) {
  const query = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc)${limit ? `[0...${limit}]` : '[0...12]'} {
    _id,
    title,
    slug,
    publishedAt,
    image
  }`;
  return await client.fetch(query);
}

export async function getPostBySlug(slug: string) {
  const query = groq`*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    image,
    body
  }`;
  return await client.fetch(query, { slug });
}

// Event queries
export async function getEvents(status?: string) {
  const statusFilter = status ? `&& status == "${status}"` : '';
  const query = groq`*[_type == "event" ${statusFilter}] | order(year desc) {
    _id,
    year,
    title,
    startDate,
    endDate,
    location,
    venue,
    description,
    status,
    featuredImage,
    registrationOpen,
    registrationDeadline
  }`;
  return await client.fetch(query);
}

export async function getEventByYear(year: number) {
  const query = groq`*[_type == "event" && year == $year][0] {
    _id,
    year,
    title,
    startDate,
    endDate,
    location,
    venue,
    description,
    status,
    featuredImage,
    registrationOpen,
    registrationDeadline
  }`;
  return await client.fetch(query, { year });
}


// Results queries
export async function getResults(eventId?: string, category?: string, subcategory?: string) {
  const filters = [];
  if (eventId) filters.push(`event._ref == "${eventId}"`);
  if (category) filters.push(`category == "${category}"`);
  if (subcategory) filters.push(`subcategory == "${subcategory}"`);
  
  const filterString = filters.length > 0 ? `&& ${filters.join(' && ')}` : '';
  // First, get results with team reference IDs
  const resultsQuery = groq`*[_type == "result" ${filterString}] | order(position asc) {
    _id,
    category,
    subcategory,
    position,
    points,
    penalties,
    vehicleNumber,
    year,
    awards,
    event->{
      _id,
      year,
      title
    },
    "teamRef": team._ref
  }`;
  
  const results = await client.fetch(resultsQuery);
  
  // Mapping from old draft team IDs to new published team IDs
  // This maps the old draft team references to the new published teams
  const teamIdMapping: Record<string, string> = {
    'drafts.0170fab9-a7d7-482c-b8aa-2a9295c4188c': 'f1003853-9c04-4706-884b-8aa3699bfa86', // Poseidon Racing Team
    'drafts.2483ed0d-6480-47bd-af54-c937027fe4f6': '55ca4a47-0805-4c4c-bc33-fefa4b457c29', // Aristotle Racing Team
    'drafts.4363f77b-3ff7-43ac-9d9c-0da2d683adf2': '4aa63bde-efd3-4df9-9972-e96ec4eb51c5', // Perseus Racing Team
    'drafts.601fe1cc-3036-4084-acd4-fbec3f854e78': 'ead01c1e-7c4f-4198-b638-e16141755690', // Kingston Racing Team
    'drafts.7f7ed5b0-b46f-442c-9e7f-73d6c7d67c83': 'dff2bac4-eef7-4309-802f-9f6d7bc9b51f', // Frederick University Formula Racing Team
    'drafts.cbde5b1a-c041-4585-a51f-c5762280a745': 'd37a7a68-7325-4884-9b13-5e57bf4398b6', // Formula Student Technical University of Crete Team
    'drafts.d4a3ac43-5f32-4d56-ad48-6abf8fc06884': 'b8793138-0e20-4911-87a8-ec9f2b093eed', // Electric Vehicle Racing Team Tuiasi
    'drafts.e2b556fb-1a7c-4f99-b3a7-8112c2fe6f47': '12c104ca-f49a-459f-b291-74a5aaac3064', // Centaurus Racing Team
    'drafts.e6b60d31-e25a-4606-b905-54559ae9ef69': '51ccac6c-5c24-4efc-be93-05ce07a88523', // Democritus Racing Team
    'drafts.ec838b53-6a87-4de4-a614-5109e4f4e2be': '128e4774-2a01-4fda-84ce-d5d626e408b4', // Aristotle University Racing Team Electric and Driverless
    'drafts.edb9b4f5-9a59-4aa0-8923-662be48f21d1': '9a7cfdfb-e3eb-451d-a281-a77eaa2c4798', // Pelops Racing Team
  };
  
  // Get all unique team reference IDs (including draft IDs)
  const teamRefs: string[] = Array.from(new Set(
    results
      .map((r: any) => r.teamRef)
      .filter((ref: unknown): ref is string => typeof ref === 'string' && Boolean(ref))
  ));
  
  // Map old draft IDs to new published IDs and include both in the query
  const allTeamRefs = [...new Set(teamRefs.flatMap((ref: string) => {
    const mappedId = teamIdMapping[ref];
    const refs = [ref];
    if (mappedId) {
      refs.push(mappedId);
    }
    // Also try without drafts prefix
    if (ref.startsWith('drafts.')) {
      refs.push(ref.substring(7));
    } else {
      refs.push(`drafts.${ref}`);
    }
    return refs;
  }))];
  
  // Query teams by exact IDs - this works for both published and drafts
  const teams = allTeamRefs.length > 0 
    ? await client.fetch(groq`*[_id in ${JSON.stringify(allTeamRefs)}] {
      _id,
      name,
      country,
      logo {
        asset->{
          _id,
          url
        }
      }
    }`)
    : [];
  
  // Create a map of team ID to team data (handling both published and draft versions)
  const teamMap = new Map();
  teams.forEach((team: any) => {
    // Store by both the actual ID and without drafts prefix
    const idWithoutDrafts = team._id.replace('drafts.', '');
    teamMap.set(team._id, team);
    if (team._id.startsWith('drafts.')) {
      teamMap.set(idWithoutDrafts, team);
    }
  });
  
  // Join teams to results
  return results.map((result: any) => {
    const teamRef = result.teamRef;
    if (!teamRef) {
      return {
        ...result,
        team: null
      };
    }
    
    // First, try to map old draft ID to new published ID
    const mappedTeamId = teamIdMapping[teamRef] || teamRef;
    
    // Try to find team by various ID formats
    const team = teamMap.get(mappedTeamId)
      || teamMap.get(teamRef) 
      || teamMap.get(teamRef.replace('drafts.', '')) 
      || teamMap.get(`drafts.${teamRef}`)
      || (teamRef.startsWith('drafts.') ? teamMap.get(teamRef.substring(7)) : null);
    
    if (!team) {
      console.warn(`Team reference not resolved for result ${result._id}: ${teamRef} (mapped to: ${mappedTeamId}). Available teams: ${Array.from(teamMap.keys()).join(', ')}`);
    }
    
    return {
      ...result,
      team: team || null
    };
  });
}


// Statistics query
export async function getStatistics() {
  const query = groq`*[_type == "statistic"] | order(order asc) {
    _id,
    label,
    value,
    suffix,
    icon,
    description
  }`;
  return await client.fetch(query);
}

// Schedule queries
export async function getSchedule(eventId: string) {
  const query = groq`*[_type == "scheduleItem" && event._ref == "${eventId}"] | order(date asc, time asc) {
    _id,
    date,
    time,
    title,
    description,
    location,
    type,
    order
  }`;
  return await client.fetch(query);
}

// Team queries
export async function getRegisteredTeams(eventId?: string) {
  const eventFilter = eventId ? `"${eventId}" in registeredEvents[]._ref` : '';
  const filterString = eventFilter ? `&& ${eventFilter}` : '';
  const query = groq`*[_type == "team" ${filterString}] | order(name asc) {
    _id,
    name,
    country,
    category,
    website,
    logo,
    description
  }`;
  return await client.fetch(query);
}

// Event documents query
export async function getEventDocuments(eventId: string) {
  const query = groq`*[_type == "competitionDocument" && event._ref == "${eventId}"] | order(publishedAt desc) {
    _id,
    title,
    description,
    category,
    file {
      asset-> {
        url,
        originalFilename,
        size,
        mimeType
      }
    },
    publishedAt,
    isFeatured
  }`;
  return await client.fetch(query);
}

