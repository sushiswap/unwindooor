// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "@rari-capital/solmate/src/erc20/ERC20.sol";

contract MockERC20 is ERC20("", "", 18) {
    constructor() {
        _mint(msg.sender, 1e18 * 1e6);
    }
    function sync() external {}
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 lastUpdated) {}
    function burn() external returns (address to) {}
}