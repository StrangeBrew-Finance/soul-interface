import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { ChainId, SOUL_SUMMONER_ADDRESS, Token } from 'sdk'
import AssetInput from 'components/AssetInput'
import { Button } from 'components/Button'
import { HeadlessUiModal } from 'components/Modal'
import Switch from 'components/Switch'
import Typography from 'components/Typography'
import Web3Connect from 'components/Web3Connect'
// import { OLD_FARMS } from 'config/farms'
import { useMineListItemDetailsModal } from 'features/mines/MineListItemDetails'
import { setMinesModalOpen } from 'features/mines/minesSlice'
import { classNames, tryParseAmount } from 'functions'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useActiveWeb3React } from 'services/web3'
import { useAppDispatch } from 'state/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import React, { useState } from 'react'

// import { PairType } from '../enum'
import { useUserInfo } from '../hooks'
import useMasterChef from '../hooks/useMasterChef'

// @ts-ignore TYPE NEEDS FIXING
const ManageBar = ({ farm }) => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useActiveWeb3React()
  const { setContent } = useMineListItemDetailsModal()
  const [toggle, setToggle] = useState(true)
  const [depositValue, setDepositValue] = useState<string>()
  const [withdrawValue, setWithdrawValue] = useState<string>()
  const { deposit, withdraw } = useMasterChef()
  const addTransaction = useTransactionAdder()
  const liquidityToken = new Token(
    // @ts-ignore TYPE NEEDS FIXING
    chainId || 250,
    getAddress(farm.lpToken),
    18,
    'SOUL-LP'
    // farm.pair.type === PairType.KASHI ? Number(farm.pair.asset.decimals) : 18,
    // farm.pair.type === PairType.KASHI ? 'KMP' : 'SLP'
  )
  const balance = useCurrencyBalance(account ?? undefined, liquidityToken)
  const stakedAmount = useUserInfo(farm, liquidityToken)
  const parsedDepositValue = tryParseAmount(depositValue, liquidityToken)
  const parsedWithdrawValue = tryParseAmount(withdrawValue, liquidityToken)
  // @ts-ignore TYPE NEEDS FIXING
  const [approvalState, approve] = useApproveCallback(parsedDepositValue, SOUL_SUMMONER_ADDRESS[chainId])

  const depositError = !parsedDepositValue
    ? 'Enter Amount'
    : balance?.lessThan(parsedDepositValue)
    ? 'Insufficient Balance'
    : undefined
  const isDepositValid = !depositError
  const withdrawError = !parsedWithdrawValue
    ? 'Enter Amount'
    : // @ts-ignore TYPE NEEDS FIXING
    stakedAmount?.lessThan(parsedWithdrawValue)
    ? 'Insufficient Balance'
    : undefined
  const isWithdrawValid = !withdrawError

  return (
    <>
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 bg-dark-1000/40">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              {toggle ? i18n._(t`Deposit Liquidity`) : i18n._(t`Withdraw Liquidity`)}
            </Typography>
            <Switch
              size="sm"
              checked={toggle}
              onChange={() => setToggle(!toggle)}
              checkedIcon={<PlusIcon className="text-dark-1000" />}
              uncheckedIcon={<MinusIcon className="text-dark-1000" />}
            />
          </div>

          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Use one of the buttons to set a percentage or enter a value manually using the input field.`)}
          </Typography>
        </div>

        <div className="flex justify-end gap-2">
          {['25', '50', '75', '100'].map((multiplier, i) => (
            <Button
              variant="outlined"
              size="xs"
              color={toggle ? 'blue' : 'purple'}
              key={i}
              onClick={() => {
                toggle
                  ? balance
                    ? // @ts-ignore TYPE NEEDS FIXING
                      setDepositValue(balance.multiply(multiplier).divide(100).toExact())
                    : undefined
                  : stakedAmount
                  ? // @ts-ignore TYPE NEEDS FIXING
                    setWithdrawValue(stakedAmount.multiply(multiplier).divide(100).toExact())
                  : undefined
              }}
              className={classNames(
                'text-md border border-opacity-50',
                toggle ? 'focus:ring-blue border-blue' : 'focus:ring-pink border-pink'
              )}
            >
              {multiplier === '100' ? 'MAX' : multiplier + '%'}
            </Button>
          ))}
        </div>
        <AssetInput
          currencyLogo={false}
          currency={liquidityToken}
          value={toggle ? depositValue : withdrawValue}
          onChange={setDepositValue}
          balance={toggle ? undefined : stakedAmount}
          showMax={false}
        />
      </HeadlessUiModal.BorderedContent>
      {toggle ? (
        !account ? (
          <Web3Connect size="lg" color="blue" />
        ) : isDepositValid &&
          (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) ? (
          <Button
            fullWidth
            loading={approvalState === ApprovalState.PENDING}
            color="gradient"
            onClick={approve}
            disabled={approvalState !== ApprovalState.NOT_APPROVED}
          >
            {i18n._(t`Approve`)}
          </Button>
        ) : (
          <Button
            fullWidth
            color={!isDepositValid && !!parsedDepositValue ? 'red' : 'blue'}
            onClick={async () => {
              try {
                // KMP decimals depend on asset, SLP is always 18
                // @ts-ignore TYPE NEEDS FIXING
                const tx = await deposit(farm.id, BigNumber.from(parsedDepositValue?.quotient.toString()))
                if (tx?.hash) {
                  setContent(
                    <HeadlessUiModal.SubmittedModalContent
                      txHash={tx?.hash}
                      header={i18n._(t`Success!`)}
                      subheader={i18n._(t`Success! Transaction successfully submitted`)}
                      onDismiss={() => dispatch(setMinesModalOpen(false))}
                    />
                  )
                  addTransaction(tx, {
                    summary: `Deposit ${farm.pair.token0.name}/${farm.pair.token1.name}`,
                  })
                }
              } catch (error) {
                console.error(error)
              }
            }}
            disabled={!isDepositValid}
          >
            {depositError || i18n._(t`Confirm Deposit`)}
          </Button>
        )
      ) : !account ? (
        <Web3Connect color="blue" className="w-full" />
      ) : (
        <Button
          fullWidth
          color={!isWithdrawValid && !!parsedWithdrawValue ? 'red' : 'blue'}
          onClick={async () => {
            try {
              // KMP decimals depend on asset, SLP is always 18
              // @ts-ignore TYPE NEEDS FIXING
              const tx = await withdraw(farm.id, BigNumber.from(parsedWithdrawValue?.quotient.toString()))
              if (tx?.hash) {
                setContent(
                  <HeadlessUiModal.SubmittedModalContent
                    txHash={tx?.hash}
                    header={i18n._(t`Success!`)}
                    subheader={i18n._(t`Success! Transaction successfully submitted`)}
                    onDismiss={() => dispatch(setMinesModalOpen(false))}
                  />
                )
                addTransaction(tx, {
                  summary: `Withdraw ${farm.pair.token0.name}/${farm.pair.token1.name}`,
                })
              }
            } catch (error) {
              console.error(error)
            }
          }}
          disabled={!isWithdrawValid}
        >
          {withdrawError || i18n._(t`Confirm Withdraw`)}
        </Button>
      )}
    </>
  )
}

export default ManageBar