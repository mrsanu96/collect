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
import Style from "./CreateProfileCard.module.css";
import images from "../../img/index.js";
import { Button, Loader } from "../../components/componentsindex.js";
import FollowButton from "../../components/Follow/Follower.js"
import axios from "axios";

const CreateProfileCard = ({ currentAccount }) => {
  console.log("seller1", currentAccount);
  const [userId, setUserId] = useState();
  const [followUserId, setFollowUserId] = useState();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
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



  
  useEffect(() => {
    const checkWalletConnection = async () => {

      if (currentAccount) {
        const response = await fetch(
          `/api/getUserData?walletAddress=${currentAccount}`
        );

        const response2 = await fetch(
          `/api/getUserData?walletAddress=${window.ethereum.selectedAddress}`
        );
        const userData = await response.json();
        const connectUserData = await response2.json();
        console.log("objectId", userData._id)
        console.log("objectId2", connectUserData._id)

        if (response.ok && response2.ok) {
          setUsername(userData.username);
          setUserId(userData._id)
          setFollowUserId(connectUserData._id)
          setLoading(false);        
        
        }
        
      }
    };
    checkWalletConnection();
  
  }, [currentAccount]);

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
         {loading ? (
        <div><Loader /> </div>
      ) : (
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
            {username}
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
          
        { userId !== followUserId && (<FollowButton userId={userId} followUserId={followUserId} />) }
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
      )}
    </div>
  );
};

export default CreateProfileCard;
