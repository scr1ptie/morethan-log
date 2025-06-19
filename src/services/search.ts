import { TPost } from "src/types"

type SearchResult = (TPost & {
  matchType: 'metadata' | 'content'
})[]

export const searchPosts = async (query: string): Promise<SearchResult> => {
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error('Search failed')
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}
