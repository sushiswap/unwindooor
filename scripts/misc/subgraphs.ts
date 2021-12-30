import { AddressMap, ChainId } from "@sushiswap/core-sdk";

export const SUBGRAPHS: AddressMap = {
  [ChainId.ETHEREUM]: "https://thegraph.com/explorer/subgraph/sushiswap/exchange",
  [ChainId.BSC]: "https://thegraph.com/explorer/subgraph/sushiswap/bsc-exchange",
  [ChainId.OKEX]: "https://q.hg.network/okex-exchange/oec",
  [ChainId.XDAI]: "https://thegraph.com/explorer/subgraph/sushiswap/xdai-exchange",
  [ChainId.HECO]: "https://q.hg.network/heco-exchange/heco",
  [ChainId.MATIC]: "https://thegraph.com/explorer/subgraph/sushiswap/matic-exchange",
  [ChainId.FANTOM]: "https://thegraph.com/explorer/subgraph/sushiswap/fantom-exchange",
  [ChainId.ARBITRUM]: "https://thegraph.com/explorer/subgraph/sushiswap/arbitrum-exchange",
  [ChainId.CELO]: "https://thegraph.com/explorer/subgraph/sushiswap/celo-exchange",
  [ChainId.AVALANCHE]: "https://thegraph.com/explorer/subgraph/sushiswap/avalanche-exchange",
  [ChainId.HARMONY]: "https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-exchange"
}