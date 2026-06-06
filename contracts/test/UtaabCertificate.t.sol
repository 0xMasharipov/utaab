// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {UtaabCertificate} from "../src/UtaabCertificate.sol";

contract UtaabCertificateTest is Test {
    UtaabCertificate cert;

    address admin = address(0xA11CE);
    uint256 issuerPk = 0xB0B;
    address issuer;

    address holder = address(0xCAFE);
    address other = address(0xDEAD);

    bytes32 constant SERIAL = keccak256("UTAAB-BB-2026-0001");
    bytes32 constant EVENT_HASH = keccak256("blockchain-basics-2026");
    bytes32 constant ISSUED_BY = keccak256("UTAAB");

    function setUp() public {
        issuer = vm.addr(issuerPk);
        cert = new UtaabCertificate(admin, issuer);
    }

    function _voucher() internal view returns (UtaabCertificate.Voucher memory) {
        return UtaabCertificate.Voucher({
            serialHash: SERIAL,
            eventHash: EVENT_HASH,
            issuedByHash: ISSUED_BY,
            holder: holder,
            issuedAt: uint64(block.timestamp),
            tokenURI: "ipfs://meta.json"
        });
    }

    function _sign(UtaabCertificate.Voucher memory v) internal view returns (bytes memory) {
        bytes32 typeHash = keccak256(
            "Voucher(bytes32 serialHash,bytes32 eventHash,bytes32 issuedByHash,address holder,uint64 issuedAt,string tokenURI)"
        );
        bytes32 structHash = keccak256(
            abi.encode(typeHash, v.serialHash, v.eventHash, v.issuedByHash, v.holder, v.issuedAt, keccak256(bytes(v.tokenURI)))
        );
        bytes32 domainSep = _domainSeparator();
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSep, structHash));
        (uint8 v_, bytes32 r, bytes32 s) = vm.sign(issuerPk, digest);
        return abi.encodePacked(r, s, v_);
    }

    function _domainSeparator() internal view returns (bytes32) {
        return keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("UTAAB-Certificate")),
                keccak256(bytes("1")),
                block.chainid,
                address(cert)
            )
        );
    }

    function test_ClaimMintsSoulboundCertificate() public {
        UtaabCertificate.Voucher memory v = _voucher();
        bytes memory sig = _sign(v);

        vm.prank(holder);
        cert.claim(v, sig);

        assertEq(cert.ownerOf(uint256(SERIAL)), holder);
        (bool valid, bool issued, bool revoked,,,,) = cert.verifyCertificate(SERIAL);
        assertTrue(valid);
        assertTrue(issued);
        assertFalse(revoked);
    }

    function test_ClaimRevertsOnDoubleClaim() public {
        UtaabCertificate.Voucher memory v = _voucher();
        bytes memory sig = _sign(v);
        vm.prank(holder);
        cert.claim(v, sig);

        vm.expectRevert(UtaabCertificate.AlreadyIssued.selector);
        vm.prank(holder);
        cert.claim(v, sig);
    }

    function test_ClaimRevertsOnBadSigner() public {
        UtaabCertificate.Voucher memory v = _voucher();
        // Sign with a non-issuer key.
        bytes32 typeHash = keccak256(
            "Voucher(bytes32 serialHash,bytes32 eventHash,bytes32 issuedByHash,address holder,uint64 issuedAt,string tokenURI)"
        );
        bytes32 structHash = keccak256(
            abi.encode(typeHash, v.serialHash, v.eventHash, v.issuedByHash, v.holder, v.issuedAt, keccak256(bytes(v.tokenURI)))
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", _domainSeparator(), structHash));
        (uint8 v_, bytes32 r, bytes32 s) = vm.sign(0xBADBAD, digest);
        bytes memory sig = abi.encodePacked(r, s, v_);

        vm.expectRevert(UtaabCertificate.InvalidSignature.selector);
        vm.prank(holder);
        cert.claim(v, sig);
    }

    function test_TransferReverts() public {
        UtaabCertificate.Voucher memory v = _voucher();
        cert.claim(v, _sign(v));

        vm.expectRevert(UtaabCertificate.SoulboundTransferDisabled.selector);
        vm.prank(holder);
        cert.transferFrom(holder, other, uint256(SERIAL));
    }

    function test_AdminCanRevoke() public {
        UtaabCertificate.Voucher memory v = _voucher();
        cert.claim(v, _sign(v));

        vm.prank(admin);
        cert.revoke(SERIAL, "test");

        (bool valid,, bool revoked,,,,) = cert.verifyCertificate(SERIAL);
        assertFalse(valid);
        assertTrue(revoked);
    }

    function test_NonAdminCannotRevoke() public {
        UtaabCertificate.Voucher memory v = _voucher();
        cert.claim(v, _sign(v));

        vm.expectRevert();
        vm.prank(other);
        cert.revoke(SERIAL, "nope");
    }
}
