// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "./Unwindooor.sol";
import "./interfaces/IUniV2Factory.sol";

/// @notice Contract for selling received tokens into weth.
contract WethMaker is Unwindooor {

    address public immutable weth;
    IUniV2Factory public immutable factory;

    mapping(address => address) public bridges;

    constructor(address _owner, address _user, address _factory, address _weth) Unwindooor(_owner, _user) {
        factory = IUniV2Factory(_factory);
        weth = _weth;
    }

    function setAllowedBridge(address token, address bridge) external onlyOwner {
        bridges[token] = bridge;
    }

    /// @dev we buy Weth or a bridge token (which will be sold for eth the next time).
    function buyWeth(
        address[] calldata tokens,
        uint256[] calldata amountsIn,
        bool[] calldata useBridge,
        uint256[] calldata minimumOuts
    ) external onlyTrusted {
        for (uint256 i = 0; i < tokens.length; i++) {

            address tokenIn = tokens[i];
            address outToken = useBridge[i] ? bridges[tokenIn] : weth;  

            if (_swap(tokenIn, outToken, amountsIn[i], address(this)) < minimumOuts[i]) revert SlippageProtection();
            
        }
    }

    function _swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        address to
    ) internal returns (uint256 outAmount) {
        
        IUniV2 pair = IUniV2(factory.pairFor(tokenIn, tokenOut));
        
        IERC20(tokenIn).transfer(address(pair), amountIn);

        (uint256 reserve0, uint256 reserve1, ) = pair.getReserves();

        if (tokenIn < tokenOut) {
    
            outAmount = _getAmountOut(amountIn, reserve0, reserve1);
            pair.swap(outAmount, 0, to, "");

        } else {

            outAmount = _getAmountOut(amountIn, reserve0, reserve1);
            pair.swap(0, outAmount, to, "");

        }

    }

    function doAction(address to, bytes memory data) payable onlyOwner external {
        (bool success, ) = to.call{value: msg.value}(data);
        require(success);
    }

}
