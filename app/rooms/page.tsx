"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import Layout from "@/components/ui/layout"
export default function Rooms() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div>
    <Layout>
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border mr-4" 
      style={{ marginLeft: '75%' }} 
    />
    </Layout>
    </div>
  )
}

