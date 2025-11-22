


import Ride from "../models/Ride.js";
import User from "../models/User.js";

// ===============================
// 📌 Create a Ride
// ===============================
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
//     } = req.body;

//     if (!from || !to || !date || !time || !availableSeats || !pricePerSeat) {
//       return res.status(400).json({
//         message: "All required fields must be provided.",
//       });
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
//       status: "active",
//     });

//     res.status(201).json({ message: "Ride created successfully!", ride: newRide });
//   } catch (error) {
//     console.error("Error creating ride:", error);
//     res.status(500).json({ message: "Server error while creating ride." });
//   }
// };

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
    } = req.body;

    if (!from || !to || !date || !time || !availableSeats || !pricePerSeat) {
      return res.status(400).json({ message: "All required fields must be provided." });
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
      vehicleDetails,
      bookingPreference: bookingPreference || "review",
      status: "active",
    });

    res.status(201).json({ message: "Ride created successfully!", ride: newRide });
  } catch (error) {
    console.error("Error creating ride:", error);
    res.status(500).json({ message: "Server error while creating ride." });
  }
};


// ===============================
// 🔍 Search Rides (Fixed)
// ===============================
export const searchRides = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        message: "Please provide both 'from' and 'to' locations.",
      });
    }

    // ✅ Build the search query dynamically
    const query = {
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
      ],
    };

    if (date) {
      // ✅ Match only rides on that date (ignore time)
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.$and.push({ date: { $gte: start, $lte: end } });
    }

    const rides = await Ride.find(query)
      .populate("driver", "name email")
      .sort({ date: 1, time: 1 });

    if (!rides.length) {
      return res.status(404).json({ message: "No rides found." });
    }

    res.status(200).json(rides);
  } catch (error) {
    console.error("❌ Error searching rides:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ===============================
// 🔍 Get Ride by ID
// ===============================
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
      .populate("driver", "name email phone photo isVerified")
      .populate("requests.user", "name email")
      .populate("passengers.user", "name email");

    if (!ride) return res.status(404).json({ message: "Ride not founhhhhd" });

    res.status(200).json(ride);
  } catch (error) {
    console.error("Error fetching ride details:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// // ===============================
// // 🚗 Passenger requests a ride
// // ===============================
// export const requestRide = async (req, res) => {
//   try {
//     const { rideId, seatsRequested } = req.body;
//     const userId = req.user._id;

//     const ride = await Ride.findById(rideId);
//     if (!ride) return res.status(404).json({ message: "Ride not found" });

//     // Prevent duplicate request
//     const existingRequest = ride.requests.find(
//       (r) => r.user.toString() === userId.toString()
//     );
//     if (existingRequest)
//       return res.status(400).json({ message: "You already requested this ride." });

//     ride.requests.push({
//       user: userId,
//       seatsRequested,
//       status: "pending",
//     });

//     await ride.save();

//     res.status(200).json({ message: "Ride request sent to driver!" });
//   } catch (err) {
//     console.error("Error requesting ride:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// ===============================
// 🚗 Passenger requests a ride (Hybrid Safe Version)
// ===============================
export const requestRide = async (req, res) => {
  try {
    const { rideId, seatsRequested } = req.body;
    const userId = req.user._id;

    if (!rideId || !seatsRequested)
      return res.status(400).json({ message: "Missing rideId or seatsRequested." });

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    // Check existing request
    const existingRequest = ride.requests.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.status(400).json({ message: "Request already pending approval." });
      } else if (existingRequest.status === "approved") {
        return res.status(400).json({ message: "You are already approved for this ride." });
      } else if (existingRequest.status === "rejected") {
        // ✅ Allow rebooking: reset status to pending
        existingRequest.status = "pending";
        existingRequest.seatsRequested = seatsRequested;
        await ride.save();
        return res.status(200).json({ message: "Rebooking request sent again!" });
      }
    }

    // No previous request → create new one
    ride.requests.push({
      user: userId,
      seatsRequested,
      status: "pending",
    });

    await ride.save();
    res.status(200).json({ message: "Ride request sent to driver!" });
  } catch (err) {
    console.error("❌ Error in requestRide:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ===============================
// ✅ Approve or ❌ Reject Ride Request
// ===============================
// ===============================
// ✅ Approve or ❌ Reject Ride Request
// ===============================
export const handleRideRequest = async (req, res) => {
  try {
    console.log("📩 Incoming handle request call");
    console.log("🔹 Body:", req.body);
    console.log("🔹 User:", req.user?._id);

    const { rideId, requestId, action } = req.body; // action = "approve" | "reject"
    const driverId = req.user._id;

    console.log(`➡️ Action: ${action}, Ride: ${rideId}, Request: ${requestId}`);

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (String(ride.driver._id || ride.driver.id || ride.driver) !== String(driverId)) {
  return res.status(403).json({ message: "Not authorized" });
}


    // const request = ride.requests.id(requestId);
    // if (!request) return res.status(404).json({ message: "Request not found" });

    let request = ride.requests.id(requestId);
if (!request) {
  request = ride.requests.find(
    (r) => String(r._id) === String(requestId) || String(r.id) === String(requestId)
  );
}
if (!request) return res.status(404).json({ message: "Request not found" });


    if (request.status !== "pending")
      return res.status(400).json({ message: "Request already handled" });

    if (action === "approve") {
      if (ride.availableSeats < request.seatsRequested)
        return res.status(400).json({ message: "Not enough available seats" });

      request.status = "approved";
      ride.availableSeats -= request.seatsRequested;
      ride.passengers.push({
        user: request.user,
        seatsBooked: request.seatsRequested,
      });
    } else if (action === "reject") {
      request.status = "rejected";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await ride.save();
    console.log("✅ Ride updated successfully");
    res.status(200).json({ message: `Request ${action}ed successfully`, ride });
  } catch (err) {
    console.error("❌ Error handling ride request:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// ===============================
// 🧾 Get All Rides Created by Logged-in Driver
// ===============================
export const getMyRides = async (req, res) => {
  try {
    const userId = req.user.id;

    const rides = await Ride.find({ driver: userId })
      .populate("driver", "name email phone")
      .populate("requests.user", "name email")
      .populate("passengers.user", "name email")
      .sort({ date: -1 });

    if (!rides || rides.length === 0) {
      return res.status(404).json({ message: "No rides found for this user." });
    }

    res.status(200).json(rides);
  } catch (error) {
    console.error("Error fetching user rides:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// 🚘 Direct Booking (Optional)
// ===============================
export const bookRide = async (req, res) => {
  try {
    const { rideId, seatsBooked } = req.body;

    if (!rideId || !seatsBooked) {
      return res.status(400).json({ message: "Ride ID and seat count are required." });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found." });
    }

    if (ride.availableSeats < seatsBooked) {
      return res.status(400).json({ message: "Not enough available seats." });
    }

    ride.passengers.push({
      user: req.user._id,
      seatsBooked,
    });

    ride.availableSeats -= seatsBooked;

    if (ride.availableSeats === 0) {
      ride.status = "completed";
    }

    await ride.save();
    res.status(200).json({ message: "Ride booked successfully", ride });
  } catch (error) {
    console.error("Error booking ride:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// ❌ Delete a Ride (Driver Only)
// ===============================
export const deleteRide = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Ride ID missing." });

    const ride = await Ride.findById(id);
    if (!ride) return res.status(404).json({ message: "Ride not found." });

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this ride." });
    }

    await ride.deleteOne();
    res.status(200).json({ message: "Ride deleted successfully." });
  } catch (error) {
    console.error("Error deleting ride:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🧩 Find rides where this user has made a request
    const rides = await Ride.find({ "requests.user": userId })
      .populate("driver", "name email phone") // 👈 populate driver info
      .populate("requests.user", "name email")
      .sort({ date: -1 });

    // ✅ Filter each ride to only keep the request belonging to this user
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
      };
    });

    res.json(myBookings);
  } catch (err) {
    console.error("❌ Error fetching my bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};
