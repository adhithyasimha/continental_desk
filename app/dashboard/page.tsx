"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from '@supabase/supabase-js'
import {
  DollarSign,
  BedDouble,
  Calendar,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Layout from "@/components/ui/layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

// Initialize Supabase client directly in this file using environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function HotelDashboard() {
  const router = useRouter(); // Initialize useRouter
  const [totalRevenue, setTotalRevenue] = useState<number>(0); // State to store total revenue

  // Fetch total revenue directly from Supabase using the provided query
  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const { data, error } = await supabase
          .from('rev') // Your table name (rev)
          .select('total_price'); // Select the column with prices

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

  return (
    <Layout>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div> {/* Display the revenue */}
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Occupancy Rate
            </CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5%</div>
            <p className="text-xs text-muted-foreground">
              +3.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,543</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Loyalty Members
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">256,789</div>
            <p className="text-xs text-muted-foreground">
              +2,345 since last month
            </p>
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
              <Link href="#">
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <p>Table with recent bookings...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Food And Drink Revenue </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  ygwedef-wefoje-wfhie
                </p>
              </div>
              <div className="ml-auto font-medium">$2,345,678</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p>uieqgfeuw-weifhei</p>
              </div>
              <div className="ml-auto font-medium">+$39.00</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
