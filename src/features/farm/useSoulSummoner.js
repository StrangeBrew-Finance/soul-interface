import { useCallback } from "react";
import { ethers, BigNumber } from "ethers";

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import {
  useSoulSummonerContract,
  useLpTokenContract,
  useErc20Contract,
} from "./useContract";

import { SoulSummonerAddress } from "../constants";

import { farms } from "../constants/farms";

const useSoulSummoner = () => {
  const { account } = useActiveWeb3React()

  // -----------------------
  //  Interaction Functions
  // -----------------------

  // Deposit
  const deposit = async (pid, amount) => {
    try {
      const summonerContract = await useSoulSummonerContract();

      const result = await summonerContract?.connect(account).deposit(pid, amount);
      return result;
    } catch (e) {
      console.log(e);
      alert(e.message);
      return e;
    }
  };

  // Withdraw
  const withdraw = async (pid, amount) => {
    try {
      const summonerContract = await useSoulSummonerContract();

      let result = await summonerContract?.connect(account).withdraw(pid, amount);
      return result;
    } catch (e) {
      alert(e.message);
      console.log(e);
      return e;
    }
  };

  // -----------------------
  //  Read Functions
  // ---------------------- -

  // Pool length
  const poolLength = async () => {
    try {
      const summonerContract = await useSoulSummonerContract();

      const result = await summonerContract?.connect(account).poolLength();
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  // pool info
  const poolInfo = async (pid) => {
    try {
      const summonerContract = await useSoulSummonerContract();

      const result = await summonerContract?.connect(account).poolInfo(pid);
      const lpTokenContract = result?.[0].toString();
      const allocPoint = BigNumber.from(result?.[1]);
      const lastRewardTime = BigNumber.from(result?.[2]);
      const accSoulPerShare = BigNumber.from(result?.[3]);
      return [lpTokenContract, allocPoint, lastRewardTime, accSoulPerShare];
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  // user info
  const userInfo = async (pid) => {
    try {
      const summonerContract = await useSoulSummonerContract();

      const result = await summonerContract?.connect(account).userInfo(pid, account);
      const amount = result?.[0].toString();
      const rewardDebt = result?.[1].toString();
      return [amount, rewardDebt];
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  // amount of soul pending for redemption
  const pendingSoul = async (pid, user) => {
    try {
      const summonerContract = await useSoulSummonerContract();

      const result = await summonerContract?.connect(account).pendingSoul(pid, user);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  // -----------------------
  //  Fee Fetchers
  // -----------------------

  const dailyDecay = async () => {
    try {
      const summonerContract = await useSoulSummonerContract();

      const result = await summonerContract?.connect(account).dailyDecay();
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const getWithdrawable = async (pid, amount) => {
    try {
      const summonerContract = await useSoulSummonerContract();

      const result = await summonerContract?.connect(account).getWithdrawable(pid, amount);
      return result;y
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  
  const getFeePercent = async (pid) => {
    try {
      const summonerContract = await useSoulSummonerContract();

      const result = await summonerContract?.connect(account).getFeePercent(pid);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  };


  // -----------------------
  //  User Lp Allocation
  // -----------------------

  /**
   * The amount of tokens the user holds compared to the contract
   * Note : need to make func to calculate how many staked compared to pool
   */
  const fetchUserLpTokenAlloc = async (lpToken) => {
    try {
      const lpTokenContract = await useLpTokenContract(lpToken);
      const contractBal = await lpTokenContract?.connect(account).balanceOf(SoulSummonerAddress);

      const userBal = await lpTokenContract?.connect(account).balanceOf(account);

      const alloc = userBal / contractBal;
      const allocPerc = alloc * 100;

      return [alloc, allocPerc];
    } catch (e) {
      console.log(e);
      alert(e.message);
      return e;
    }
  };

  /**
   * The amount of tokens the user holds compared to the contract
   * Note : need to make func to calculate how many staked compared to pool
   */
  const fetchUserLpTokenAllocInFarm = async (lpToken, pid) => {
    try {
      const lpTokenContract = await useLpTokenContract(lpToken);
      
      // get how many lpTokens in contract
      const totalSupply = await lpTokenContract?.connect(account).totalSupply();
      // get how many lpTokens held by Summoner
      const heldBySummoner = await lpTokenContract?.connect(account).balanceOf(SoulSummonerAddress);
      // get how many lpTokens held by user
      const heldByUser = await lpTokenContract?.connect(account).balanceOf(account);

      // summoner % of total supply
      const summonerPercOfSupply = heldBySummoner / totalSupply * 100

      // user unstaked only %s
      const userUnstakedPercOfSupply = heldByUser / totalSupply * 100
      const userUnstakedPercOfSummoner = heldByUser / heldBySummoner * 100

      // user staked only %s
      const userStakedBal = (await userInfo(pid))?.[0]
      const userStakedPercOfSupply = userStakedBal / summonerPercOfSupply * 100
      const userStakedPercOfSummoner = userStakedBal / heldBySummoner * 100
      console.log('userStakedBal', userStakedBal.toString())
      console.log('heldBySummoner', heldBySummoner.toString())
      console.log('userStakedPercOfSummoner', userStakedPercOfSummoner.toString())


      // user staked + unstaked %s
      const netUserLpTokens = userStakedBal + heldByUser;
      const netUserPercOfSupply = netUserLpTokens / totalSupply * 100;
      const netUserPercOfSummoner = netUserLpTokens / heldBySummoner * 100;

      return [
        summonerPercOfSupply, 
        userUnstakedPercOfSupply, 
        userUnstakedPercOfSummoner, 
        userStakedPercOfSupply,
        userStakedPercOfSummoner,
        netUserPercOfSupply,
        netUserPercOfSummoner,
      ];
    } catch (e) {
      console.log(e);
      alert(e.message);
      return e;
    }
  };

  // -----------------------
  //  Liquidity + APR
  // -----------------------

  // soul is emitted per second
  const soulPerSecond = async () => {
    try {
      const summonerContract = await useSoulSummonerContract();

      const sps = await summonerContract?.connect(account).soulPerSecond();
      return sps;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  // total allocation point (net amount of all pools combined)
  const totalAllocPoint = async () => {
    try {
      const summonerContract = await useSoulSummonerContract();

      const totalAlloc = await summonerContract?.connect(account).totalAllocPoint();
      return totalAlloc;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  // const fetchFusdValue = useCallback(async (lpToken) => {
  //   try {
  //     // return total amount of lp tokens locked in summoner contract
  //     const netLpTokens = await lpTokenContract?.balanceOf(SoulSummonerAddress)

  //     // how many ftm tokens held in the lpTokenContract account
  //     const fusdOrFtmAmount = isFusd ? await wftmContract.balanceOf(lpToken) : await fusdContract.balanceOf(lpToken)

  //     return fusdOrFtmAmount
  //   } catch (e) {
  //     console.log(e)
  //     alert(e.message)
  //     return e
  //   }
  // }, [summonerContract])

  /**
   * Value of SOUL in FUSD
   */
  const fusdPerSoul = async () => {
    try {
      const soulContract = await useErc20Contract(farms[0].token1Address[4002]);
      const fusdContract = await useErc20Contract(farms[0].token2Address[4002]);

      const totalSoul = await soulContract.connect(account).balanceOf(
        farms[0].lpAddresses[4002]
      );
      const totalFusd = await fusdContract.connect(account).balanceOf(
        farms[0].lpAddresses[4002]
      );

      const fusdPerSoul = totalFusd / totalSoul;

      return fusdPerSoul;
    } catch (e) {
      console.log(e);
      alert(e.message);
      return e;
    }
  };

  /**
   * Value of liqudiity of lpToken
   */
  const fetchLiquidityValue = async (
    token1Name,
    token2Name,
    token1Address,
    token2Address,
    lpToken
  ) => {
    try {
      const token1Contract = await useErc20Contract(token1Address);
      const token2Contract = await useErc20Contract(token2Address);

      const token1Bal = await token1Contract.connect(account).balanceOf(lpToken);
      const token2Bal = await token2Contract.connect(account).balanceOf(lpToken);

      let totalLpValue;

      // check token1 && token2 name for base pair + fetch toatl value
      if (token1Name === "FUSD" || token2Name === "FUSD") {
        totalLpValue =
          (token1Name === "FUSD"
            ? ethers.utils.formatUnits(token1Bal.toString())
            : ethers.utils.formatUnits(token2Bal.toString())) * 2;
      } else if (token1Name === "WFTM" || token2Name === "WFTM") {
        totalLpValue =
          (token1Name === "WFTM"
            ? ethers.utils.formatUnits(token1Bal.toString())
            : ethers.utils.formatUnits(token2Bal.toString())) * 2;
      } else if (token1Name === "SOUL" || token2Name === "SOUL") {
        const soulPerFusd = await fusdPerSoul();
        totalLpValue =
          (token1Name === "SOUL"
            ? ethers.utils.formatUnits(token1Bal.toString())
            : ethers.utils.formatUnits(token2Bal.toString())) *
          soulPerFusd *
          2;
      }

      // lp tokens held by summoner
      const lpTokenContract = await useLpTokenContract(lpToken);
      const totalLpTokens = await lpTokenContract?.connect(account).totalSupply();
      const summonerLpTokens = await lpTokenContract?.connect(account).balanceOf(SoulSummonerAddress);
      const supplyHeldBySummoner = summonerLpTokens / totalLpTokens * 100;
      
      // value of lp tokens held by summoner
      const summonerTotalLpValue = supplyHeldBySummoner * totalLpValue;

      console.log('totalLpTokens', totalLpTokens.toString())
      console.log('summonerLpTokens', summonerLpTokens.toString())
      console.log('supplyHeldBySummoner', supplyHeldBySummoner.toString())

      console.log('totalLpValue', totalLpValue.toString())
      console.log('summonerTotalLpValue', summonerTotalLpValue.toString())

      return [totalLpValue, summonerTotalLpValue];
    } catch (e) {
      console.log(e);
      alert(e.message);
      return e;
    }
  };

  /**
   * Fetches the APR percentage for the `pid`
   */
  const fetchAprAndLiquidity = async (
    pid,
    token1Name,
    token2Name,
    token1Address,
    token2Address,
    lpToken
  ) => {
    try {
      // pool weight
      const alloc = await poolInfo(pid);
      const totalAlloc = await totalAllocPoint(pid);
      const poolWeight = alloc?.[1] / totalAlloc;

      // soul per sec (sps)
      const soulPerSec = await soulPerSecond();
      const formattedSps = ethers.utils.formatUnits(soulPerSec.toString());

      // amount of soul allocated to this pool per year
      const yearlySoulFarmAlloc = formattedSps * 31557600 * poolWeight;

      // value of lp tokens held by summoner
      const fetchedLiquidity = await fetchLiquidityValue(
        token1Name,
        token2Name,
        token1Address,
        token2Address,
        lpToken
      );

      // farm apr
      const farmApr = yearlySoulFarmAlloc / fetchedLiquidity[1];

      return [farmApr, fetchedLiquidity[0], fetchedLiquidity[1]];
    } catch (e) {
      console.log(e);
      alert(e.message);
      return e;
    }
  };

  return {
    deposit,
    withdraw,
    poolLength,
    poolInfo,
    userInfo,
    pendingSoul,
    soulPerSecond,
    totalAllocPoint,

    dailyDecay,
    getWithdrawable,
    getFeePercent,

    fetchUserLpTokenAlloc,
    fetchUserLpTokenAllocInFarm,

    fetchLiquidityValue,
    fetchAprAndLiquidity,
  };
};

export default useSoulSummoner;