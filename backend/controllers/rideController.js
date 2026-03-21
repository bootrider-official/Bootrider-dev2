


// import Ride from "../models/Ride.js";
// import User from "../models/User.js";

// // ===============================
// // 📌 Create a Ride
// // ===============================
// // export const createRide = async (req, res) => {
// //   try {
// //     const {
// //       from,
// //       to,
// //       stops,
// //       date,
// //       time,
// //       availableSeats,
// //       pricePerSeat,
// //       vehicleDetails,
// //     } = req.body;

// //     if (!from || !to || !date || !time || !availableSeats || !pricePerSeat) {
// //       return res.status(400).json({
// //         message: "All required fields must be provided.",
// //       });
// //     }

// //     const newRide = await Ride.create({
// //       driver: req.user._id,
// //       from,
// //       to,
// //       stops: stops || [],
// //       date,
// //       time,
// //       availableSeats,
// //       pricePerSeat,
// //       vehicleDetails,
// //       status: "active",
// //     });

// //     res.status(201).json({ message: "Ride created successfully!", ride: newRide });
// //   } catch (error) {
// //     console.error("Error creating ride:", error);
// //     res.status(500).json({ message: "Server error while creating ride." });
// //   }
// // };

// export const createRide = async (req, res) => {
//   try {
//     const {
//       from,
//       to,
//       stops,
//       date,
//       time,
//       availableSeats,
//       pricePerSeat,
//       vehicleDetails,
//       bookingPreference,
//     } = req.body;

//     if (!from || !to || !date || !time || !availableSeats || !pricePerSeat) {
//       return res.status(400).json({ message: "All required fields must be provided." });
//     }

//     const newRide = await Ride.create({
//       driver: req.user._id,
//       from,
//       to,
//       stops: stops || [],
//       date,
//       time,
//       availableSeats,
//       pricePerSeat,
//       vehicleDetails,
//       bookingPreference: bookingPreference || "review",
//       status: "active",
//     });

//     res.status(201).json({ message: "Ride created successfully!", ride: newRide });
//   } catch (error) {
//     console.error("Error creating ride:", error);
//     res.status(500).json({ message: "Server error while creating ride." });
//   }
// };


// // ===============================
// // 🔍 Search Rides (Fixed)
// // ===============================
// export const searchRides = async (req, res) => {
//   try {
//     const { from, to, date } = req.query;

//     if (!from || !to) {
//       return res.status(400).json({
//         message: "Please provide both 'from' and 'to' locations.",
//       });
//     }

//     // ✅ Build the search query dynamically
//     const query = {
//       $and: [
//         {
//           $or: [
//             { "from.name": { $regex: from, $options: "i" } },
//             { "stops.name": { $regex: from, $options: "i" } },
//           ],
//         },
//         {
//           $or: [
//             { "to.name": { $regex: to, $options: "i" } },
//             { "stops.name": { $regex: to, $options: "i" } },
//           ],
//         },
//         { status: "active" },
//         { availableSeats: { $gt: 0 } },
//       ],
//     };

//     if (date) {
//       // ✅ Match only rides on that date (ignore time)
//       const start = new Date(date);
//       start.setHours(0, 0, 0, 0);
//       const end = new Date(date);
//       end.setHours(23, 59, 59, 999);
//       query.$and.push({ date: { $gte: start, $lte: end } });
//     }

//     const rides = await Ride.find(query)
//       .populate("driver", "name email")
//       .sort({ date: 1, time: 1 });

//     if (!rides.length) {
//       return res.status(404).json({ message: "No rides found." });
//     }

//     res.status(200).json(rides);
//   } catch (error) {
//     console.error("❌ Error searching rides:", error);
//     res.status(500).json({ message: "Server error." });
//   }
// };

// // ===============================
// // 🔍 Get Ride by ID
// // ===============================
// // ===============================
// // 🔍 Get Ride by ID
// // ===============================
// export const getRideById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id || id === "undefined") {
//       return res.status(400).json({ message: "Invalid ride ID." });
//     }

//     const ride = await Ride.findById(id)
//       .populate("driver", "name email phone photo isVerified")
//       .populate("requests.user", "name email")
//       .populate("passengers.user", "name email");

//     if (!ride) return res.status(404).json({ message: "Ride not founhhhhd" });

