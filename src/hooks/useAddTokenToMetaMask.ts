import { Currency, Token } from '../sdk'
import { useCallback, useState } from 'react'
import { useActiveWeb3React } from 'services/web3'

// import { getTokenLogoURL } from './../components/CurrencyLogo'

export default function useAddTokenToMetaMask(currencyToAdd: Currency | undefined): {
  addToken: () => void
  success: boolean | undefined
} {
  const { chainId, library } = useActiveWeb3React()

  const token: Token | undefined = currencyToAdd?.wrapped

  const [success, setSuccess] = useState<boolean | undefined>()

  const addToken = useCallback(() => {
    if (library && library.provider.isMetaMask && library.provider.request && token) {
      library.provider
        .request({
          method: 'wallet_watchAsset',
          params: {
            //@ts-ignore // need this for incorrect ethers provider type
            type: 'ERC20',
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: token.decimals,
              image: `https://raw.githubusercontent.com/soulswapfinance/assets/analytics/blockchains/fantom/assets/${token.address}/logo.png`
              // image: getTokenLogoURL(token.address, chainId),
            },
          },
        })
        .then((success) => {
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
    } else {
      setSuccess(false)
    }
  }, [chainId, library, token])

  return { addToken, success }
}
