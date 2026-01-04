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
  let filters = [];
  if (eventId) filters.push(`event._ref == "${eventId}"`);
  if (category) filters.push(`category == "${category}"`);
  if (subcategory) filters.push(`subcategory == "${subcategory}"`);
  
  const filterString = filters.length > 0 ? `&& ${filters.join(' && ')}` : '';
  const query = groq`*[_type == "result" ${filterString}] | order(position asc) {
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
    team->{
      _id,
      name,
      university,
      country,
      logo {
        asset->{
          _id,
          url
        }
      }
    }
  }`;
  // Fetch results - team references should resolve even if teams are drafts
  const results = await client.fetch(query);
  
  // Ensure team data is properly resolved
  return results.map((result: any) => {
    // If team is a reference object instead of resolved, try to handle it
    if (result.team && typeof result.team === 'object' && result.team._ref && !result.team.name) {
      // Team reference wasn't resolved - this shouldn't happen with proper query
      // but we'll handle it gracefully
      console.warn(`Team reference not resolved for result ${result._id}:`, result.team._ref);
    }
    return result;
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
    university,
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

