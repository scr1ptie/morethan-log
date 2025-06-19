import { NextApiRequest, NextApiResponse } from "next"
import { getRecordMap } from "src/apis/notion-client/getRecordMap"
import { getPosts } from "src/apis/notion-client/getPosts"
import { getTextContent } from "notion-utils"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { query } = req.body
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Query is required' })
  }

  try {
    const posts = await getPosts()
    const results = []
    
    // Convert query to lowercase once for case-insensitive search
    const searchQuery = query.toLowerCase()
    
    // First, search in titles, summaries, and tags (fast, client-side)
    const initialResults = posts.filter(post => {
      const tagContent = post.tags ? post.tags.join(" ") : ""
      const searchContent = `${post.title} ${post.summary || ''} ${tagContent}`.toLowerCase()
      return searchContent.includes(searchQuery)
    })

    // Add initial results
    results.push(...initialResults.map(post => ({
      ...post,
      matchType: 'metadata' as const
    })))

    // Then search in full content (slower, server-side)
    for (const post of posts) {
      // Skip if already in results
      if (results.some(r => r.id === post.id)) continue
      
      try {
        const recordMap = await getRecordMap(post.id)
        const content = Object.values(recordMap.block)
          .map(block => {
            // Skip if block doesn't have value or properties
            if (!block.value || !block.value.properties) return ''
            // Get text content from the block
            return Object.entries(block.value.properties)
              .map(([key, value]) => {
                try {
                  // @ts-ignore - value type is not properly typed
                  return getTextContent(value)
                } catch (e) {
                  return ''
                }
              })
              .join(' ')
          })
          .join(' ')
          .toLowerCase()
        
        if (content.includes(searchQuery)) {
          results.push({
            ...post,
            matchType: 'content' as const
          })
        }
      } catch (error) {
        console.error(`Error searching in post ${post.id}:`, error)
        continue
      }
    }

    return res.status(200).json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
