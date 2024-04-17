import { useState, useEffect } from "react";
import axios from "axios";

const FollowButton = ({ userId, followUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await fetch("/api/userRoutes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, followUserId }),
        });
        const data = await response.json();
        if (data.success) {
          setIsFollowing(data.isFollowing);
        } else {
          console.error("Failed to fetch follow status");
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setLoading(false);
    };

    fetchFollowStatus();
  }, [userId, followUserId]);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      let endpoint = isFollowing ? "/api/unfollow" : "/api/follow";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, followUserId }),
      });
      const data = await response.json();
      if (data.success) {
        setIsFollowing(!isFollowing);
      } else {
        console.error("Failed to follow/unfollow user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <button onClick={handleFollowToggle} disabled={loading}>
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
