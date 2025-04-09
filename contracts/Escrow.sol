// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract Escrow {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    struct Listing {
        address user;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => Listing) public listings;

    // Parties
    mapping(uint256 => address) public buyer;
    mapping(uint256 => address) public seller;
    mapping(uint256 => address) public inspector;

    // Status
    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;

    // Deposit full ETH amount (allows any buyer except admin)
    function depositEarnest(uint256 _nftId) public payable {
        require(msg.sender != owner, "Admin cannot buy property");
        require(msg.value > 0, "ETH required");
        require(listings[_nftId].amount == 0, "Already deposited");

        buyer[_nftId] = msg.sender; // dynamically set buyer

        listings[_nftId] = Listing({
            user: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        });
    }

    // Set roles 
    function listProperty(
        uint256 _nftId,
        address _seller,
        address _inspector
    ) public {
        require(msg.sender == owner, "Only owner can list property");
        seller[_nftId] = _seller;
        inspector[_nftId] = _inspector;
    }

    // Inspector updates status AND finalizes sale
    function updateInspectionStatus(uint256 _nftId, bool _passed) public {
        require(msg.sender == inspector[_nftId], "Not inspector");
        inspectionPassed[_nftId] = _passed;

        if (_passed) {
            approval[_nftId][buyer[_nftId]] = true;
            approval[_nftId][seller[_nftId]] = true;

            uint256 amount = listings[_nftId].amount;
            listings[_nftId].amount = 0;
            payable(seller[_nftId]).transfer(amount);
        }
    }

    // Manual approval 
    function approveSale(uint256 _nftId) public {
        approval[_nftId][msg.sender] = true;
    }

    // Manual finalize 
    function finalizeSale(uint256 _nftId) public {
        require(inspectionPassed[_nftId], "Inspection not passed");
        require(approval[_nftId][buyer[_nftId]], "Buyer not approved");
        require(approval[_nftId][seller[_nftId]], "Seller not approved");

        uint256 amount = listings[_nftId].amount;
        listings[_nftId].amount = 0;
        payable(seller[_nftId]).transfer(amount);
    }

    // Owner-only fallback withdraw
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
