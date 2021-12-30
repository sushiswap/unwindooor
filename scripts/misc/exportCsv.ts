import axios from "axios";
import { SUBGRAPHS } from "./subgraphs";

const getQuery = (user: string) => `{
	liquidityPositionSnapshots (first: 30, orderBy: reserveUSD, orderDirection: desc, where:
    {
			user: "${user}"
		}
  ){
	  liquidityTokenBalance,
    reserveUSD
	}
}`

export const exportCsv = async function ({ from }: any, { ethers, getChainId }: any): Promise<void> {
  const chainId = parseInt(await getChainId());
  const subgraphUrl = SUBGRAPHS[chainId];
  const to = await ethers.getContract("WethMaker");
  console.log(from);
  console.log(to.address);
  console.log(subgraphUrl);
  // console.log(await axios(subgraphUrl, { method: 'POST', data: { query: getQuery(from) } }));
}