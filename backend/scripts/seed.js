import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import Ride from "../models/Ride.js";
import Parcel from "../models/Parcel.js";

dotenv.config();

// ===============================
// Mongo Connect
// ===============================
await mongoose.connect(process.env.MONGO_URI);

console.log("✅ MongoDB Connected");

// ===============================
// Common Password Hash
// Password = abc123
// ===============================
const HASHED_PASSWORD =
  "$2b$10$T4Xl3CuZn4qQ4COIJJk3Sutfe3VexNXHWb6ySSupDS1kJ1iDxRPrC";

// ===============================
// Route Locations
// ===============================
const LOCATIONS = {
  Delhi: {
    name: "Delhi",
    coordinates: { lat: 28.6139, lng: 77.2090 },
  },

  Noida: {
    name: "Noida",
    coordinates: { lat: 28.5355, lng: 77.3910 },
  },

  "Greater Noida": {
    name: "Greater Noida",
    coordinates: { lat: 28.4744, lng: 77.5040 },
  },

  Mathura: {
    name: "Mathura",
    coordinates: { lat: 27.4924, lng: 77.6737 },
  },

  Farah: {
    name: "Farah",
    coordinates: { lat: 27.3200, lng: 77.7600 },
  },

  Agra: {
    name: "Agra",
    coordinates: { lat: 27.1767, lng: 78.0081 },
  },
};

// ===============================
// Users
// ===============================
const usersData = [
  {
    name: "Aman Yadav",
    email: "aman.yadav@gmail.com",
    phone: "9876543210",
    rating: 4.8,
  },
  {
    name: "Rohit Sharma",
    email: "rohit.sharma98@gmail.com",
    phone: "9876543211",
    rating: 4.5,
  },
  {
    name: "Priya Verma",
    email: "priya.verma@gmail.com",
    phone: "9876543212",
    rating: 4.9,
  },
  {
    name: "Neha Singh",
    email: "neha.singh21@gmail.com",
    phone: "9876543213",
    rating: 4.7,
  },
  {
    name: "Vikas Kumar",
    email: "vikas.kumar@gmail.com",
    phone: "9876543214",
    rating: 4.2,
  },
  {
    name: "Pooja Yadav",
    email: "pooja.yadav@gmail.com",
    phone: "9876543215",
    rating: 4.6,
  },
  {
    name: "Rahul Tomar",
    email: "rahul.tomar@gmail.com",
    phone: "9876543216",
    rating: 4.4,
  },
  {
    name: "Deepak Jaat",
    email: "deepak.jaat@gmail.com",
    phone: "9876543217",
    rating: 4.3,
  },
  {
    name: "Sakshi Gupta",
    email: "sakshi.gupta@gmail.com",
    phone: "9876543218",
    rating: 4.9,
  },
  {
    name: "Ankit Chauhan",
    email: "ankit.chauhan@gmail.com",
    phone: "9876543219",
    rating: 4.1,
  },
];

// ===============================
// Preferences Variations
// ===============================
const preferenceVariants = [
  {
    smokingAllowed: false,
    petsAllowed: true,
    womenOnly: false,
    maxInBack: false,
    musicAllowed: true,
    chatPreference: "chatty",
  },

  {
    smokingAllowed: true,
    petsAllowed: false,
    womenOnly: false,
    maxInBack: true,
    musicAllowed: false,
    chatPreference: "quiet",
  },

  {
    smokingAllowed: false,
    petsAllowed: false,
    womenOnly: true,
    maxInBack: false,
    musicAllowed: true,
    chatPreference: "no_preference",
  },

  {
    smokingAllowed: false,
    petsAllowed: true,
    womenOnly: false,
    maxInBack: true,
    musicAllowed: true,
    chatPreference: "chatty",
  },
];

