import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MdVerified,
  MdCloudUpload,
  MdOutlineReportProblem,
} from "react-icons/md";
import { FiCopy } from "react-icons/fi";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialYoutube,
  TiSocialInstagram,
} from "react-icons/ti";
import { BsThreeDots } from "react-icons/bs";

//INTERNAL IMPORT
import Style from "./AuthorProfileCard.module.css";
import images from "../../img";
import { Button } from "../../components/componentsindex.js";
import axios from "axios";

const AuthorProfileCard = ({ currentAccount }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    description: "",
    website: "",
    facebook: "",
    twitter: "",
    instagram: "",
    walletAddress: "",
  });

  const [share, setShare] = useState(false);
  const [report, setReport] = useState(false);

  //copyAddress function
  const copyAddress = () => {
    const copyText = document.getElementById("myInput");

    copyText.select();
    navigator.clipboard.writeText(copyText.value);
  };

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        setIsWalletConnected(true);
        setFormData((prevState) => ({
          ...prevState,
          walletAddress: window.ethereum.selectedAddress,
        }));

        // Fetch user details from MongoDB
        const response = await fetch(
          `/api/getUserData?walletAddress=${window.ethereum.selectedAddress}`
        );
        const userData = await response.json();

        if (response.ok) {
          setFormData({
            ...formData,
            username: userData.username || "",
            email: userData.email || "",
            description: userData.description || "",
            website: userData.website || "",
            facebook: userData.facebook || "",
            twitter: userData.twitter || "",
            instagram: userData.instagram || "",
            walletAddress: userData.walletAddress || "",
          });
        } else {
          console.error("Failed to fetch user data:", userData.error);
        }
      } else {
        setIsWalletConnected(false);
      }
    };
    checkWalletConnection();

    // Listen for changes in wallet connection
    window.ethereum.on("accountsChanged", checkWalletConnection);

    return () => {
      // Cleanup listener
      window.ethereum.removeListener("accountsChanged", checkWalletConnection);
    };
  }, []);

  const openShare = () => {
    if (!share) {
      setShare(true);
      setReport(false);
    } else {
      setShare(false);
    }
  };

  const openReport = () => {
    if (!report) {
      setReport(true);
      setShare(false);
    } else {
      setReport(false);
    }
  };

  return (
    <div className={Style.AuthorProfileCard}>
      <div className={Style.AuthorProfileCard_box}>
        <div className={Style.AuthorProfileCard_box_img}>
          <Image
            src={images.nft_image_1}
            className={Style.AuthorProfileCard_box_img_img}
            alt="NFT IMAGES"
            width={220}
            height={220}
          />
        </div>

        <div className={Style.AuthorProfileCard_box_info}>
          <h2>
            {formData.username}
            {""}{" "}
            <span>
              <MdVerified />
            </span>{" "}
          </h2>

          <div className={Style.AuthorProfileCard_box_info_address}>
            <input type="text" value={currentAccount} id="myInput" />
            <FiCopy
              onClick={() => copyAddress()}
              className={Style.AuthorProfileCard_box_info_address_icon}
            />
          </div>

          <p>{formData.description}</p>

          <div className={Style.AuthorProfileCard_box_info_social}>
            <a href={formData.facebook}>
              <TiSocialFacebook />
            </a>
            <a href="#">
              <TiSocialInstagram />
            </a>
            <a href="#">
              <TiSocialLinkedin />
            </a>
            <a href="#">
              <TiSocialYoutube />
            </a>
          </div>
        </div>

        <div className={Style.AuthorProfileCard_box_share}>
          <Button btnName="Follow" handleClick={() => {}} />
          <MdCloudUpload
            onClick={() => openShare()}
            className={Style.AuthorProfileCard_box_share_icon}
          />

          {share && (
            <div className={Style.AuthorProfileCard_box_share_upload}>
              <p>
                <span>
                  <TiSocialFacebook />
                </span>{" "}
                {""}
                Facebook
              </p>
              <p>
                <span>
                  <TiSocialInstagram />
                </span>{" "}
                {""}
                Instragram
              </p>
              <p>
                <span>
                  <TiSocialLinkedin />
                </span>{" "}
                {""}
                LinkedIn
              </p>
              <p>
                <span>
                  <TiSocialYoutube />
                </span>{" "}
                {""}
                YouTube
              </p>
            </div>
          )}

          <BsThreeDots
            onClick={() => openReport()}
            className={Style.AuthorProfileCard_box_share_icon}
          />

          {report && (
            <p className={Style.AuthorProfileCard_box_share_report}>
              <span>
                <MdOutlineReportProblem />
              </span>{" "}
              {""}
              Report abouse
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfileCard;
