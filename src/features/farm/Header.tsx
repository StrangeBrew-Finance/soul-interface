import { Currency, Percent } from '../../sdk'
import React, { FC, useCallback, useState } from 'react'
import NavLink from '../../components/NavLink'

import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Search from '../../components/Search';

const getQuery = (input, output) => {
  if (!input && !output) return

  if (input && !output) {
    return { inputCurrency: input.address || 'ETH' }
  } else if (input && output) {
    return { inputCurrency: input.address, outputCurrency: output.address }
  }
}

interface FarmHeaderProps {
  input?: Currency
  output?: Currency
  allowedSlippage?: Percent
  search?: (term: string) => void
}

const FarmHeader: FC<FarmHeaderProps> = ({ input, output, search }) => {
  const { i18n } = useLingui()
  const [term, setTerm ] = useState("");
  const saveTermAndSearch = useCallback((searchingTerm: string) => {
    setTerm(searchingTerm);
    if (search && typeof search === "function") {
      search(searchingTerm.toLowerCase()); // forces lowercase
    }
  }, []);

  return (
    <div className="flex items-center justify-center mb-4 space-x-3">
      <div className="grid grid-cols-3 rounded p-3px bg-dark-800 h-[46px]">
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple"
          href={{
            pathname: '/farms/all',
            query: getQuery(input, output),
          }}
        >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis ">
            {i18n._(t`ALL`)}
          </a>
        </NavLink>
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple"
          href={"/farms/inactive"}
        >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {i18n._(t`INACTIVE`)}
          </a>
        </NavLink>
      { search && 
          <Search
            term={term}
            search={saveTermAndSearch}
            inputProps={{
              placeholder: 'Search',
              className:
              'relative bg-transparent border border-transparent rounded placeholder-secondary focus:placeholder-primary font-bold text-base px-6 py-3',
            }}
            />
    }
      </div>
    </div>
  )
}

export default FarmHeader
