"use client";

import { AppointmentCard } from "@/components/patient/appointment-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppointments } from "@/hooks/use-patient-queries";

export default function AppointmentsPage() {
  const appointmentsQuery = useAppointments();

  if (appointmentsQuery.isLoading) {
    return <LoadingSkeleton />;
  }

  if (appointmentsQuery.isError || !appointmentsQuery.data) {
    return (
      <ErrorState
        description="Please retry after a moment."
        title="Unable to load appointments"
      />
    );
  }

  const appointments = appointmentsQuery.data;
  const upcoming = appointments.filter((item) => ["Booked", "Checked In"].includes(item.status));
  const past = appointments.filter((item) => ["Completed", "Cancelled"].includes(item.status));

  return (
    <Tabs defaultValue="upcoming">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past Visits</TabsTrigger>
        <TabsTrigger value="all">All</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        {upcoming.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((appointment) => (
              <AppointmentCard appointment={appointment} key={appointment.id} />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Book a visit to view upcoming appointments"
            title="No upcoming appointments"
          />
        )}
      </TabsContent>

      <TabsContent value="past">
        {past.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {past.map((appointment) => (
              <AppointmentCard appointment={appointment} key={appointment.id} />
            ))}
          </div>
        ) : (
          <EmptyState description="Completed visits will appear here" title="No past appointments" />
        )}
      </TabsContent>

      <TabsContent value="all">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {appointments.map((appointment) => (
            <AppointmentCard appointment={appointment} key={appointment.id} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