//     res.status(200).json(ride);
//   } catch (error) {
//     console.error("Error fetching ride details:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // // ===============================
// // // 🚗 Passenger requests a ride
// // // ===============================
// // export const requestRide = async (req, res) => {
// //   try {
// //     const { rideId, seatsRequested } = req.body;
// //     const userId = req.user._id;

// //     const ride = await Ride.findById(rideId);
// //     if (!ride) return res.status(404).json({ message: "Ride not found" });

// //     // Prevent duplicate request
// //     const existingRequest = ride.requests.find(
// //       (r) => r.user.toString() === userId.toString()
// //     );
// //     if (existingRequest)
// //       return res.status(400).json({ message: "You already requested this ride." });

// //     ride.requests.push({
// //       user: userId,
// //       seatsRequested,
// //       status: "pending",
// //     });

// //     await ride.save();

// //     res.status(200).json({ message: "Ride request sent to driver!" });
// //   } catch (err) {
// //     console.error("Error requesting ride:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };
// // ===============================
// // 🚗 Passenger requests a ride (Hybrid Safe Version)
// // ===============================
// export const requestRide = async (req, res) => {
//   try {
//     const { rideId, seatsRequested } = req.body;
//     const userId = req.user._id;

//     if (!rideId || !seatsRequested)
//       return res.status(400).json({ message: "Missing rideId or seatsRequested." });

//     const ride = await Ride.findById(rideId);
//     if (!ride) return res.status(404).json({ message: "Ride not found" });

//     // Check existing request
//     const existingRequest = ride.requests.find(
//       (r) => r.user.toString() === userId.toString()
//     );

//     if (existingRequest) {
//       if (existingRequest.status === "pending") {
//         return res.status(400).json({ message: "Request already pending approval." });
//       } else if (existingRequest.status === "approved") {
//         return res.status(400).json({ message: "You are already approved for this ride." });
//       } else if (existingRequest.status === "rejected") {
//         // ✅ Allow rebooking: reset status to pending
//         existingRequest.status = "pending";
//         existingRequest.seatsRequested = seatsRequested;
//         await ride.save();
//         return res.status(200).json({ message: "Rebooking request sent again!" });
//       }
//     }

//     // No previous request → create new one
//     ride.requests.push({
//       user: userId,
//       seatsRequested,
//       status: "pending",
//     });

//     await ride.save();
//     res.status(200).json({ message: "Ride request sent to driver!" });
//   } catch (err) {
//     console.error("❌ Error in requestRide:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // ===============================
// // ✅ Approve or ❌ Reject Ride Request
// // ===============================
// // ===============================
// // ✅ Approve or ❌ Reject Ride Request
// // ===============================
// export const handleRideRequest = async (req, res) => {
//   try {
//     console.log("📩 Incoming handle request call");
//     console.log("🔹 Body:", req.body);
//     console.log("🔹 User:", req.user?._id);

//     const { rideId, requestId, action } = req.body; // action = "approve" | "reject"
//     const driverId = req.user._id;

//     console.log(`➡️ Action: ${action}, Ride: ${rideId}, Request: ${requestId}`);

//     const ride = await Ride.findById(rideId);
//     if (!ride) return res.status(404).json({ message: "Ride not found" });
//     if (String(ride.driver._id || ride.driver.id || ride.driver) !== String(driverId)) {
//   return res.status(403).json({ message: "Not authorized" });
// }


//     // const request = ride.requests.id(requestId);
//     // if (!request) return res.status(404).json({ message: "Request not found" });

//     let request = ride.requests.id(requestId);
// if (!request) {
//   request = ride.requests.find(
//     (r) => String(r._id) === String(requestId) || String(r.id) === String(requestId)
//   );
// }
// if (!request) return res.status(404).json({ message: "Request not found" });


//     if (request.status !== "pending")
//       return res.status(400).json({ message: "Request already handled" });

//     if (action === "approve") {
//       if (ride.availableSeats < request.seatsRequested)
//         return res.status(400).json({ message: "Not enough available seats" });

//       request.status = "approved";
//       ride.availableSeats -= request.seatsRequested;
//       ride.passengers.push({
//         user: request.user,
//         seatsBooked: request.seatsRequested,
//       });
//     } else if (action === "reject") {
//       request.status = "rejected";
//     } else {
//       return res.status(400).json({ message: "Invalid action" });
//     }