// ===============================
// Main Seeder
// ===============================
const seed = async () => {
  try {
    // ===============================
    // Cleanup
    // ===============================
    await Parcel.deleteMany({});
    await Ride.deleteMany({});
    await User.deleteMany({});

    console.log("🗑 Existing data cleared");

    // ===============================
    // Create Users
    // ===============================
    const createdUsers = await User.insertMany(
      usersData.map((u) => ({
        ...u,
        password: HASHED_PASSWORD,
        role: "user",
        isPhoneVerified: true,
        kycStatus: "verified",

        totalRatings: Math.floor(Math.random() * 50) + 5,

        vehicleInfo: {
          vehicleType: ["SUV", "Sedan", "Hatchback"][
            Math.floor(Math.random() * 3)
          ],
          registrationNo: `UP16${Math.floor(
            1000 + Math.random() * 9000
          )}`,
          photo: null,
        },
      }))
    );

    console.log("✅ Users seeded");

    // ===============================
    // Route Variants
    // ===============================
    const routeVariants = [
      ["Delhi", "Noida", "Greater Noida", "Mathura", "Farah", "Agra"],

      ["Delhi", "Mathura", "Agra"],

      ["Noida", "Greater Noida", "Agra"],

      ["Delhi", "Farah", "Agra"],

      ["Greater Noida", "Mathura", "Agra"],

      ["Noida", "Mathura", "Farah", "Agra"],
    ];

    const rides = [];

    // ===============================
    // Create Rides
    // ===============================
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];

      const route =
        routeVariants[i % routeVariants.length];

      const from = LOCATIONS[route[0]];
      const to = LOCATIONS[route[route.length - 1]];

      const stops = route
        .slice(1, route.length - 1)
        .map((city) => LOCATIONS[city]);

      const acceptsParcels = i % 2 === 0;

      const ride = await Ride.create({
        driver: user._id,

        from,
        to,
        stops,

        date: new Date("2026-05-25"),

        time: `${8 + i}:00`,

        availableSeats: Math.floor(Math.random() * 4) + 1,

        pricePerSeat: 300 + i * 100,

        vehicleDetails: {
          type: user.vehicleInfo.vehicleType,
          model: ["Swift", "Creta", "Baleno", "Nexon"][
            Math.floor(Math.random() * 4)
          ],
          color: ["White", "Black", "Silver"][
            Math.floor(Math.random() * 3)
          ],
          plateNumber: user.vehicleInfo.registrationNo,
        },

        bookingPreference:
          i % 2 === 0 ? "instant" : "review",

        preferences:
          preferenceVariants[
            i % preferenceVariants.length
          ],

        acceptsParcels,

        bootSpace: acceptsParcels
          ? {
              smallPrice: 150,
              mediumPrice: 300,
              largePrice: 500,

              maxWeightKg: 20,

              fragileAccepted: i % 3 === 0,

              pickupFlexibility:
                i % 2 === 0
                  ? "any_stop"
                  : "start_only",

              allowedGoods: [
                "Documents",
                "Clothes",
                "Electronics",
              ],

              bootDescription:
                "Spacious SUV boot available",
            }
          : null,

        stopoverPrices: [],

        status: "active",
      });

      rides.push(ride);
    }

    console.log("✅ Rides seeded");

    // ===============================
    // Create Parcels
    // ===============================
    const parcelRides = rides.filter(
      (r) => r.acceptsParcels
    );

    for (let i = 0; i < parcelRides.length; i++) {
      const ride = parcelRides[i];

      const sender =
        createdUsers[
          (i + 2) % createdUsers.length
        ];

      await Parcel.create({
        sender: sender._id,

        receiverName: [
          "Ramesh Kumar",
          "Suresh Yadav",
          "Kiran Devi",
          "Mohit Sharma",
        ][i % 4],

        receiverPhone: `98989898${i}${i}`,

        ride: ride._id,

        pickupPoint: ride.from,

        dropPoint:
          ride.stops?.length > 0
            ? ride.stops[ride.stops.length - 1]
            : ride.to,

        size: ["small", "medium", "large"][
          i % 3
        ],

        weight: 2 + i,

        description: [
          "Documents",
          "Clothes package",
          "Electronics item",
          "Food parcel",
        ][i % 4],

        isFragile: i % 2 === 0,

        price:
          i % 3 === 0
            ? 150
            : i % 3 === 1
            ? 300
            : 500,

        status: [
          "booked",
          "picked_up",
          "in_transit",
          "delivered",
        ][i % 4],

        timeline: {
          bookedAt: new Date(),
          pickedUpAt:
            i > 0 ? new Date() : null,
          inTransitAt:
            i > 1 ? new Date() : null,
          deliveredAt:
            i > 2 ? new Date() : null,
        },
      });
    }

    console.log("✅ Parcels seeded");

    console.log("🎉 Mock database seeded successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seed();