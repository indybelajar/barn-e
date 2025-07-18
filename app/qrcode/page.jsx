"use client";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import Qrcode from "../../assets/qrcode.png";

export default function QrCodePage() {
    return (
        <>
            <Navbar />
            <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
                <Image src={Qrcode} alt="QR Code" width={1200} height={600} />
            </div>
        </>
    );
}