//     await ride.save();
//     console.log("✅ Ride updated successfully");
//     res.status(200).json({ message: `Request ${action}ed successfully`, ride });
//   } catch (err) {
//     console.error("❌ Error handling ride request:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// // ===============================
// // 🧾 Get All Rides Created by Logged-in Driver
// // ===============================
// export const getMyRides = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const rides = await Ride.find({ driver: userId })
//       .populate("driver", "name email phone")
//       .populate("requests.user", "name email")
//       .populate("passengers.user", "name email")
//       .sort({ date: -1 });

//     if (!rides || rides.length === 0) {
//       return res.status(404).json({ message: "No rides found for this user." });
//     }

//     res.status(200).json(rides);
//   } catch (error) {
//     console.error("Error fetching user rides:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ===============================
// // 🚘 Direct Booking (Optional)
// // ===============================
// export const bookRide = async (req, res) => {
//   try {
//     const { rideId, seatsBooked } = req.body;

//     if (!rideId || !seatsBooked) {
//       return res.status(400).json({ message: "Ride ID and seat count are required." });
//     }

//     const ride = await Ride.findById(rideId);
//     if (!ride) {
//       return res.status(404).json({ message: "Ride not found." });
//     }

//     if (ride.availableSeats < seatsBooked) {
//       return res.status(400).json({ message: "Not enough available seats." });
//     }

//     ride.passengers.push({
//       user: req.user._id,
//       seatsBooked,
//     });

//     ride.availableSeats -= seatsBooked;

//     if (ride.availableSeats === 0) {
//       ride.status = "completed";
//     }

//     await ride.save();
//     res.status(200).json({ message: "Ride booked successfully", ride });
//   } catch (error) {
//     console.error("Error booking ride:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ===============================
// // ❌ Delete a Ride (Driver Only)
// // ===============================
// export const deleteRide = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) return res.status(400).json({ message: "Ride ID missing." });

//     const ride = await Ride.findById(id);
//     if (!ride) return res.status(404).json({ message: "Ride not found." });

//     if (ride.driver.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Unauthorized to delete this ride." });
//     }

//     await ride.deleteOne();
//     res.status(200).json({ message: "Ride deleted successfully." });
//   } catch (error) {
//     console.error("Error deleting ride:", error);
//     res.status(500).json({ message: "Server error." });
//   }
// };

// export const getMyBookings = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // 🧩 Find rides where this user has made a request
//     const rides = await Ride.find({ "requests.user": userId })
//       .populate("driver", "name email phone") // 👈 populate driver info
//       .populate("requests.user", "name email")
//       .sort({ date: -1 });

//     // ✅ Filter each ride to only keep the request belonging to this user
//     const myBookings = rides.map((ride) => {
//       const myRequest = ride.requests.find(
//         (r) => String(r.user._id || r.user) === String(userId)
//       );

//       return {
//         id: ride._id,
//         from: ride.from,
//         to: ride.to,
//         date: ride.date,
//         time: ride.time,
//         pricePerSeat: ride.pricePerSeat,
//         driver: ride.driver,
//         status: myRequest.status,
//         seatsRequested: myRequest.seatsRequested,
//       };
//     });

//     res.json(myBookings);
//   } catch (err) {
//     console.error("❌ Error fetching my bookings:", err);
//     res.status(500).json({ message: "Failed to fetch bookings" });
//   }
// };




import Ride from "../models/Ride.js";

// ── Haversine distance in km ─────────────────────────────────────────────────
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── Check if a query point is within radiusKm of a set of points ─────────────
const isWithinRadius = (queryLat, queryLng, points, radiusKm = 15) =>
  points.some(
    (p) =>
      p?.coordinates?.lat &&
      p?.coordinates?.lng &&
      haversineKm(queryLat, queryLng, p.coordinates.lat, p.coordinates.lng) <=
      radiusKm
  );

// ===============================
// 📌 Create Ride
// ===============================
export const createRide = async (req, res) => {
  try {
    const {
      from,
      to,
      stops,
      date,
      time,
      availableSeats,
      pricePerSeat,
      vehicleDetails,
      bookingPreference,
      acceptsParcels,
      bootSpace,
    } = req.body;

    if (!from || !to || !date || !time || !availableSeats || !pricePerSeat) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const newRide = await Ride.create({
      driver: req.user._id,
      from,
      to,
      stops: stops || [],
      date,
      time,
      availableSeats,
      pricePerSeat,
      vehicleDetails: vehicleDetails || {},
      bookingPreference: bookingPreference || "review",
      acceptsParcels: acceptsParcels || false,
      bootSpace: acceptsParcels && bootSpace ? bootSpace : null,
      status: "active",
    });

    res
      .status(201)
      .json({ message: "Ride created successfully!", ride: newRide });
  } catch (error) {
    console.error("❌ Error creating ride:", error.message);
    res.status(500).json({ message: "Server error while creating ride." });
  }
};

