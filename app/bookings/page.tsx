"use client"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Layout from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from '@supabase/supabase-js'

// Updated Booking interface to match database columns
interface Booking {
  id: string;  // Changed from reservation_id to id
  guest_name: string;
  guest_nationality: string;
  check_in_date: string;
  check_out_date: string;
  room_type: string;
  room_number: string | null;  // Added room_number
  number_of_guests: number;
  total_price: number;
}

function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  // Define the fetchBookings function
  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("rev")
      .select(`
        id,
        guest_name,
        guest_nationality,
        check_in_date,
        check_out_date,
        room_type,
        room_number,
        number_of_guests,
        total_price
      `);

    if (error) {
      console.error("Error fetching bookings:", error);
    } else {
      setBookings(data || []);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCheckIn = async (bookingId: string) => {
    const randomRoomNumber = Math.floor(100 + Math.random() * 900).toString();
    const { error } = await supabase
      .from('rev')
      .update({ room_number: randomRoomNumber })
      .eq('id', bookingId);

    if (error) {
      console.error('Error checking in:', error);
    } else {
      fetchBookings();
    }
  };

  const handleCheckOut = async (bookingId: string) => {
    const { error } = await supabase
      .from('rev')
      .update({ room_number: null })
      .eq('id', bookingId);

    if (error) {
      console.error('Error checking out:', error);
    } else {
      fetchBookings();
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('rev')
      .delete()
      .eq('id', bookingId);

    if (error) {
      console.error('Error deleting booking:', error);
    } else {
      fetchBookings();
    }
  };

  return (
    <Layout>
      {loading ? (
        <div className="loader-container">
          <div className="spinner">
            {[...Array(8)].map((_, index) => (
              <span key={index}></span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="w-3/4 overflow-x-auto shadow-md rounded-lg border border-gray-100">
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest Name</TableHead>
                      <TableHead>Nationality</TableHead>
                      <TableHead>Check-In Date</TableHead>
                      <TableHead>Check-Out Date</TableHead>
                      <TableHead>Room Type</TableHead>
                      <TableHead>Room Number</TableHead>
                      <TableHead>Number of Guests</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="shrink-cell">{booking.guest_name}</TableCell>
                        <TableCell className="shrink-cell">{booking.guest_nationality}</TableCell>
                        <TableCell className="shrink-cell">{new Date(booking.check_in_date).toLocaleDateString()}</TableCell>
                        <TableCell className="shrink-cell">{new Date(booking.check_out_date).toLocaleDateString()}</TableCell>
                        <TableCell className="shrink-cell">{booking.room_type}</TableCell>
                        <TableCell className="shrink-cell">{booking.room_number}</TableCell>
                        <TableCell className="shrink-cell">{booking.number_of_guests}</TableCell>
                        <TableCell className="shrink-cell">${booking.total_price.toFixed(2)}</TableCell>
                        <TableCell className="shrink-cell">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleCheckIn(booking.id)}>Check-In</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCheckOut(booking.id)}>Check-Out</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteBooking(booking.id)}>Delete Booking</DropdownMenuItem>
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
          <div className="w-1/4 p-4">
            {/* Add your calendar component here */}
            <div className="calendar">
              {/* Calendar content */}
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .spinner {
          position: relative;
          width: 60px;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
        }

        .spinner span {
          position: absolute;
          top: 50%;
          left: var(--left);
          width: 35px;
          height: 7px;
          background: #ffff;
          animation: dominos 1s ease infinite;
          box-shadow: 2px 2px 3px 0px black;
        }

        .spinner span:nth-child(1) { --left: 80px; animation-delay: 0.125s; }
        .spinner span:nth-child(2) { --left: 70px; animation-delay: 0.3s; }
        .spinner span:nth-child(3) { --left: 60px; animation-delay: 0.425s; }
        .spinner span:nth-child(4) { --left: 50px; animation-delay: 0.54s; }
        .spinner span:nth-child(5) { --left: 40px; animation-delay: 0.665s; }
        .spinner span:nth-child(6) { --left: 30px; animation-delay: 0.79s; }
        .spinner span:nth-child(7) { --left: 20px; animation-delay: 0.915s; }
        .spinner span:nth-child(8) { --left: 10px; }

        @keyframes dominos {
          50% { opacity: 0.7; }
          75% { transform: rotate(90deg); }
          80% { opacity: 1; }
        }

        .shrink-cell {
          padding: 4px 8px;
        }
      `}</style>
    </Layout>
  );
}

export default Bookings;