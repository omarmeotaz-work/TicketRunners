import React from "react";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";

interface Merchant {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const merchants: Merchant[] = [
  {
    name: "Cairo Bookstore",
    address: "12 Tahrir St, Downtown Cairo",
    lat: 30.0444,
    lng: 31.2357,
  },
  {
    name: "Alex Boutique",
    address: "45 El Raml Station, Alexandria",
    lat: 31.2001,
    lng: 29.9187,
  },
  {
    name: "Giza Café",
    address: "87 Haram Street, Giza",
    lat: 30.0131,
    lng: 31.2089,
  },
];

export default function NearbyMerchants() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-10">
          {t("nearby_merchants.title")}
        </h1>

        <div className="space-y-6">
          {merchants.map((merchant, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 bg-card shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-foreground">
                {merchant.name}
              </h2>
              <p className="text-muted-foreground mb-2">{merchant.address}</p>
              <a
                href={`https://www.google.com/maps?q=${merchant.lat},${merchant.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-500 hover:underline text-sm"
              >
                <MapPin className="h-4 w-4 mr-1" />
                {t("nearby_merchants.view_on_map")}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
