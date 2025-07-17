export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">About Us</h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Ticket Runners, we're passionate about connecting people with
                amazing events. Our platform makes it easy to discover, book,
                and attend the events that matter to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
              <p className="text-muted-foreground leading-relaxed">
                We provide a comprehensive event booking platform that helps
                event organizers reach their audience and helps attendees find
                their perfect events. From concerts to conferences, festivals to
                workshops, we've got it all covered.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Innovation</h3>
                  <p className="text-sm text-muted-foreground">
                    Constantly improving our platform with cutting-edge
                    technology
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Building connections between event organizers and attendees
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Excellence</h3>
                  <p className="text-sm text-muted-foreground">
                    Delivering exceptional experiences for all our users
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
