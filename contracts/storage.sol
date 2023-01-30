// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {
  uint256 number;

  constructor(uint256 num_) {
    number = num_;
  }

  function retrieve() public view returns (uint256){
      return number;
  }
}
