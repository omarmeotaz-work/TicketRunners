import { Organizer } from "@/pages/Index";
import OrganizerBlock from "@/components/OrganizerBlock";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

export default function OrganizersPage() {
  const testOrganizers: Organizer[] = [
    {
      id: "org-1",
      name: "Cairo Beats",
      logoUrl: "https://source.unsplash.com/80x80/?music",
      bio: "A collective bringing electrifying music experiences to life.",
      events: [
        {
          id: "evt-101",
          title: "Desert Bass Festival",
          date: "2025-09-12",
          venue: "Giza Sound Arena",
          location: "Giza Plateau",
          ticketsSold: 470,
          ticketsLeft: 30,
          freeTickets: 5,
        },
        {
          id: "evt-102",
          title: "Sunset House Party",
          date: "2025-09-28",
          venue: "Nile Rooftop Lounge",
          location: "Downtown Cairo",
          ticketsSold: 150,
          ticketsLeft: 50,
          freeTickets: 10,
        },
        {
          id: "evt-103",
          title: "Electronic Nights Vol. 5",
          date: "2025-10-15",
          venue: "Cairo Expo City",
          location: "New Cairo",
          ticketsSold: 800,
          ticketsLeft: 200,
          freeTickets: 20,
        },
      ],
    },
    {
      id: "org-2",
      name: "Cultura Hub",
      logoUrl: "https://source.unsplash.com/80x80/?culture",
      bio: "Creating immersive cultural, literary, and artistic gatherings.",
      events: [
        {
          id: "evt-201",
          title: "Literature and Light",
          date: "2025-08-18",
          venue: "El Sawy Culturewheel",
          location: "Zamalek, Cairo",
          ticketsSold: 120,
          ticketsLeft: 30,
          freeTickets: 5,
        },
        {
          id: "evt-202",
          title: "Art on the Nile",
          date: "2025-09-01",
          venue: "Open Gallery Promenade",
          location: "Maadi Corniche",
          ticketsSold: 220,
          ticketsLeft: 80,
          freeTickets: 12,
        },
        {
          id: "evt-203",
          title: "Fusion Dance Expo",
          date: "2025-09-30",
          venue: "Cairo International Theater",
          location: "Nasr City",
          ticketsSold: 300,
          ticketsLeft: 100,
          freeTickets: 15,
        },
        {
          id: "evt-204",
          title: "Urban Poetry Slam",
          date: "2025-10-07",
          venue: "The Writers' Lounge",
          location: "Heliopolis",
          ticketsSold: 90,
          ticketsLeft: 10,
          freeTickets: 5,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Event Organizers
          </h1>
          <p className="text-muted-foreground">
            Discover top organizers and the events they’re hosting.
          </p>
        </div>

        <Separator className="my-6" />

        <div className="space-y-10">
          {testOrganizers.map((org) => (
            <OrganizerBlock key={org.id} org={org} />
          ))}
        </div>
      </main>
    </div>
  );
}
