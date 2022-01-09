import { ChainId, NATIVE } from '../../sdk'
import { AURA } from '../../constants'
// import React, { useEffect, useState } from 'react'
import React from 'react'

// import { ANALYTICS_URL } from '../../constants'
// import Buy from '../../features/ramp'
// import ExternalLink from '../ExternalLink'
import Image from 'next/image'
// import LanguageSwitch from '../LanguageSwitch'
// import Link from 'next/link'
import More from './More'
// import Exchange from './Exchange'
import Earn from './Earn'
// import Farms from './Farms'
// import Explore from './Explore'
// import Seance from './Seance'
import NavLink from '../NavLink'
import { Popover } from '@headlessui/react'
// import QuestionHelper from '../QuestionHelper'
import Web3Network from '../Web3Network'
import Web3Status from '../Web3Status'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useETHBalances, useTokenBalance } from '../../state/wallet/hooks'

import { useLingui } from '@lingui/react'
import ExternalLink from '../ExternalLink'
import TokenStats from '../TokenStats'
// import LanguageSwitch from '../LanguageSwitch'

// import { ExternalLink, NavLink } from "./Link";
// import { ReactComponent as Burger } from "../assets/images/burger.svg";

function AppBar(): JSX.Element {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const auraBalance = useTokenBalance(account ?? undefined, AURA[chainId])

  return (
    <header className="flex flex-row justify-between w-screen flex-nowrap">
      {/* <header className="flex-shrink-0 w-full"> */}
      <Popover as="nav" className="z-10 w-full bg-transparent header-border-b">
        {({ open }) => (
          <>
            <div className="px-4 py-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <NavLink href="/landing">
                    <Image src="/logo.png" alt="Soul" width="40" height="40" />
                  </NavLink>
                  {/* <div className="hidden sm:block lg:ml-4"> */}
                  <div className="flex space-x-2">
                    <div className="flex space-x-3">
                      {/* <Exchange /> */}
                      {/* <Farms /> */}
                      {chainId && [ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href="/exchange/swap">
                          <a
                            id={`swap-nav-link`}
                            //  className='focus:outline-none hover:text-high-emphesis'
                            className="w-full relative ml-2 sm:ml-6 md:p-2"
                          >

                            {i18n._(t`SWAP`)}
                          </a>
                        </NavLink>
                      )}
                      {chainId && [ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href="/pool">
                          <a
                            id={`pool-nav-link`}
                            className="w-full relative ml-6 md:p-2"
                          >
                            {/* <Image src="https://media.giphy.com/media/N3NpRukvRmnAI/giphy.gif" alt="offering soul" width="30" height="30" /> */}
                            {i18n._(t`PAIR`)}
                          </a>
                        </NavLink>
                      )}
                      {/* <div
                        className="w-full relative ml-6 md:p-2"
                      > */}
                      {/* <NavLink href={'/seance'}>
                        <a className="w-full relative ml-6 md:p-2"
                        > <Earn />
                        </a>
                      </NavLink> */}
                      {/* </div> */}
                      { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href={'/mines'}>
                          <a
                            id={`farm-nav-link`}
                            // className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800"
                            className="w-full relative ml-6 md:p-2"
                            // className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                            >
                            {i18n._(t`FARM`)}
                          </a>
                        </NavLink>
                      )}
                      { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href={'/seance'}>
                        <a
                          id={`stake-nav-link`}
                          className="w-full relative ml-6 md:p-2"
                          >
                          {i18n._(t`STAKE`)}
                        </a>
                      </NavLink>
                      )}
                      {chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href={'/bonds'}>
                          <a
                            id={`bond-nav-link`}
                            // className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800"
                            className="w-full relative ml-6 md:p-2"
                          >
                            {i18n._(t`BOND`)}
                          </a>
                        </NavLink>
                      )}
                      <NavLink href={'/analytics'}>
                        <a
                          id={`analytics-nav-link`}
                          className="hidden md:block w-full relative ml-6 md:p-2"
                          >
                          {i18n._(t`CHART`)}
                        </a>
                      </NavLink>
                            {chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                              <NavLink href={'/luxor'}>
                                <a
                                  id={`luxor-nav-link`}
                                  className="hidden md:block w-full relative ml-6 md:p-2"
                                >
                                  {i18n._(t`LUXOR`)}
                                </a>
                              </NavLink>
                            )}
                      {/* <NavLink href={'/scarab'}>
                          <a
                            id={`scarab-nav-link`}
                            className="hidden md:block w-full relative ml-6 md:p-2">
                          {i18n._(t`SCARAB`)}
                          </a>
                        </NavLink> */}
                      <NavLink href={'/launchpad'}>
                        <a
                          id={`launchpad-nav-link`}
                          className="hidden md:block w-full relative ml-6 md:p-2">
                          {i18n._(t`LAUNCH`)}
                        </a>
                      </NavLink>
                    </div>
                  </div>
                </div>

                <div className="fixed bottom-0 left-0 z-10 flex flex-row items-center justify-center w-full p-4 xl:w-auto bg-dark-1000 xl:relative xl:p-0 xl:bg-transparent">
                  <div className="flex items-center justify-between w-full space-x-2 sm:justify-end">
                    {library && library.provider.isMetaMask && (
                      <div className="sm:inline-block">
                        <TokenStats />
                      </div>
                    )}
                    <div className="w-auto flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto">
                      {account && chainId && userEthBalance && (
                        <>
                          <div className="hidden 2xl:flex px-2 py-2 text-primary text-bold">
                            {userEthBalance?.toSignificant(4)
                              .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            {NATIVE[chainId].symbol}
                          </div>
                          {account && chainId && (
                            <>
                              <div className="hidden md:inline px-3 py-2 text-primary text-bold">
                                {auraBalance?.toSignificant(4)
                                  .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                } {'AURA'}
                              </div>
                            </>
                          )}
                        </>
                      )}
                      <Web3Status />
                      {library && library.provider.isMetaMask && (
                        <div className="hidden sm:inline-block">
                          <Web3Network />
                        </div>
                      )}
                    </div>

                    {/* <div className="hidden xl:block"> */}
                    {/* <LanguageSwitch /> */}
                    {/* </div> */}
                    <More />
                  </div>
                </div>
                <div className="flex -mr-2 xl:hidden">
                  {/* Mobile Menu Button */}
                  <Popover.Button className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-high-emphesis focus:outline-none">
                    <span className="sr-only">{i18n._(t`Open Main Menu`)}</span>
                    {open ? (
                      <svg
                        className="block w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg
                        className="block w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    )}
                  </Popover.Button>
                </div>
              </div>
            </div>

            <Popover.Panel className="xl:hidden">
              <div className="flex flex-col px-10 pt-2 pb-3 space-y-4">

                {chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                  <ExternalLink href={'https://app.luxor.money'}>
                    <a
                      id={`luxor-nav-extlink`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {i18n._(t`Luxor Money`)}
                    </a>
                  </ExternalLink>
                )}
                {chainId && [ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                  <ExternalLink href={'https://info.soulswap.finance'}>
                    <a
                      id={`vote-nav-extlink`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {i18n._(t`View Charts`)}
                    </a>
                  </ExternalLink>
                )}
                {chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                  <ExternalLink href={'https://app.soulswap.finance/vote'}>
                    <a
                      id={`vote-nav-extlink`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {i18n._(t`Governance`)}
                    </a>
                  </ExternalLink>
                )}
                {chainId && [ChainId.MAINNET, ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                  <ExternalLink href={'https://docs.soulswap.finance'}>
                    <a
                      id={`links-nav-link`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {i18n._(t`Documentation`)}
                    </a>
                  </ExternalLink>
                )}
                {chainId && [ChainId.MAINNET, ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                  <ExternalLink href={'/tools'}>
                    <a
                      id={`tools-nav-link`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {i18n._(t`Explore More`)}
                    </a>
                  </ExternalLink>
                )}
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </header>
  )
}

export default AppBar

