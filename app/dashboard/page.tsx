"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { DollarSign, BedDouble, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Initialize Supabase client directly in this file using environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function HotelDashboard() {
  const router = useRouter(); // Initialize useRouter
  const [totalRevenue, setTotalRevenue] = useState<number>(0); // State to store total revenue
  const [recentBookings, setRecentBookings] = useState<any[]>([]); // State to store recent bookings
  const [revenueData, setRevenueData] = useState<any[]>([]);

  // Fetch total revenue directly from Supabase using the provided query
  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const { data, error } = await supabase
          .from("rev") // Your table name (rev)
          .select("total_price"); // Select the column with prices

        if (error) {
          console.error("Error fetching total revenue:", error);
        } else {
          const total = data?.reduce((sum, row) => sum + row.total_price, 0) || 0; // Sum the total prices
          setTotalRevenue(total); // Update state with fetched revenue
        }

        if (error) {
          console.error("Error fetching total revenue:", error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTotalRevenue();
  }, []);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Fetch data using the SQL query
        const { data, error } = await supabase
          .from("restaurant_reservations")
          .select("price, restaurant_id, user_id, users(*)") // Select necessary columns including related users data

        if (error) {
          console.error("Error fetching revenue data:", error);
        } else {
          setRevenueData(data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRevenueData(); // Call the function to fetch data
  }, []);


  // Fetch recent bookings with confirmed status
  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        const { data, error } = await supabase
          .from("rev")
          .select("id, guest_name, check_in_date, check_out_date, total_price, status")
          .eq("status", "Confirmed")
          .order("check_in_date", { ascending: false });

        if (error) {
          console.error("Error fetching recent bookings:", error);
        } else {
          setRecentBookings(data || []);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchRecentBookings();
  }, []);

  return (
    <Layout>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div> {/* Display the revenue */}
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5%</div>
            <p className="text-xs text-muted-foreground">+3.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,543</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">256,789</div>
            <p className="text-xs text-muted-foreground">+2,345 since last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Bookings</CardTitle>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="#">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Check-In Date</TableHead>
                    <TableHead>Check-Out Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((booking: any) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.guest_name}</TableCell>
                      <TableCell>{new Date(booking.check_in_date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.check_out_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="default">{booking.status}</Badge> {/* Display booking status */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No recent bookings found.</p>
            )}
          </CardContent>
        </Card>

        {/* New Card for Food and Drink Revenue */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Food And Drink Revenue</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Restaurant ID</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {revenueData.map((item: any) => (
              <TableRow key={item.restaurant_id}>
                <TableCell>{item.restaurant_id}</TableCell>
                <TableCell>${item.price.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
              </Table>
            ) : (
              <p>No revenue data found.</p>
            )}
            <div className="flex items-center gap-4 mt-4">
              <div className="grid gap-1">
          {/* <p className="text-sm font-medium leading-none">Total Revenue</p> */}
              </div>
              {/* <div className="ml-auto font-medium">
          <DollarSign className="inline h-5 w-5 mr-1" />
          {totalRevenue.toLocaleString()}
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
