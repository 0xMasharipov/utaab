// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title UtaabCertificate
 * @notice Soulbound ERC-721 certificates issued by UTAAB on Base.
 *
 * Issuance model: the UTAAB issuer wallet signs an EIP-712 `Voucher` off-chain;
 * the certificate holder calls `claim(voucher, signature)` from their own wallet
 * (they pay gas). Tokens are non-transferable (soulbound). Admin may revoke.
 *
 * Verification: `getCertificate(serialHash)` is the canonical read-only view,
 * mirrored by `verifyCertificate(serialHash)` for backward compatibility with
 * the existing UTAAB verifier UI.
 */
contract UtaabCertificate is ERC721, AccessControl, EIP712 {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    bytes32 private constant VOUCHER_TYPEHASH = keccak256(
        "Voucher(bytes32 serialHash,bytes32 eventHash,bytes32 issuedByHash,address holder,uint64 issuedAt,string tokenURI)"
    );

    struct Voucher {
        bytes32 serialHash;
        bytes32 eventHash;
        bytes32 issuedByHash;
        address holder;
        uint64 issuedAt;
        string tokenURI;
    }

    struct Certificate {
        bytes32 eventHash;
        bytes32 issuedByHash;
        address holder;
        uint64 issuedAt;
        uint64 revokedAt;
        bool issued;
        bool revoked;
    }

    /// @dev serialHash => Certificate
    mapping(bytes32 => Certificate) private _certs;
    /// @dev tokenId => tokenURI
    mapping(uint256 => string) private _tokenURIs;

    event CertificateIssued(
        bytes32 indexed serialHash,
        uint256 indexed tokenId,
        address indexed holder,
        bytes32 eventHash,
        bytes32 issuedByHash,
        uint64 issuedAt
    );
    event CertificateRevoked(bytes32 indexed serialHash, uint64 revokedAt, string reason);

    error AlreadyIssued();
    error InvalidSignature();
    error NotIssuer();
    error SoulboundTransferDisabled();
    error UnknownCertificate();

    constructor(address admin, address issuer)
        ERC721("UTAAB Certificate", "UTAAB-CERT")
        EIP712("UTAAB-Certificate", "1")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, issuer);
    }

    // ------------------------------------------------------------------ //
    // Claim (student pays gas, voucher signed by ISSUER_ROLE)            //
    // ------------------------------------------------------------------ //

    function claim(Voucher calldata v, bytes calldata signature) external {
        if (_certs[v.serialHash].issued) revert AlreadyIssued();

        bytes32 structHash = keccak256(
            abi.encode(
                VOUCHER_TYPEHASH,
                v.serialHash,
                v.eventHash,
                v.issuedByHash,
                v.holder,
                v.issuedAt,
                keccak256(bytes(v.tokenURI))
            )
        );
        address signer = ECDSA.recover(_hashTypedDataV4(structHash), signature);
        if (!hasRole(ISSUER_ROLE, signer)) revert InvalidSignature();

        _certs[v.serialHash] = Certificate({
            eventHash: v.eventHash,
            issuedByHash: v.issuedByHash,
            holder: v.holder,
            issuedAt: v.issuedAt,
            revokedAt: 0,
            issued: true,
            revoked: false
        });

        uint256 tokenId = uint256(v.serialHash);
        _tokenURIs[tokenId] = v.tokenURI;
        _safeMint(v.holder, tokenId);

        emit CertificateIssued(v.serialHash, tokenId, v.holder, v.eventHash, v.issuedByHash, v.issuedAt);
    }

    function revoke(bytes32 serialHash, string calldata reason) external onlyRole(ADMIN_ROLE) {
        Certificate storage c = _certs[serialHash];
        if (!c.issued) revert UnknownCertificate();
        c.revoked = true;
        c.revokedAt = uint64(block.timestamp);
        emit CertificateRevoked(serialHash, c.revokedAt, reason);
    }

    // ------------------------------------------------------------------ //
    // Views                                                              //
    // ------------------------------------------------------------------ //

    function getCertificate(bytes32 serialHash) external view returns (Certificate memory) {
        return _certs[serialHash];
    }

    /// @dev Backward-compatible verifier shape used by the existing UI.
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
        Certificate memory c = _certs[serialHash];
        return (
            c.issued && !c.revoked,
            c.issued,
            c.revoked,
            c.eventHash,
            c.issuedByHash,
            c.issuedAt,
            c.revokedAt
        );
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }

    // ------------------------------------------------------------------ //
    // Soulbound: block transfers, allow mint and burn                    //
    // ------------------------------------------------------------------ //

    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert SoulboundTransferDisabled();
        }
        return super._update(to, tokenId, auth);
    }

    function approve(address, uint256) public pure override {
        revert SoulboundTransferDisabled();
    }

    function setApprovalForAll(address, bool) public pure override {
        revert SoulboundTransferDisabled();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
