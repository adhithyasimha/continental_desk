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
import { Input } from "@/components/ui/input";
import { createClient } from '@supabase/supabase-js'

interface Room {
  id: string;
  room_number: string;
  type: string;
  price_per_night: number;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: keyof Room;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const fetchRooms = async () => {
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

    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleEdit = (room: Room, field: keyof Room) => {
    setEditingCell({ id: room.id, field });
    setEditValue(String(room[field]));
  };

  const handleUpdate = async () => {
    if (!editingCell) return;

    const { id, field } = editingCell;
    let value = editValue;

    // Convert to number if the field is price_per_night
    if (field === 'price_per_night') {
      value = parseFloat(editValue).toString();
    }

    const { error } = await supabase
      .from('rooms')
      .update({ [field]: value })
      .eq('id', id);

    if (error) {
      console.error('Error updating room:', error);
    } else {
      // Refresh the rooms data
      fetchRooms();
    }

    setEditingCell(null);
    setEditValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdate();
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
          <div className="w-2/3 overflow-x-auto shadow-md rounded-lg border border-gray-100">
            <Card>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 z-10">
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
                          <TableCell className="shrink-cell">
                            {editingCell?.id === room.id && editingCell.field === 'room_number' ? (
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleUpdate}
                                onKeyPress={handleKeyPress}
                                className="w-24"
                                autoFocus
                              />
                            ) : (
                              <span onClick={() => handleEdit(room, 'room_number')}>{room.room_number}</span>
                            )}
                          </TableCell>
                          <TableCell className="shrink-cell">
                            {editingCell?.id === room.id && editingCell.field === 'type' ? (
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleUpdate}
                                onKeyPress={handleKeyPress}
                                className="w-32"
                                autoFocus
                              />
                            ) : (
                              <span onClick={() => handleEdit(room, 'type')}>{room.type}</span>
                            )}
                          </TableCell>
                          <TableCell className="shrink-cell">
                            {editingCell?.id === room.id && editingCell.field === 'price_per_night' ? (
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleUpdate}
                                onKeyPress={handleKeyPress}
                                className="w-24"
                                type="number"
                                autoFocus
                              />
                            ) : (
                              <span onClick={() => handleEdit(room, 'price_per_night')}>
                                ${room.price_per_night.toFixed(2)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="shrink-cell">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">Actions</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(room, 'room_number')}>
                                  Edit Room
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Delete Room</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-1/4 p-4">
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
          padding: 8px 16px;
          white-space: nowrap;
          cursor: pointer;
        }

        .shrink-cell span:hover {
          background-color: #f3f4f6;
          padding: 4px 8px;
          border-radius: 4px;
        }
      `}</style>
    </Layout>
  );
}