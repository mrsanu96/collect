import React, { useState, useEffect } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineHttp, MdOutlineContentCopy } from "react-icons/md";
import {
  TiSocialFacebook,
  TiSocialTwitter,
  TiSocialInstagram,
} from "react-icons/ti";
import Style from "./Form.module.css";
import { Button } from "../../components/componentsindex.js";
import axios from "axios";

const Form = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/updateUserData", formData);
      console.log(response.data); // Assuming the response contains any feedback from the server
      // Reset form after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className={Style.Form}>
      <div className={Style.Form_box}>
        {isWalletConnected ? (
          <form onSubmit={handleUpdate}>
            {/* Form inputs */}
            {/* Username */}
            <div className={Style.Form_box_input}>
              <label htmlFor="username">Username</label>
              <input
                value={formData.username}
                type="text"
                name="username"
                onChange={handleChange}
                placeholder="Enter Username"
                className={Style.Form_box_input_userName}
              />
            </div>
            {/* Email */}
            <div className={Style.Form_box_input}>
              <label htmlFor="email">Email</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <HiOutlineMail />
                </div>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email*"
                />
              </div>
            </div>
            {/* Description */}
            <div className={Style.Form_box_input}>
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                cols="30"
                rows="6"
                placeholder="Something about yourself in few words"
              />
            </div>
            {/* Website */}
            <div className={Style.Form_box_input}>
              <label htmlFor="website">Website</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <MdOutlineHttp />
                </div>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Website"
                />
              </div>
            </div>
            {/* Social Media */}
            <div className={Style.Form_box_input_social}>
              {/* Facebook */}
              <div className={Style.Form_box_input}>
                <label htmlFor="facebook">Facebook</label>
                <div className={Style.Form_box_input_box}>
                  <div className={Style.Form_box_input_box_icon}>
                    <TiSocialFacebook />
                  </div>
                  <input
                    type="text"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="http://facebook.com/yourprofile"
                  />
                </div>
              </div>
              {/* Twitter */}
              <div className={Style.Form_box_input}>
                <label htmlFor="twitter">Twitter</label>
                <div className={Style.Form_box_input_box}>
                  <div className={Style.Form_box_input_box_icon}>
                    <TiSocialTwitter />
                  </div>
                  <input
                    type="text"
                    name="twitter"
                    onChange={handleChange}
                    value={formData.twitter}
                    placeholder="http://twitter.com/yourprofile"
                  />
                </div>
              </div>
              {/* Instagram */}
              <div className={Style.Form_box_input}>
                <label htmlFor="instagram">Instagram</label>
                <div className={Style.Form_box_input_box}>
                  <div className={Style.Form_box_input_box_icon}>
                    <TiSocialInstagram />
                  </div>
                  <input
                    type="text"
                    name="instagram"
                    onChange={handleChange}
                    value={formData.instagram}
                    placeholder="http://instagram.com/yourprofile"
                  />
                </div>
              </div>
            </div>
            {/* Wallet Address */}
            <div className={Style.Form_box_input}>
              <label htmlFor="walletAddress">Wallet Address</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <MdOutlineHttp />
                </div>
                <input
                  type="text"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleChange}
                  placeholder="0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8"
                  disabled // Prevent editing of wallet address
                />
                <div className={Style.Form_box_input_box_icon}>
                  <MdOutlineContentCopy />
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className={Style.Form_box_btn}>
              <Button
                btnName="Upload Profile"
                handleClick={handleUpdate}
                classStyle={Style.button}
              />
            </div>
          </form>
        ) : (
          <div>
            <p>Please connect your wallet to proceed.</p>
            {/* Add logic to connect wallet here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
