import { createContext, useContext, useState } from 'react'

export const SearchContext = createContext()

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) throw new Error('no hay que provedor de auntenticacion')
  return context
}

export function SearchProvider({ children }) {
  const [search, setSearch] = useState('')
  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
