'use client';

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import supabase from "@/supabaseClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Layout from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
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
      

      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
<Card>
<CardContent>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>RID</TableHead>
        <TableHead>Guest Name</TableHead>
        <TableHead>Room Type</TableHead>
        <TableHead>Check-in Date</TableHead>
        <TableHead>Check-out Date</TableHead>
        <TableHead>Guests</TableHead>
        <TableHead>Payment Status</TableHead>
        <TableHead>Total Price</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {bookings.map((booking) => (
        <TableRow key={booking.reservation_id}>
        <TableCell>{booking.reservation_id}</TableCell>
        <TableCell>{booking.room_type}</TableCell>
        <TableCell>{new Date(booking.check_in_date).toLocaleDateString()}</TableCell>
        <TableCell>{new Date(booking.check_out_date).toLocaleDateString()}</TableCell>
        <TableCell>{booking.number_of_guests}</TableCell>
        <TableCell>{booking.payment_status}</TableCell>
        <TableCell>${booking.total_price.toFixed(2)}</TableCell>
        <TableCell>
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
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</CardContent>
</Card>
</div>
)}
</Layout>
);
}

export default Bookings;
