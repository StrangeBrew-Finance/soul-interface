import { combineReducers } from '@reduxjs/toolkit'

import mines from '../features/mines/minesSlice'
// import tridentAdd from '../features/trident/add/addSlice'
// import tridentBalances from '../features/trident/balances/balancesSlice'
// import tridentCreate from '../features/trident/create/createSlice'
// import tridentMigrations from '../features/trident/migrate/context/migrateSlice'
// import tridentPools from '../features/trident/pools/poolsSlice'
// import tridentRemove from '../features/trident/remove/removeSlice'
// import tridentSwap from '../features/trident/swap/swapSlice'
import application from './application/reducer'
import burn from './burn/reducer'
import create from './create/reducer'
import web3Context from './global/web3ContextSlice'
// import inari from './inari/reducer'
// import limitOrder from './limit-order/reducer'
import lists from './lists/reducer'
import mint from './mint/reducer'
import multicall from './multicall/reducer'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'
import zap from './zap/reducer'

const reducer = combineReducers({
  application,
  user,
  transactions,
  swap,
  mint,
  burn,
  multicall,
  lists,
  // limitOrder,
  create,
  // inari,
  mines,
  zap,
  // tridentSwap,
  // tridentAdd,
  // tridentRemove,
  // tridentBalances,
  // tridentPools,
  // tridentCreate,
  // tridentMigrations,
  web3Context,
})

export default reducer