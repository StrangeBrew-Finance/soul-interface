import React from 'react'
import { useModalOpen, useToggleTokenStatsModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import Image from 'next/image'
import styled from 'styled-components'
import Modal from 'components/DefaultModal'
import Typography from 'components/Typography'
import ExternalLink from 'components/ExternalLink'
import { ExternalLink as LinkIcon } from 'react-feather'
import { useTokenInfo } from 'features/summoner/hooks'
import { useSeanceContract, useSoulContract } from 'hooks'
import { formatNumberScale } from 'functions'
import { SOUL_ADDRESS, SEANCE_ADDRESS } from 'constants/addresses'
import { useSingleCallResult } from 'state/multicall/hooks'
import { usePriceHelperContract } from 'features/bond/hooks/useContract'
import QuestionHelper from '../../components/QuestionHelper'
import { useTVL } from 'hooks/useV2Pairs'
import { Wrapper } from 'features/swap/styleds'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { useActiveWeb3React } from 'services/web3'
import ModalHeader from 'components/Modal/Header'

const cache: { [key: string]: number } = {};

export function formatCurrency(c: number, precision = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
}

export default function SoulStatsModal(): JSX.Element | null {

  const { chainId, library, account } = useActiveWeb3React()
  const soulStatsModalOpen = useModalOpen(ApplicationModal.SOUL_STATS)
  const toggleSoulStatsModal = useToggleTokenStatsModal()
  const priceHelperContract = usePriceHelperContract()
  let tokenInfo = useTokenInfo(useSoulContract())
  let seanceInfo = useTokenInfo(useSeanceContract())
  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  // console.log(Number(rawSoulPrice))
  const soulPrice = formatCurrency(Number(rawSoulPrice) / 1E18, 2)
  // console.log(soulPrice)

  const rawSeancePrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x124B06C5ce47De7A6e9EFDA71a946717130079E6'])?.result
  // console.log(Number(rawSeancePrice))
  const seancePrice = formatCurrency(Number(rawSeancePrice) / 1E18, 2)
  // console.log(seancePrice)

  const tvlInfo = useTVL()

  let summTvl = tvlInfo?.reduce((previousValue, currentValue) => {
    return previousValue + currentValue?.tvl
  }, 0)

  function getSummaryLine(title, value) {
    return (
      <div className="flex flex-col gap-2 bg-dark-800 rounded py-1 px-3 w-full">
        <div className="flex items-center justify-between">
          {title}
          <Typography variant="sm" className="flex items-center font-bold py-0.5">
            {value}
          </Typography>
        </div>
      </div>
    )
  }
  if (!chainId) return null

  return (
    <Modal isOpen={soulStatsModalOpen} onDismiss={toggleSoulStatsModal} maxWidth={672}>
      <div className="space-y-8">
        <div className="space-y-4">
          <ModalHeader header={''} onClose={toggleSoulStatsModal} />
          {/* <Wrapper className="flex flex-col-2 justify-between" > */}

          <div className="flex justify-between flex-col-2 w-full py-4">
            {/* <div className="block"> */}
            {/* <QuestionHelper text={`Add to MetaMask`}/> */}
              <div
                className="rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800 p-0.5"
                onClick={() => {
                  const params: any = {
                    type: 'ERC20',
                    options: {
                      address: SOUL_ADDRESS[chainId],
                      symbol: 'SOUL',
                      decimals: 18,
                      image: 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07/logo.png',
                    },
                  }
                  if (library && library.provider.isMetaMask && library.provider.request) {
                    library.provider
                      .request({
                        method: 'wallet_watchAsset',
                        params,
                      })
                      .then((success) => {
                        if (success) {
                          console.log('Successfully added SOUL to MetaMask')
                        } else {
                          throw new Error('Something went wrong.')
                        }
                      })
                      .catch(console.error)
                  }
                }}
              >
                <Image
                  src="https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07/logo.png"
                  alt="SOUL"
                  width="1200px"
                  height="1200px"
                  objectFit="contain"
                  className="rounded-md"
                />
              </div>
              <div
                className="rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800 p-0.5"
                onClick={() => {
                  const params: any = {
                    type: 'ERC20',
                    options: {
                      address: SEANCE_ADDRESS[chainId],
                      symbol: 'SEANCE',
                      decimals: 18,
                      image: 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/0x124B06C5ce47De7A6e9EFDA71a946717130079E6/logo.png',
                    },
                  }
                  if (library && library.provider.isMetaMask && library.provider.request) {
                    library.provider
                      .request({
                        method: 'wallet_watchAsset',
                        params,
                      })
                      .then((success) => {
                        if (success) {
                          console.log('Successfully added SEANCE to MetaMask')
                        } else {
                          throw new Error('Something went wrong.')
                        }
                      })
                      .catch(console.error)
                  }
                }}
              >
                <Image
                  src="https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/0x124B06C5ce47De7A6e9EFDA71a946717130079E6/logo.png"
                  alt="SEANCE"
                  width="1200px"
                  height="1200px"
                  objectFit="contain"
                  className="rounded-md"
                />
              </div>

            {/* </div> */}
            {/* <div className="flex flex-1 flex-col"> */}
            {/* <div className="flex mt-4 flex-row justify-center"> */}
            {/* <div className="mt-6 flex justify-center text-3xl">{'SOUL & SEANCE'}</div> */}
            {/* <div className="flex items-center text-purple justify-between"> */}
          </div>
          {/* </div> */}
          {/* <div className="flex flex-col justify-between">
            <div className="flex items-center text-primary text-bold">
                <div className="text-primary text-base text-secondary text-2xl">{`${soulPrice}`}</div>
                <div className="text-primary text-base text-secondary text-2xl">{`${seancePrice}`}</div> */}
          {/* <div className="flex items-center text-primary text-bold">
              <div className="text-primary text-base text-secondary text-2xl">{`${soulPrice}`}</div>
              </div>
                  <div className="text-primary text-base text-secondary text-2xl">{`${seancePrice}`}</div> */}
          {/* </div> */}
          {/* </div> */}
          {/* </div> */}
        </div>
      </div>
      <div className="space-y-0">

      <div className="flex mt-1" />
        <Typography className='flex justify-center text-2xl leading-[28px] bg-dark-700'>{`Tokenomics Overview`}</Typography>
      </div>
      <div className="flex flex-col mt-2 mb-2 flex-nowrap gap-1.5 -m-1">
        {getSummaryLine(
          <div className="flex items-center">
            <Typography variant="sm" className="flex items-center py-0.5">
              {`Circulating Supply`}
            </Typography>
            <QuestionHelper
              text={
                <div className="flex flex-col gap-2 py-1 px-3 w-full">
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      Total Supply
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      {formatNumberScale(tokenInfo?.totalSupply, false, 2)}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      DAO Treasury
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      - {formatNumberScale(Number(tokenInfo?.totalSupply) * 0.125, false, 2)}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      Total Staked
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      - {formatNumberScale(seanceInfo?.totalSupply, false, 2)}
                    </Typography>
                  </div>
                  <hr></hr>
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      Circulating
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      {formatNumberScale(
                        Number(tokenInfo?.totalSupply)
                        - Number(seanceInfo?.totalSupply)
                        - (Number(tokenInfo?.totalSupply) * 0.125)
                        , false, 2)}
                    </Typography>
                  </div>
                </div>
              }
            />
          </div>,
          formatNumberScale(
            Number(tokenInfo?.totalSupply)
            - Number(seanceInfo?.totalSupply)
            - (Number(tokenInfo?.totalSupply) * 0.125)
            , false, 2)
        )}
        {/* {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Maximum Supply`}
          </Typography>,
          formatNumberScale(
            Number(250_000_000), false, 0)
        )} */}

        {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Total Market Cap`}
          </Typography>,
          formatCurrency(
            Number(tokenInfo?.totalSupply) * Number(rawSoulPrice) / 1E18, 0)
        )}
        {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Total Value Locked`}
          </Typography>,
          formatCurrency(
            Number(summTvl), 0) // staked + tvl
        )}
        {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Soul Market Price`}
          </Typography>,
          formatCurrency(
            Number(rawSoulPrice) / 1E18, 2)
        )}
        {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Seance Market Price`}
          </Typography>,
          formatCurrency(
            Number(rawSeancePrice) / 1E18, 2)
        )}
        <div className="flex mt-3" />
        {/* <div className="flex"> */}
        {/* <ExternalLink
                  href={
                    'https://exchange.soulswap.finance/bonds'
                  }
                  className="ring-6 text-purple bg-dark-800 ring-transparent ring-opacity-0"
                  startIcon={<LinkIcon size={16} />}
                >
                  <Typography className="text-xl hover:underline py-0.5 currentColor">
                    {`Mint`}
                  </Typography>
                  </ExternalLink> */}
        <Button
          color='purple'
          type='flexed'
          size='xs'
          className="text-white"
        >
          <NavLink href={'/bonds'}>
            <a className="flex justify-center text-black text-xl transition rounded-md hover:pink">
              MINT SOUL<span> ↗</span>
            </a>
          </NavLink>
        </Button>
        <Button
          color='purple'
          type='flexed'
          size='xs'
          className="text-white"
        >
          <NavLink href={'/seance'}>
            <a className="flex justify-center text-black text-xl transition rounded-md hover:pink">
              STAKE SOUL<span> ↗</span>
            </a>
          </NavLink>
        </Button>
      </div>
    </Modal>
  )
}


