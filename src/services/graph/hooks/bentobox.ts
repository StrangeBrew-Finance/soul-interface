import { ChainId, CurrencyAmount, Token } from 'sdk'
import { Feature } from 'enums'
import { featureEnabled } from 'functions/feature'
import {
  getBentoBox,
  getBentoStrategies,
  getBentoTokens,
  getBentoUserTokens,
  getClones,
  getKashiPairs,
} from 'services/graph/fetchers'
import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'

import { GraphProps } from '../interfaces'

// TODO: Fix shouldFetch //

export function useClones({ chainId, shouldFetch = true, swrConfig = undefined }) {
  const { data } = useSWR(shouldFetch ? () => ['clones', chainId] : null, (_, chainId) => getClones(chainId), swrConfig)
  return data
}

export function useKashiPairs({
  chainId = ChainId.MAINNET,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? () => ['kashiPairs', chainId, stringify(variables)] : null,
    (_, chainId) => getKashiPairs(chainId, variables),
    swrConfig
  )
  return data
}

export function useBentoBox({ chainId = ChainId.MAINNET, variables, shouldFetch = true, swrConfig }: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['bentoBox', chainId, stringify(variables)] : null,
    () => getBentoBox(chainId, variables),
    swrConfig
  )

  return data
}

// subset of tokens, not strategies
export function useBentoStrategies({
  chainId = ChainId.MAINNET,
  variables,
  // shouldFetch = featureEnabled(Feature.BENTOBOX, chainId),
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    // shouldFetch ? ['bentoStrategies', chainId, stringify(variables)] : 
    null,
    () => getBentoStrategies(chainId, variables),
    swrConfig
  )

  return data as { token: string; apy: number; targetPercentage: number }[]
}

export function useBentoTokens({
  chainId,
  variables,
  // shouldFetch = featureEnabled(Feature.BENTOBOX, chainId),
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    // shouldFetch ? ['bentoTokens', chainId, stringify(variables)] :
    null,
    () => getBentoTokens(chainId, variables),
    swrConfig
  )
  return data
}

export function useBentoUserTokens({
  chainId,
  variables,
  // shouldFetch = featureEnabled(Feature.BENTOBOX, chainId),
  swrConfig = undefined,
}: GraphProps) {
  return useSWR<CurrencyAmount<Token>[]>(
    // shouldFetch ? ['bentoUserTokens', chainId, stringify(variables)] : 
    null,
    () => getBentoUserTokens(chainId, variables),
    swrConfig
  )
}
