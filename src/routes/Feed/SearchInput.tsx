import styled from "@emotion/styled"
import React, { InputHTMLAttributes, useState } from "react"
import { Emoji } from "src/components/Emoji"
import { searchPosts } from "src/services/search"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  onSearchComplete?: (results: any[]) => void
  onLoadingChange?: (isLoading: boolean) => void
}

const SearchInput: React.FC<Props> = ({ onSearchComplete, onLoadingChange, ...props }) => {
  const [searchInContent, setSearchInContent] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const [lastQuery, setLastQuery] = useState("")

  const handleSearch = async (query: string) => {
    if (query.trim() === "") {
      onSearchComplete?.([])
      return
    }

    if (searchInContent) {
      setIsSearching(true)
      onLoadingChange?.(true)
      try {
        const results = await searchPosts(query)
        onSearchComplete?.(results)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
        onLoadingChange?.(false)
      }
    } else {
      // Use the existing client-side search
      onSearchComplete?.([])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    props.onChange?.(e)

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    if (query !== lastQuery) {
      setLastQuery(query)
      
      // Only trigger search if we have a query
      if (query.trim()) {
        const timeoutId = setTimeout(() => {
          handleSearch(query)
        }, 500) // 500ms debounce
        
        setSearchTimeout(timeoutId)
      } else {
        onSearchComplete?.([])
      }
    }
  }

  const toggleSearchInContent = () => {
    const newValue = !searchInContent
    setSearchInContent(newValue)
    
    // If we're enabling full content search and there's a query, trigger a search
    if (newValue && lastQuery.trim()) {
      handleSearch(lastQuery)
    } else if (!newValue) {
      // If disabling full content search, clear results
      onSearchComplete?.([])
    }
  }

  return (
    <StyledWrapper>
      <div className="top">
        <Emoji>🔎</Emoji> Search
        <label className="search-option">
          <input
            type="checkbox"
            checked={searchInContent}
            onChange={toggleSearchInContent}
          />
          <span>Search in full content</span>
        </label>
      </div>
      <div className="search-container">
        <input
          className="mid"
          type="text"
          placeholder="Search Keyword..."
          {...props}
          onChange={handleChange}
          disabled={isSearching}
        />
        {isSearching && (
          <div className="search-loading">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </StyledWrapper>
  )
}

export default SearchInput

const StyledWrapper = styled.div`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
  
  .top {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.25rem;
    margin-bottom: 0.75rem;
  }

  .search-container {
    position: relative;
  }

  .search-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.gray11};
    cursor: pointer;
    user-select: none;

    input {
      margin: 0;
    }
  }
  
  .mid {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    border-radius: 1rem;
    outline-style: none;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.gray4};
    transition: all 0.2s ease;

    &:disabled {
      opacity: 0.7;
      cursor: wait;
    }
  }

  .search-loading {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;

    .spinner {
      width: 100%;
      height: 100%;
      border: 2px solid ${({ theme }) => theme.colors.gray8};
      border-top-color: ${({ theme }) => theme.colors.blue9};
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
