// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract UTAABCertificateRegistry is Ownable {
    struct Certificate {
        bool issued;
        bool revoked;
        bytes32 eventHash;
        bytes32 issuedByHash;
        uint64 issuedAt;
        uint64 revokedAt;
    }

    mapping(bytes32 => Certificate) private certificates;

    event CertificateIssued(
        bytes32 indexed serialHash,
        bytes32 indexed eventHash,
        bytes32 indexed issuedByHash,
        uint64 issuedAt
    );

    event CertificateRevoked(
        bytes32 indexed serialHash,
        uint64 revokedAt
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    function issueCertificate(
        bytes32 serialHash,
        bytes32 eventHash,
        bytes32 issuedByHash
    ) external onlyOwner {
        require(!certificates[serialHash].issued, "Already issued");

        certificates[serialHash] = Certificate({
            issued: true,
            revoked: false,
            eventHash: eventHash,
            issuedByHash: issuedByHash,
            issuedAt: uint64(block.timestamp),
            revokedAt: 0
        });

        emit CertificateIssued(serialHash, eventHash, issuedByHash, uint64(block.timestamp));
    }

    function issueBatchCertificates(
        bytes32[] calldata serialHashes,
        bytes32 eventHash,
        bytes32 issuedByHash
    ) external onlyOwner {
        for (uint256 i = 0; i < serialHashes.length; i++) {
            bytes32 serialHash = serialHashes[i];
            require(!certificates[serialHash].issued, "Already issued");

            certificates[serialHash] = Certificate({
                issued: true,
                revoked: false,
                eventHash: eventHash,
                issuedByHash: issuedByHash,
                issuedAt: uint64(block.timestamp),
                revokedAt: 0
            });

            emit CertificateIssued(serialHash, eventHash, issuedByHash, uint64(block.timestamp));
        }
    }

    function revokeCertificate(bytes32 serialHash) external onlyOwner {
        require(certificates[serialHash].issued, "Not issued");
        require(!certificates[serialHash].revoked, "Already revoked");

        certificates[serialHash].revoked = true;
        certificates[serialHash].revokedAt = uint64(block.timestamp);

        emit CertificateRevoked(serialHash, uint64(block.timestamp));
    }

    function verifyCertificate(bytes32 serialHash)
        external
        view
        returns (
            bool valid,
            bool issued,
            bool revoked,
            bytes32 eventHash,
            bytes32 issuedByHash,
            uint64 issuedAt,
            uint64 revokedAt
        )
    {
        Certificate memory cert = certificates[serialHash];
        issued = cert.issued;
        revoked = cert.revoked;
        valid = cert.issued && !cert.revoked;
        eventHash = cert.eventHash;
        issuedByHash = cert.issuedByHash;
        issuedAt = cert.issuedAt;
        revokedAt = cert.revokedAt;
    }

    function hashText(string memory value) external pure returns (bytes32) {
        return keccak256(bytes(value));
    }
}
