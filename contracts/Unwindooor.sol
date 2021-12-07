// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "./Auth.sol";
import "./interfaces/IUniV2.sol";

/// @notice Contract for withdrawing LP positions.
/// @dev Calling unwindPairs() withdraws the LP position into one of the two tokens
contract Unwindooor is Auth {

    error SlippageProtection();

    constructor(address _owner, address _user) Auth(_owner, _user) {}

    function unwindPairs(
        IUniV2[] calldata lpTokens,
        uint256[] calldata amounts,
        uint256[] calldata minimumOuts,
        bool[] calldata keepToken0
    ) external onlyTrusted {
        for (uint256 i = 0; i < lpTokens.length; i++) {
            if (_unwindPair(lpTokens[i], amounts[i], keepToken0[i]) < minimumOuts[i]) revert SlippageProtection();
        }
    }

    function _unwindPair(
        IUniV2 pair,
        uint256 amount,
        bool keepToken0
    ) private returns (uint256 amountOut) {

        pair.transfer(address(pair), amount);
        (uint256 amount0, uint256 amount1) = pair.burn(address(pair));
        (uint112 reserve0, uint112 reserve1,) = pair.getReserves();

        if (keepToken0) {
            amountOut = amount0 + _getAmountOut(amount1, uint256(reserve1), uint256(reserve0));
            pair.swap(amountOut, 0, address(this), "");
        } else {
            amountOut = amount1 + _getAmountOut(amount0, uint256(reserve0), uint256(reserve1));
            pair.swap(0, amountOut, address(this), "");
        }
    }

    function _getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256) {
        uint256 amountInWithFee = amountIn * 997;
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = reserveIn * 1000 + amountInWithFee;
        return numerator / denominator;
    }

/* 
    // helper functions
    
    function easySlippageCalc(
        IUniV2[] memory lpTokens,
        uint256 slippage,
        address[] memory preferTokens
    ) external view returns (uint256[] memory amounts, uint256[] memory minimumOuts, bool[] memory keepToken0) {
        for (uint256 i = 0; i < lpTokens.length; i++) {

            IUniV2 pool = lpTokens[i];
            
            uint256 amount = pool.balanceOf(address(this));
            
            if (_included(preferTokens, pool.token0())) keepToken0[i] = true;
            
            amounts[i] = amount;
            
            minimumOuts[i] = _easySlippage(pool, amount, keepToken0[i]) * slippage / 1e3;
        }
    }

    function _easySlippage(
        IUniV2 pool,
        uint256 amount,
        bool keepToken0
    ) private view returns (uint256 minimumOut) {

        uint256 totalSupply = pool.totalSupply();
        (uint112 reserve0, uint112 reserve1,) = pool.getReserves();
        uint256 amount0 = reserve0 * amount / totalSupply;
        uint256 amount1 = reserve1 * amount / totalSupply;

        reserve0 -= uint112(amount0);
        reserve1 -= uint112(amount1);

        if (keepToken0) {
            minimumOut = amount0 + _getAmountOut(amount1, uint256(reserve1), uint256(reserve0));
        } else {
            minimumOut = amount1 + _getAmountOut(amount0, uint256(reserve0), uint256(reserve1));
        }
    }

    function _included(address[] memory tokens, address token) internal pure returns (bool) {
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == token) return true;
        }
        return false;
    }
 */
}