// ===============================
// 🔍 Search Rides (radius-based)
// ===============================
export const searchRides = async (req, res) => {
  try {
    const {
      from,
      to,
      fromLat,
      fromLng,
      toLat,
      toLng,
      date,
      radiusKm = 15,
    } = req.query;

    if (!from || !to) {
      return res
        .status(400)
        .json({ message: "Please provide both 'from' and 'to' locations." });
    }

    // ── Date filter ──────────────────────────────
    let dateFilter = {};
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      dateFilter = { date: { $gte: start, $lte: end } };
    }

    const useRadius =
      fromLat && fromLng && toLat && toLng;
    const radius = parseFloat(radiusKm);

    let rides = [];

    if (useRadius) {
      // ── Radius-based search ──────────────────────
      const fLat = parseFloat(fromLat);
      const fLng = parseFloat(fromLng);
      const tLat = parseFloat(toLat);
      const tLng = parseFloat(toLng);

      // Pull all active rides with seats then filter in JS
      const allRides = await Ride.find({
        status: "active",
        availableSeats: { $gt: 0 },
        ...dateFilter,
      })
        .populate("driver", "name email phone profilePhoto rating totalRatings kycStatus")
        .sort({ date: 1, time: 1 });

      rides = allRides.filter((ride) => {
        // All points to check for FROM side
        const fromPoints = [ride.from, ...ride.stops];
        // All points to check for TO side
        const toPoints = [ride.to, ...ride.stops];

        const fromMatch = isWithinRadius(fLat, fLng, fromPoints, radius);
        const toMatch = isWithinRadius(tLat, tLng, toPoints, radius);

        return fromMatch && toMatch;
      });
    } else {
      // ── Fallback: name-based regex search ────────
      rides = await Ride.find({
        $and: [
          {
            $or: [
              { "from.name": { $regex: from, $options: "i" } },
              { "stops.name": { $regex: from, $options: "i" } },
            ],
          },
          {
            $or: [
              { "to.name": { $regex: to, $options: "i" } },
              { "stops.name": { $regex: to, $options: "i" } },
            ],
          },
          { status: "active" },
          { availableSeats: { $gt: 0 } },
          dateFilter,
        ].filter((f) => Object.keys(f).length > 0),
      })
        .populate("driver", "name email phone profilePhoto rating totalRatings kycStatus")
        .sort({ date: 1, time: 1 });
    }

    if (!rides.length) {
      return res.status(404).json({ message: "No rides found." });
    }

    res.status(200).json(rides);
  } catch (error) {
    console.error("❌ Error searching rides:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// 🔍 Get Ride by ID
// ===============================
export const getRideById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid ride ID." });
    }

    const ride = await Ride.findById(id)
      .populate("driver", "name email phone profilePhoto rating totalRatings kycStatus vehicleInfo")
      .populate("requests.user", "name email profilePhoto")
      .populate("passengers.user", "name email profilePhoto");

    if (!ride) return res.status(404).json({ message: "Ride not found." });

    res.status(200).json(ride);
  } catch (error) {
    console.error("❌ Error fetching ride:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// 🚗 Request a Ride
// ===============================
export const requestRide = async (req, res) => {
  try {
    const { rideId, seatsRequested } = req.body;
    const userId = req.user._id;

    if (!rideId || !seatsRequested) {
      return res
        .status(400)
        .json({ message: "Missing rideId or seatsRequested." });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found." });

    const existingRequest = ride.requests.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res
          .status(400)
          .json({ message: "Request already pending approval." });
      } else if (existingRequest.status === "approved") {
        return res
          .status(400)
          .json({ message: "You are already approved for this ride." });
      } else if (existingRequest.status === "rejected") {
        existingRequest.status = "pending";
        existingRequest.seatsRequested = seatsRequested;
        await ride.save();
        return res
          .status(200)
          .json({ message: "Request re-sent to driver!" });
      }
    }

    ride.requests.push({ user: userId, seatsRequested, status: "pending" });
    await ride.save();

    res.status(200).json({ message: "Ride request sent to driver!" });
  } catch (err) {
    console.error("❌ Error in requestRide:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// ✅ Approve / ❌ Reject Request
// ===============================
export const handleRideRequest = async (req, res) => {
  try {
    const { rideId, requestId, action } = req.body;
    const driverId = req.user._id;

    if (!rideId || !requestId || !action) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found." });

    if (String(ride.driver) !== String(driverId)) {
      return res.status(403).json({ message: "Not authorized." });
    }

    let request = ride.requests.id(requestId);
    if (!request) {
      request = ride.requests.find(
        (r) =>
          String(r._id) === String(requestId) ||
          String(r.id) === String(requestId)
      );
    }
    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already handled." });
    }

    if (action === "approve") {
      if (ride.availableSeats < request.seatsRequested) {
        return res
          .status(400)
          .json({ message: "Not enough available seats." });
      }
      request.status = "approved";
      ride.availableSeats -= request.seatsRequested;
      ride.passengers.push({
        user: request.user,
        seatsBooked: request.seatsRequested,
      });
    } else if (action === "reject") {
      request.status = "rejected";
    } else {
      return res.status(400).json({ message: "Invalid action." });
    }

    await ride.save();
    res
      .status(200)
      .json({ message: `Request ${action}ed successfully.`, ride });
  } catch (err) {
    console.error("❌ Error handling request:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// 🧾 Get My Rides (driver)
// ===============================
export const getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id })
      .populate("driver", "name email phone")
      .populate("requests.user", "name email profilePhoto")
      .populate("passengers.user", "name email profilePhoto")
      .sort({ date: -1 });

    res.status(200).json(rides);
  } catch (error) {
    console.error("❌ Error fetching my rides:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// 📦 Get My Bookings (passenger)
// ===============================
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const rides = await Ride.find({ "requests.user": userId })
      .populate("driver", "name email phone profilePhoto rating")
      .populate("requests.user", "name email")
      .sort({ date: -1 });

    const myBookings = rides.map((ride) => {
      const myRequest = ride.requests.find(
        (r) => String(r.user._id || r.user) === String(userId)
      );
      return {
        id: ride._id,
        from: ride.from,
        to: ride.to,
        date: ride.date,
        time: ride.time,
        pricePerSeat: ride.pricePerSeat,
        driver: ride.driver,
        status: myRequest.status,
        seatsRequested: myRequest.seatsRequested,
        acceptsParcels: ride.acceptsParcels,
      };
    });

    res.status(200).json(myBookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err.message);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
};

// ===============================
// ✅ Complete a Ride
// ===============================
export const completeRide = async (req, res) => {
  try {
    const { id } = req.params;

    const ride = await Ride.findById(id);
    if (!ride) return res.status(404).json({ message: "Ride not found." });

    if (String(ride.driver) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized." });
    }

    if (ride.status === "completed") {
      return res.status(400).json({ message: "Ride already completed." });
    }

    ride.status = "completed";
    ride.completedAt = new Date();
    await ride.save();

    res.status(200).json({ message: "Ride marked as completed.", ride });
  } catch (error) {
    console.error("❌ Error completing ride:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// ❌ Delete Ride (soft delete)
// ===============================
export const deleteRide = async (req, res) => {
  try {
    const { id } = req.params;

    const ride = await Ride.findById(id);
    if (!ride) return res.status(404).json({ message: "Ride not found." });

    if (String(ride.driver) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized." });
    }

    // Soft delete — keep in DB for history
    ride.deletedAt = new Date();
    ride.status = "cancelled";
    await ride.save();

    res.status(200).json({ message: "Ride deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting ride:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// ⭐ Rate a User
// ===============================
export const rateUser = async (req, res) => {
  try {
    const { userId, rating } = req.body;

    if (!userId || !rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Valid userId and rating (1-5) required." });
    }

    const User = (await import("../models/User.js")).default;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Recalculate running average
    const newTotal = user.totalRatings + 1;
    const newRating =
      (user.rating * user.totalRatings + rating) / newTotal;

    user.rating = Math.round(newRating * 10) / 10; // 1 decimal place
    user.totalRatings = newTotal;
    await user.save();

    res.status(200).json({
      message: "Rating submitted.",
      rating: user.rating,
      totalRatings: user.totalRatings,
    });
  } catch (error) {
    console.error("❌ Error rating user:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};