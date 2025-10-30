// utils/api.js or inside a React component
export const getNearbyCooks = async (lat, lon, radius = 10000) => {
  console.log("called");
  
  try {
    const response = await fetch("http://localhost:3000api/nearByCook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat, lon, radius }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);
    
    return data.result; // array of nearby cooks
  } catch (error) {
    console.error("Error fetching nearby cooks:", error);
    return [];
  }
};
