"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
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
import { createClient } from '@supabase/supabase-js';

interface Room {
  id: string;
  room_number: string;
  type: string;
  price_per_night: number;
  hotel_id: string;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof Room; } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [newRoom, setNewRoom] = useState<Room | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const fetchRooms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("rooms")
      .select("id, room_number, type, price_per_night, hotel_id, created_at");

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

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting room:', error);
    } else {
      fetchRooms();
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    const maxRoomNumber = Math.max(...rooms.map(room => parseInt(room.room_number, 10)), 0);
    setNewRoom({
      id: "", // Set this to empty; it will be generated on save
      room_number: (maxRoomNumber + 1).toString(),
      type: "",
      price_per_night: 0,
      hotel_id: "H001",
    });
  };

  const handleSaveNewRoom = async () => {
    if (!newRoom) return;

    // Generate a new ID based on the existing IDs in the database
    const maxId = rooms.reduce((max, room) => {
      const num = parseInt(room.id.replace('R', ''), 10);
      return num > max ? num : max;
    }, 10);
    const newId = `R${(maxId + 1).toString().padStart(3, '0')}`;

    const { error } = await supabase
      .from('rooms')
      .insert({
        id: newId, // Use the generated ID
        room_number: newRoom.room_number,
        type: newRoom.type,
        price_per_night: newRoom.price_per_night,
        hotel_id: newRoom.hotel_id, // Use the default hotel ID
      });

    if (error) {
      console.error('Error creating new room:', error);
    } else {
      fetchRooms();
      setIsCreating(false);
      setNewRoom(null);
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
                                onKeyDown={handleKeyPress}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleUpdate}
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
                                <DropdownMenuItem onClick={() => handleEdit(room, 'room_number')}>Edit Room</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(room.id)} className="text-red-600">Delete Room</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {isCreating && newRoom && (
                        <TableRow>
                          <TableCell>
                            <Input
                              value={newRoom.room_number}
                              disabled
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={newRoom.type}
                              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={String(newRoom.price_per_night)}
                              onChange={(e) => setNewRoom({ ...newRoom, price_per_night: parseFloat(e.target.value) })}
                              className="w-24"
                              type="number"
                            />
                          </TableCell>
                          <TableCell>
                            <Button onClick={handleSaveNewRoom} variant="outline">Save</Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <Button onClick={handleCreateNew} className="mt-4">Add New Room</Button>
              </CardContent>
            </Card>
          </div>
          <Calendar
            mode="single"
            selected={date}
style={{marginLeft: "7%"}}
            
          />
        </div>
      )}
    </Layout>
  );
}