// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "./WethMaker.sol";

/// @notice Contract for selling weth to sushi.
contract SushiMaker is WethMaker {

    address public immutable sushi;
    address public immutable xSushi;

    constructor(
        address _owner,
        address _user,
        address _factory,
        address _weth,
        address _sushi,
        address _xSushi
    ) WethMaker(_owner, _user, _factory, _weth) {
        sushi = _sushi;
        xSushi = _xSushi;
    }

    function buySushi(uint256 amountIn, uint256 minOutAmount) external onlyTrusted {
        if (_swap(weth, sushi, amountIn, xSushi) < minOutAmount) revert SlippageProtection();
    }

    function sweep() external {
        IERC20(sushi).transfer(xSushi, IERC20(sushi).balanceOf(address(this)));
    }

}
