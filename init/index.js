const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = "pk.eyJ1IjoiZDM4dW0xcyIsImEiOiJjbWJjbHZ3c3YxbXFpMmxzMXB1c3AyeDhiIn0.a4vI5oY6g2NHJnBclAVSkA";
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj, owner: "68384fdf6ede52d553b777d7"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB().then(()=>{
    console.log("Data Inserted successfully");
}).catch((err)=>{
    console.log("Error inserting data");
    console.log(err);
});