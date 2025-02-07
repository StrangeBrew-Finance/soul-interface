export const zeroAddress = '0x0000000000000000000000000000000000000000'

export const AnyswapEthOperaBridgeAddress = '0x5cbe98480a790554403694b98bff71a525907f5d'

export const Ethereum$FTM = '0x4E15361FD6b4BB609Fa63C81A2be19d873717870'

export const ContractScan = {
    1: 'https://etherscan.io/address/',
    250: 'https://ftmscan.com/address/',
    4002: 'https://testnet.ftmscan.com/address/',
}

// old: 0x27FCdd0DA2F9328Bd8Eede0e7F74e2E5a50a2e7D
// new: 0x0d36535b2666959a52c0c73CB940A59b1EbE9FD6
export const SoulSummonerAddress = '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B'
export const SoulCircleAddress = "0x5063Fc9D759B5b03DD5fBC0B882b5F68CF881C32"
export const MULTICALL_ADDRESS = '0xf682Cc4468608fC4eFbaD6a06D9BC72e7790075a' // SEP22
// export const SUMMONER_HELPER_ADDRESS = '0x9fE3d5F0A33319aaC3B2F5aae52CABA8cF1c4AE8' // SEP27
// export const SUMMONER_HELPER_ADDRESS = '0x21678d9042f0f122507445Cf7F1812d6BC1b5cCE' // NOV4
export const SUMMONER_HELPER_ADDRESS = '0xa224a5D96E58E3dae89D0e4775444A329E67774c' // NOV15

// export const SoulSummonerAddress = {
//     250: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B',
//     4002: '0x70C6A37244feD0Fa4e4148D5ffe38a209dCEd714',
// }

// connected chain -> targeted chain -> address
export const AnyswapBridge = {
    1: {
        250: '0x5cbe98480a790554403694b98bff71a525907f5d',
    },
    250: {
        1: '',
    }
}

// connected chain -> address
export const TokenFantom = {
    1: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
}