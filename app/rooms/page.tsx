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

// Simplified interface without hotel_id
interface Room {
  id: string;
  room_number: string;
  type: string;
  price_per_night: number;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      const { data, error } = await supabase
        .from("rooms")
        .select(`
          id,
          room_number,
          type,
          price_per_night,
          created_at
        `);

      if (error) {
        console.error("Error fetching rooms:", error);
      } else {
        setRooms(data || []);
      }

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }

    fetchRooms();
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
        <div className="flex">
          <div className="w-2/3 overflow-x-auto shadow-md rounded-lg border border-gray-100">
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price/Night</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="shrink-cell">{room.room_number}</TableCell>
                        <TableCell className="shrink-cell">{room.type}</TableCell>
                        <TableCell className="shrink-cell">${room.price_per_night.toFixed(2)}</TableCell>
                        <TableCell className="shrink-cell">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Room</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete Room</DropdownMenuItem>
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
    padding: 8px 16px; /* Reduced padding for compact columns */
    white-space: nowrap; /* Prevents text from wrapping */
  }
      `}</style>
    </Layout>
  );
}