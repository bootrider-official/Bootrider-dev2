import Ride from "../models/Ride.js";

// ===============================
// 📌 Create a Ride
// ===============================
export const createRide = async (req, res) => {
  try {
    const user = req.user;

    const {
      from,
      to,
      stops,
      date,
      time,
      availableSeats,
      pricePerSeat,
      vehicleDetails,
    } = req.body;

    if (!from || !to || !date || !time || !availableSeats || !pricePerSeat) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const newRide = new Ride({
      driver: user._id,
      from,
      to,
      stops: stops || [],
      date,
      time,
      availableSeats,
      pricePerSeat,
      vehicleDetails,
    });

    await newRide.save();

    res.status(201).json({ message: "Ride created successfully!", ride: newRide });
  } catch (error) {
    console.error("Error creating ride:", error);
    res.status(500).json({ message: "Server error while creating ride." });
  }
};

// ===============================
// 🔍 Search Rides
// ===============================
export const searchRides = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "Please provide both 'from' and 'to' locations." });
    }

    // Match rides where the 'from' or 'stops' contains the start point
    // and 'to' or 'stops' contains the destination
    const rides = await Ride.find({
      $and: [
        {
          $or: [
            { from: { $regex: from, $options: "i" } },
            { stops: { $regex: from, $options: "i" } },
          ],
        },
        {
          $or: [
            { to: { $regex: to, $options: "i" } },
            { stops: { $regex: to, $options: "i" } },
          ],
        },
        date ? { date: new Date(date) } : {}, // optional date filter
        { status: "active" },
      ],
    }).populate("driver", "name email");

    if (rides.length === 0) {
      return res.status(404).json({ message: "No rides found." });
    }

    res.status(200).json(rides);
  } catch (error) {
    console.error("Error searching rides:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// ❌ Delete a Ride (Driver Only)
// ===============================
export const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found." });
    }

    // Ensure only the driver can delete
    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this ride." });
    }

    await ride.deleteOne();
    res.status(200).json({ message: "Ride deleted successfully." });
  } catch (error) {
    console.error("Error deleting ride:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// 🚗 Book a Ride
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

    // Add passenger
    ride.passengers.push({
      user: req.user._id,
      seatsBooked,
    });

    ride.availableSeats -= seatsBooked;

    // Mark as completed if seats are full
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
export const getMyRides = async (req, res) => {
  try {
    const userId = req.user.id; // comes from JWT middleware

    // Find rides created by this driver
    const rides = await Ride.find({ driver: userId })
      .populate("driver", "name email phone")
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
export const getRideById = async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findById(id).populate("driver", "name email phone photo isVerified");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.status(200).json(ride);
  } catch (error) {
    console.error("Error fetching ride details:", error);
    res.status(500).json({ message: "Server error" });
  }
};