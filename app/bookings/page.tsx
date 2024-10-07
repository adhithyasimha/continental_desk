'use client';

import React, { useEffect, useState } from "react";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import supabase from "@/supabaseClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Layout from "@/components/ui/layout";

// Define the Booking interface
interface Booking {
  reservation_id: string;
  guest_name: string;
  check_in_date: string;
  check_out_date: string;
  room_type: string;
  number_of_guests: number;
  payment_status: string;
  total_price: number;
}

function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      const { data, error } = await supabase
        .from("reservations")
        .select("reservation_id, guest_name, check_in_date, check_out_date, room_type, number_of_guests, payment_status, total_price");

      if (error) {
        console.error("Error fetching bookings:", error);
      } else {
        setBookings(data);
      }
      setLoading(false);
    }

    fetchBookings();
  }, []);

  return (
    <Layout>
      <h1 className="text-xl font-semibold mb-4">Bookings</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <Table>
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Guest Name</th>
                <th>Room Type</th>
                <th>Check-in Date</th>
                <th>Check-out Date</th>
                <th>Guests</th>
                <th>Payment Status</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.reservation_id}>
                  <td>{booking.reservation_id}</td>
                  <td>{booking.guest_name}</td>
                  <td>{booking.room_type}</td>
                  <td>{new Date(booking.check_in_date).toLocaleDateString()}</td>
                  <td>{new Date(booking.check_out_date).toLocaleDateString()}</td>
                  <td>{booking.number_of_guests}</td>
                  <td>{booking.payment_status}</td>
                  <td>${booking.total_price.toFixed(2)}</td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button>Actions</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Layout>
  );
}

export default Bookings;
