import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  Users,
  Ticket,
  Share2,
  Heart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EventDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const handleBooking = () => {
    window.location.href = `/booking/${id}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Event link copied to clipboard",
    });
  };

  // Mock event data - replace with actual data fetching
  const event = {
    id: id,
    title: "Ahmed Sheba Live Concert",
    image: "/src/assets/event1.jpg",
    date: "March 15, 2025",
    time: "8:00 PM",
    location: "Cairo Opera House",
    price: 150,
    originalPrice: 200,
    category: "Music",
    rating: 4.8,
    attendees: 1250,
    description:
      "Join us for an unforgettable evening with Ahmed Sheba, one of Egypt's most beloved musicians. Experience his greatest hits in an intimate setting at the prestigious Cairo Opera House.",
    isFeatured: true,
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Event Image */}
          <div className="relative overflow-hidden rounded-xl mb-8">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-96 object-cover"
            />

            {/* Overlay Actions */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                variant="icon"
                size="icon"
                className="bg-background/80 backdrop-blur-sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="icon"
                size="icon"
                className="bg-background/80 backdrop-blur-sm"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {event.isFeatured && (
                <Badge className="bg-gradient-primary text-primary-foreground border-0">
                  Featured
                </Badge>
              )}
              <Badge
                variant="secondary"
                className="bg-background/80 backdrop-blur-sm"
              >
                {event.category}
              </Badge>
            </div>
          </div>

          {/* Event Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                {event.title}
              </h1>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-3" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-2" />
                  <span className="font-medium">{event.rating}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  About this event
                </h2>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="card-elevated p-6 sticky top-24">
                <div className="mb-6">
                  <div className="flex items-center space-x-2">
                    {event.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {event.originalPrice} EGP
                      </span>
                    )}
                    <span className="text-3xl font-bold text-primary">
                      {event.price} EGP
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">per ticket</p>
                </div>

                <Button
                  variant="gradient"
                  className="w-full mb-4 group/btn"
                  onClick={handleBooking}
                >
                  <Ticket className="h-4 w-4 mr-2 transition-transform group-hover/btn:scale-110" />
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;
