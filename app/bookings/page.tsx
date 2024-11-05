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

// Updated Booking interface to match database columns
interface Booking {
  id: string;  // Changed from reservation_id to id
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

  // Updated select query to match database columns
  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      const { data, error } = await supabase
        .from("reservations")
        .select(`
          id,
          guest_name,
          check_in_date,
          check_out_date,
          room_type,
          number_of_guests,
          payment_status,
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
    }

    fetchBookings();
  }, []);

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
                    
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.id}</TableCell>
                      <TableCell>{booking.guest_name}</TableCell>
                      <TableCell>{booking.room_type}</TableCell>
                      <TableCell>{new Date(booking.check_in_date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.check_out_date).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.number_of_guests}</TableCell>
                      <TableCell>{booking.payment_status}</TableCell>
                      <TableCell>${booking.total_price.toFixed(2)}</TableCell>
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
      `}</style>
    </Layout>
  );
}

export default Bookings;