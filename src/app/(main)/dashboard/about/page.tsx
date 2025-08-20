"use client"

import DataManagement from "@/modules/about/data-management-about"

export default function Aboutpage() {

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold capitalize">about </h1>
        <p className="text-muted-foreground">Manage your about us page.</p>
      </div> */}
      <DataManagement />
    </div>
  )
}
