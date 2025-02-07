import DoubleCurrencyLogo from '../../../components/DoubleLogo'
import Table from '../../../components/Table'
import { formatPercent } from '../../../functions'
import { pairQuery } from '../../../services/graph/queries'
import { useCurrency } from '../../../hooks/Tokens'
import { useMemo } from 'react'
import { useSoulPairs } from '../../../services/graph'

interface TopFarmsListProps {
  farms: {
    pair: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
    }
    roi: number
    rewards: {
      icon: JSX.Element
    }[]
  }
}

interface FarmListNameProps {
  pair: {
    token0: {
      id: string
      symbol: string
    }
    token1: {
      id: string
      symbol: string
    }
  }
}

function FarmListname({ pair }: FarmListNameProps): JSX.Element {
  const token0 = useCurrency(pair.token0.id)
  const token1 = useCurrency(pair.token1.id)

  return (
    <div className="flex items-center">
      <DoubleCurrencyLogo currency0={token0} currency1={token1} size={28} />
      <div className="ml-3 font-bold text-high-emphesis">
        {pair.token0.symbol}-{pair.token1.symbol}
      </div>
    </div>
  )
}

export default function TopFarmsList({ farms }: TopFarmsListProps): JSX.Element {
  const columns = useMemo(
    () => [
      {
        Header: 'Token Pair',
        accessor: 'pair',
        Cell: (props) => <FarmListname pair={props.value} />,
        disableSortBy: true,
        align: 'left',
      },
      {
        Header: 'ROI (1Y)',
        accessor: 'roi',
        Cell: (props) => formatPercent(props.value),
        align: 'right',
      },
      {
        Header: 'Rewards',
        accessor: 'rewards',
        Cell: (props) => props.value,
      },
    ],
    []
  )

  return <>{farms && <Table columns={columns} data={farms} defaultSortBy={{ id: 'ROI (1Y)', desc: true }} />}</>
}
