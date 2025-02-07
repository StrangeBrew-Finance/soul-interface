import { CurrencyAmount, JSBI, Rebase, Token, ZERO } from 'sdk'
import { isAddress, toAmountCurrencyAmount } from 'functions'
import { useAllTokens } from 'hooks/Tokens'
import { useBentoBoxContract } from 'hooks/useContract'
import { useBentoUserTokens } from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import { OptionalMethodInputs, useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import { useMemo } from 'react'

export interface BentoBalance {
  address: string
  name: string
  symbol: string
  decimals: number
  balance: any
  bentoBalance: any
  wallet: any
  bento: any
}

const BLACKLISTED = [
  '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
  '0x72B886d09C117654aB7dA13A14d603001dE0B777',
  '0x21413c119b0C11C5d96aE1bD328917bC5C8ED67E',
]

export function useBentoMasterContractAllowed(masterContract?: string, user?: string): boolean | undefined {
  const contract = useBentoBoxContract()

  const inputs = useMemo(() => [masterContract, user], [masterContract, user])

  const allowed = useSingleCallResult(contract, 'masterContractApproved', inputs).result

  return useMemo(() => (allowed ? allowed[0] : undefined), [allowed])
}

export const useBentoBalancesV2 = (tokenAddresses?: string[]): CurrencyAmount<Token>[] => {
  const { chainId, account } = useActiveWeb3React()
  const { error, data } = useBentoUserTokens({
    chainId,
    shouldFetch: !!chainId && !!account,
    variables: { user: account?.toLowerCase() },
  })
  const userTokensFallback = useBentoBalancesSubGraph({ shouldFetch: !!error, tokenAddresses })

  if (!error && !!data) {
    if (tokenAddresses) {
      return data.filter((el) => tokenAddresses.includes(el.currency.wrapped.address))
    }

    return data || []
  }

  return userTokensFallback || []
}

export const useBentoBalanceV2 = (tokenAddress?: string): CurrencyAmount<Token> | undefined => {
  const addresses = useMemo(() => (tokenAddress ? [tokenAddress] : []), [tokenAddress])
  return useBentoBalancesV2(addresses)?.[0]
}

export const useBentoBalancesSubGraph = ({
  shouldFetch = true,
  tokenAddresses,
}: {
  shouldFetch?: boolean
  tokenAddresses?: string[]
}) => {
  const { account } = useActiveWeb3React()
  const contract = useBentoBoxContract()
  const allTokens = useAllTokens()
  const totalsInput = useMemo(
    () =>
      shouldFetch
        ? tokenAddresses && tokenAddresses.length > 0
          ? tokenAddresses.map((el) => [el])
          : Object.keys(allTokens).reduce<string[][]>((acc, token) => {
              if (!BLACKLISTED.includes(token) && isAddress(token) !== false) acc.push([token])
              return acc
            }, [])
        : [],
    [tokenAddresses, allTokens, shouldFetch]
  )

  const totals = useSingleContractMultipleData(contract, 'totals', totalsInput)
  const anyLoading = totals.some((callState) => callState.loading)
  const [tokens, baseTotals, balanceInput] = useMemo(
    () =>
      !anyLoading
        ? totals.reduce<[Token[], Rebase[], OptionalMethodInputs[]]>(
            (acc, el, i) => {
              if (account && el?.result && JSBI.greaterThan(JSBI.BigInt(el.result[0]), JSBI.BigInt(0))) {
                const { base, elastic } = el.result
                acc[0].push(allTokens[totalsInput[i][0]])
                acc[1].push({ base: JSBI.BigInt(base), elastic: JSBI.BigInt(elastic) })
                acc[2].push([totalsInput[i][0], account])
              }

              return acc
            },
            [[], [], []]
          )
        : [[], [], []],
    [account, totalsInput, allTokens, anyLoading, totals]
  )

  const balances = useSingleContractMultipleData(contract, 'balanceOf', balanceInput)
  return useMemo(() => {
    return balances.reduce<CurrencyAmount<Token>[]>((acc, el, i) => {
      if (baseTotals[i] && tokens[i] && el.result?.[0]) {
        const amount = toAmountCurrencyAmount(
          baseTotals[i],
          CurrencyAmount.fromRawAmount(tokens[i], JSBI.BigInt(el.result[0]))
        )

        if (amount.greaterThan(ZERO)) {
          acc.push(amount)
        }
      }

      return acc
    }, [])
  }, [balances, baseTotals, tokens])
}
